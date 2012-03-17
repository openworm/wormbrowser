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
# Functions for converting open-3d-viewer metadata files, which are
# human-editable, into terser JSON versions for use by the viewer.

import json
import os
import sys
import directed_graph

# TODO(arthurb): make these cmd-line flags or similar
PARTS_INFO_FILE = 'parts_info.txt'
GROUPINGS_FILE = 'groupings.txt'
OUTPUT_FILE = 'entity_metadata.json'
LANGUAGE = 'en_us'

def wl(file, line):
  file.write(line)
  file.write('\n')

def isBlankLine(line):
  return line.strip() == ''

def isDataLine(line):
  return line.startswith('\t')
  
def isCommentLine(line):
  return line.startswith('#')

def readIndentFormattedFile(filename):
  READSTATE_SCANNINGFORSECTION = 1
  READSTATE_READINGSECTION = 2

  read_state = READSTATE_SCANNINGFORSECTION
  sections = {}

  f = open(filename, 'r')
  t = f.read()
  f.close()
  lines = t.split('\n')
  line_count = len(lines)
  for line_num in xrange(line_count):
    line = lines[line_num]
    if isCommentLine(line):
      continue
    if (read_state == READSTATE_SCANNINGFORSECTION):
      if isBlankLine(line) or isDataLine(line):
        continue
      new_section_name = line
      new_section = []
      read_state = READSTATE_READINGSECTION
    elif (read_state == READSTATE_READINGSECTION):
      if isDataLine(line):
        new_section.append(line.strip())
      
      if ((line_num == line_count - 1) or
          not(isDataLine(line))):
        sections[new_section_name] = new_section
        read_state = READSTATE_SCANNINGFORSECTION
  return sections

def getParts(parts_info_filename):
  # Reads the file that gives info about each part of the model.
  file_sections = readIndentFormattedFile(parts_info_filename)
  parts = {}
  for section in file_sections:
    new_part = {}
    for line in file_sections[section]:
      line_parts = line.split(':')
      key = line_parts[0].strip()
      val = line_parts[1].strip()
      new_part[key] = val
    parts[section] = new_part
  return parts

def isLayer(part):
  return ('layer' in part) and (part['layer'] == 'yes')

def isSublayer(part):
  return ('type' in part) and (part['type'] == 'sublayer')

def transferPartInfoToGraphNode(graph, node_name, part_info):
  for key in part_info:
    graph.SetNodeData(node_name, key, part_info[key])

def getGrouping(grouping_filename, parts_info):
  # Reads the file that specifies relationships between parts and groups.
  # Skips sublayer-related groups: see getSublayers() for why.
  graph = directed_graph.DirectedGraph()

  file_sections = readIndentFormattedFile(grouping_filename)
  for section in file_sections:
    node1_name = section
    node1_info = parts_info[node1_name]
    if isSublayer(node1_info):
      continue
    graph.AddNode(node1_name)
    transferPartInfoToGraphNode(graph, node1_name, node1_info)

    for line in file_sections[section]:
      node2_name = line
      node2_info = parts_info[node2_name]
      if isSublayer(node2_info):
        continue
      graph.AddNode(node2_name)
      transferPartInfoToGraphNode(graph, node2_name, node2_info)

      graph.AddArcBetween(node1_name, node2_name)

  return graph

def getSublayers(grouping_filename, parts_info):
  # Gets information on sublayers. Sublayers are unusual because they
  # participate in the model structure -- layer > sublayer > parts --
  # but they are not currently part of the DAG. So parse them differently.
  layer_to_sublayer = {}
  sublayer_name_to_index = {}
  sublayer_name_to_item_ids = {}

  file_sections = readIndentFormattedFile(grouping_filename)

  # We don't know whether we'll encounter a sublayer before or after its
  # parent layer or vice versa, so do a first pass through the file and
  # build indices.
  for section in file_sections:
    node1_name = section
    node1_info = parts_info[node1_name]
    for line in file_sections[section]:
      node2_name = line
      node2_info = parts_info[node2_name]
      if isLayer(node1_info) and isSublayer(node2_info):
        layer_id = int(node1_info['id'])
        if not layer_id in layer_to_sublayer:
          layer_to_sublayer[layer_id] = []
        layer_to_sublayer[layer_id].append(node2_name)
      elif isSublayer(node1_info):
        sublayer_name_to_index[node1_name] = int(node1_info['sublayer_index'])
        item_id = int(node2_info['id'])
        if not node1_name in sublayer_name_to_item_ids:
          sublayer_name_to_item_ids[node1_name] = []
        sublayer_name_to_item_ids[node1_name].append(item_id)

  # Convert the indices into final output.
  all_output = []
  for layer_id in layer_to_sublayer:
    layer_output = []
    layer_output.append(layer_id)
    this_layer_sublayers = []
    for sublayer_name in layer_to_sublayer[layer_id]:
      this_sublayer_output = []
      this_sublayer_output.append(sublayer_name_to_index[sublayer_name])
      this_sublayer_output.append(sublayer_name_to_item_ids[sublayer_name])
      this_layer_sublayers.append(this_sublayer_output)
    layer_output.append(this_layer_sublayers)
    all_output.append(layer_output)
  return all_output

def getSymmetryInfo(parts_info):
  # Symmetry info appears in two ways: either a node in the graph can be
  # a symmetry group, in which case it has a separate display name and
  # left/right children; or it can be one of the children, in which case
  # it has a flag specifying left/right.
  symmetries = []
  which_side = {}
  # First pass: just find which side the children are on.
  for node_name in parts_info:
    node_info = parts_info[node_name]
    if 'symmetry_group_side' in node_info:
      which_side[node_name] = node_info['symmetry_group_side']
  # Second pass: build the symmetry entries.
  for node_name in parts_info:
    node_info = parts_info[node_name]
    name_key = 'symmetry_group_name_' + LANGUAGE
    if not name_key in node_info:
      continue
    group_name = node_info[name_key]
    if (group_name):
      group_id = int(node_info['id'])
      group_children = node_info['symmetry_group_children'].split(',')
      group_child1 = group_children[0].strip()
      group_child1_id = int(parts_info[group_child1]['id'])
      group_child2 = group_children[1].strip()
      group_child2_id = int(parts_info[group_child2]['id'])
      this_symmetry_group = []
      this_symmetry_group.append(group_id)
      if which_side[group_child1] == 'left':
        this_symmetry_group.append(group_child1_id)
        this_symmetry_group.append(group_child2_id)
      else:
        this_symmetry_group.append(group_child2_id)
        this_symmetry_group.append(group_child1_id)
      this_symmetry_group.append(group_name)
      symmetries.append(this_symmetry_group)
  return symmetries

def getNames(parts_info):
  # Names are used for two purposes: to specify a display name other than
  # what we'd derive from the name of the object in the 3D model, and to
  # define synonyms.
  names = []
  for node_name in parts_info:
    node_info = parts_info[node_name]
    if not 'id' in node_info:
      continue

    id = int(node_info['id'])
    display_name_key = 'display_name_' + LANGUAGE
    if display_name_key in node_info:
      names_item = [id, node_info[display_name_key]]
      names.append(names_item)

    synonyms_key = 'synonyms_' + LANGUAGE
    if synonyms_key in node_info:
      synonyms = node_info[synonyms_key].split(',')
      for synonym in synonyms:
        names_item = [id, synonym.strip()]
        names.append(names_item)

  return names

def createJSONMetadata(parts_info_filename, grouping_filename):
  parts_info = getParts(parts_info_filename)
  graph = getGrouping(grouping_filename, parts_info)
  node_names = graph.GetAllNodeNames()
  
  entity_metadata = {}

  # Get leafs (sic) and nodes (which means any non-leaf node). Also get
  # layers, which are nodes that are marked as layers.
  leafs = []
  nodes = []
  layers = []
  hidden = []
  dag = []
  for node_name in node_names:
    type = graph.GetNodeData(node_name, 'type')
    id = int(graph.GetNodeData(node_name, 'id'))
    is_layer = graph.GetNodeData(node_name, 'layer')
    is_hidden = graph.GetNodeData(node_name, 'hidden')
    if type == 'part':
      leafs.append([id, node_name])
    elif type == 'group':
      nodes.append([id, node_name])
    if is_layer == 'yes':
      layers.append(id)
    if is_hidden == 'yes':
      hidden.append(id)
      
    dag_node = []
    dag_node.append(id)
    dag_contents = []
    children = graph.GetChildren(node_name)
    if children:
      for child in children:
        dag_contents.append(int(graph.GetNodeData(child, 'id')))
      dag_node.append(dag_contents)
      dag.append(dag_node)

  sublayers = getSublayers(grouping_filename, parts_info)
  symmetries = getSymmetryInfo(parts_info)
  names = getNames(parts_info)

  entity_metadata['dag'] = dag
  entity_metadata['hidden'] = sorted(hidden)
  entity_metadata['layers'] = sorted(layers)
  entity_metadata['leafs'] = leafs
  entity_metadata['names'] = names
  entity_metadata['nodes'] = nodes
  entity_metadata['sublayers'] = sublayers
  entity_metadata['symmetries'] = symmetries

  json_data = json.dumps(entity_metadata, separators=(',',':'))
  return json_data

##########
json_data = createJSONMetadata(PARTS_INFO_FILE, GROUPINGS_FILE)
f = file(OUTPUT_FILE, 'w')
f.write(json_data)
f.close()