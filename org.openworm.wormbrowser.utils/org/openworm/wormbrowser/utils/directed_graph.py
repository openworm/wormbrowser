#!/usr/bin/env python2.6
# Copyright 2011 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Directed graph class.

class DirectedGraph(object):
  """Maintains a directed graph."""

  def __init__(self):
    # Nodes have names, but the nodes themselves are stored by numerical ID to
    # save space. Establish maps of name<=>ID, and an ID counter.
    self._id_to_name = dict()
    self._name_to_id = dict()
    self._next_id = 0

    # The graph is represented by a dictionary of node_ID => {dictionary of
    # outbound arcs}.
    self.outbound_arcs = dict()

    # We also maintain a dictionary of inbound arcs to each node, allowing us
    # to walk "upstream" from a given node. TODO(arthurb): This is not really
    # necessary for this script -- could remove it.
    self.inbound_arcs = dict()

    # Every node has its own dictionary in which you can store key-value pairs.
    # This is useful for things such as setting visual styles on GraphViz
    # output from the graph. This is indexed by ID.
    self.node_data = dict()
    # Each arc has the same thing. This is indexed by (id => id).
    self.arc_data = dict()

    # Used to store recursion limit.
    self.prev_recursion_limit = 0

  def AddNode(self, node_name, warn_if_present=False):
    """Adds a node.

    Args:
      node_name: Name of node.
      warn_if_present: If True, prints warning if an attempt is made to
          add a node that's already there.
    """
    # Does it exist?
    if not node_name in self._name_to_id:
      # No. Add it.
      self._name_to_id[node_name] = self._next_id
      self._id_to_name[self._next_id] = node_name
      self.outbound_arcs[self._next_id] = set()
      self.inbound_arcs[self._next_id] = set()
      self._next_id += 1
    elif warn_if_present:
      print 'Warning: AddNode("%s") is being called more than once.' % node_name

  def RemoveNode(self, node_to_remove):
    """Removes a node and all arcs pointing to it.
    
    Args:
      node_name: Name of node to remove.
    """
    id_to_remove = self._name_to_id[node_to_remove]
    del(self._name_to_id[node_to_remove])
    del(self._id_to_name[id_to_remove])
    del(self.outbound_arcs[id_to_remove])
    del(self.inbound_arcs[id_to_remove])
    
    for name in self._name_to_id:
      id = self._name_to_id[name]
      if id_to_remove in self.inbound_arcs[id]:
        self.inbound_arcs[id].remove(id_to_remove)
      if id_to_remove in self.outbound_arcs[id]:
        self.outbound_arcs[id].remove(id_to_remove)

  def HasNode(self, node_name):
    return node_name in self._name_to_id

  def GetNodeCount(self):
    """Returns number of nodes."""
    return len(self.outbound_arcs)

  def AddArcBetween(self, node1_name, node2_name):
    """Adds arc from one node to another.

    Args:
      node1_name: Name of first node.
      node2_name: Name of second node.
    """
    # Don't add an arc from something to itself.
    if node1_name == node2_name:
      return
    # Add arc.
    id1 = self._name_to_id[node1_name]
    id2 = self._name_to_id[node2_name]
    self.__AddArc(id1, id2)

  def SetNodeData(self, node_name, key, value):
    """Sets data for a given node.

    Args:
      node_name: Name of node.
      key: Key of value to store on node.
      value: Value to store on node.
    """
    node_id = self.__NameToID(node_name)
    if not node_id in self.node_data:
      self.node_data[node_id] = dict()
    self.node_data[node_id][key] = value

  def GetNodeData(self, node_name, key):
    """Gets a value stored via GetNodeData()."""
    if not self.__NodeNameExists(node_name):
      return None
    node_id = self.__NameToID(node_name)
    if not node_id in self.node_data:
      return None
    if not key in self.node_data[node_id]:
      return None
    return self.node_data[node_id][key]

  def SetArcData(self, from_node_name, to_node_name, key, value):
    """Sets data for a given node.

    Args:
      from_node_name: Name of the "from" node of the arc.
      to_node_name: Name of the "to" node of the arc.
      key: Key of value to store on arc.
      value: Value to store on arc.
    """
    from_node_id = self.__NameToID(from_node_name)
    to_node_id = self.__NameToID(to_node_name)
    arc = (from_node_id, to_node_id)
    if not arc in self.arc_data:
      self.arc_data[arc] = dict()
    self.arc_data[arc][key] = value

  def GetArcData(self, from_node_name, to_node_name, key):
    """Gets a value stored via SetArcData()."""
    if (not self.__NodeNameExists(from_node_name) or
        not self.__NodeNameExists(to_node_name)):
      return None
    from_node_id = self.__NameToID(from_node_name)
    to_node_id = self.__NameToID(to_node_name)
    arc = (from_node_id, to_node_id)
    if not arc in self.arc_data:
      return None
    if not key in self.arc_data[arc]:
      return None
    return self.arc_data[arc][key]

  def GetChildren(self, node_name):
    """Gets children for a particular node.
    
    Args:
      node_name: Name of node.
    
    Returns:
      Set of names of child nodes, if any.
    """
    node_id = self.__NameToID(node_name)
    children = set()
    for child in self.outbound_arcs[node_id]:
      children.add(self.__IDToName(child))
    return children

  def GetParents(self, node_name):
    """Gets parents for a particular node.
    
    Args:
      node_name: Name of node.
    
    Returns:
      Set of names of parent nodes, if any.
    """
    node_id = self.__NameToID(node_name)
    parents = set()
    for parent in self.inbound_arcs[node_id]:
      parents.add(self.__IDToName(parent))
    return parents

  def GetAllNodeNames(self):
    """Returns set of all node names."""
    names = set()
    for name in self._name_to_id:
      names.add(name)
    return names

  def PrintContents(self):
    """Prints contents of the graph in a trivial way."""
    for node in self.outbound_arcs:
      print 'Node', node, '(', self._id_to_name[node], ')', ':',
      print sorted(self.outbound_arcs[node])

  def __NameToID(self, the_name):
    """Given the name of a node, returns its ID."""
    return self._name_to_id[the_name]

  def __NodeNameExists(self, the_name):
    """Reports whether a node of a given name is stored."""
    return the_name in self._name_to_id

  def __IDToName(self, the_id):
    """Given the ID of a node, returns its name."""
    return self._id_to_name[the_id]

  def __AddArc(self, id_from, id_to):
    """Adds arc from one node to another.

    Args:
      id_from: ID of first node.
      id_to: ID of second node.
    """
    # Add outbound arc.
    outbound = self.outbound_arcs[id_from]
    if not id_to in outbound:
      outbound.add(id_to)
    # Add note of inbound arc.
    inbound = self.inbound_arcs[id_to]
    if not id_from in inbound:
      inbound.add(id_from)