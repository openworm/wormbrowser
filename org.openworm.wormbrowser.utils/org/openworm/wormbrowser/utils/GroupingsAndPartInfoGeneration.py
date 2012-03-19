'''
Created on Mar 16, 2012

@author: matteocantarelli
'''

#
import re

DATA_FOLDER = ''
PARTS_INFO_FILE = 'parts_info.txt'
GROUPINGS_FILE = 'groupings.txt'
JS_FILE = 'Virtual_Worm.js'
LANGUAGE = 'en_us'


def createFile(content,filename):
    f = open(filename, "wb")
    f.write(content)
    return

def loadFile(filename):
    f = open(filename, "r")
    return f.read()


def getIndented(dictionary,order):
    s=""
    for key in order:
        s+="\n"+key+"\n"
        for value in dictionary[key]:
            s+="\t"+value+"\n"
    return s
        

def generateMaterialsBasedGrouping(js_filename):
    print "STARTING GROUPINGS GENERATION..."
    js=loadFile(js_filename)
    startmaterials=js.find("materials")
    endmaterials=js.find("decodeParams")-4
    materialsstring=js[startmaterials:endmaterials]
    split= materialsstring.split('\'')
    materials={}
    
    for s in split:
        if re.match("^[A-Za-z_]*$",s):
            materials[s+"_layer"]=[]
    urlstring=js[js.find("urls"):len(js)]
    
    for s in urlstring.split("{"):
        if "material" in s:
            section=s[len("material: \'")+1:len(s)]
            m=section[0:section.find('\'')] +"_layer"
            names=s[s.find("names: [")+len("names: ["):s.find("lengths:")-len("lengths:")-4]
            for n in names.split(','):
                pn=n.replace(" ","").replace("\'","")
                if pn is not "":
                    if m in materials.keys():
                        if pn not in materials[m]:
                            materials[m].append(pn);
                    else:
                        materials[m]=[]
    return materials

def writeGroupingsToFile(js_filename,materials,order):
    groupings="worm_body\n"
    for key in order:
        groupings+="\t"+key+"\n"
    groupings+=getIndented(materials,order)
    createFile(groupings,GROUPINGS_FILE)
    print "GROUPINGS GENERATION FINISHED "+GROUPINGS_FILE+" has been generated."
    #print jsstring

def customizeMaterialBasedGroupings(materials,customization):
    groupings = {}
    for c in customization.keys():
        groupings[c]=[]
        for m in materials.keys():
            if m in customization[c]:
                groupings[c].extend(materials[m])
    return groupings


def generatePartsInfo(groupings, js_filename,order):
    parts_info = "# Parts\n"
    eid=5000
    for partlist in groupings.values():
        for part in partlist:
            parts_info+="\n"+part+"\n"
            parts_info+="\t id: "+ str(eid) +"\n"
            parts_info+="\t type: part\n"
            parts_info+="\t display_name: "+part+"\n"
            eid+=1
    parts_info += "\n"
    parts_info += "# Layers\n"
    eid=10
    for layer in order:
        parts_info+="\n"+layer+"\n"
        parts_info+="\t id: "+ str(eid) +"\n"
        parts_info+="\t type: group\n"
        parts_info+="\t display_name: "+layer+"\n"
        parts_info+="\t layer: yes\n"
        parts_info+="\t hidden: yes\n"
        eid+=1
    parts_info += "\n"
    parts_info += "# Group\n"
    parts_info +="\nworm_body\n"
    parts_info+="\tid: 1\n"
    parts_info+="\ttype: group\n"
    parts_info+="\thidden: yes\n"
    createFile(parts_info,PARTS_INFO_FILE)
    return


def generateGroupings(js_filename, customization,order):
    materials=generateMaterialsBasedGrouping(js_filename)
    if(customization is not None):
        materials=customizeMaterialBasedGroupings(materials, customization)
    writeGroupingsToFile(js_filename,materials,order)
    return materials

def generateGroupingsAndPartsInfo(js_filename, customization,order):
    groupings = generateGroupings(js_filename, customization,order)
    generatePartsInfo(groupings,js_filename,order)
    
    
    
##########

LAYERS_ORDER = ['HypCutLayer','MuscleLayer','SensNeurLayer','MotNeurLayer','IntNeurLayer','SocketLayer','SheathLayer','NUFsLayer','PolyNeurLayer','GLRLayer','ExcSysLayer','RectLayer','PharynxLayer','RepSysLayer','IntestineLayer']

CUSTOMIZATION = {'HypCutLayer':['hypodermis_layer','arcade_cells_layer','seam_cell_layer'],
                 'MuscleLayer':['body_wall_muscle_layer','uterine_muscle_layer','vulval_muscle_layer', 'stomatoint_muscle_layer'],
                 'SensNeurLayer':['sensoryneuron_layer'],
                 'MotNeurLayer':['motor_neuron_layer'],
                 'IntNeurLayer':['interneuron_layer','temp_drg_color_layer'],
                 'SocketLayer':['socketcell_layer'],
                 'SheathLayer':['sheathother_layer','coelomocyte_layer'],
                 'NUFsLayer':['neurunkfunc_layer'],
                 'PolyNeurLayer':['polymodalneuron_layer'],
                 'GLRLayer':['germline_layer','glr_cells_layer'],
                 'ExcSysLayer':['excretory_gland_cells_layer','excretory_cell_layer','excretory_pore_cell_layer','excretory_duct_cell_layer'],
                 'RectLayer':['rectal_epithelium_layer','sphnc_&_anal_dep_musc_layer','vpi_&_vir_layer'],
                 'PharynxLayer':['phary_&_rect_glands_layer','pharyngeal_epithelium_layer','head_mesodermal_cell_layer','even_layer','marginal_cells_layer','odd_layer'],
                 'RepSysLayer':['vulva_epithelium_layer','spermatheca_layer','uterus_layer','spermath_uterin_valve_layer','dtc_&_somatic_gonad_layer'],
                 'IntestineLayer':['intestine_layer']                
                 }

generateGroupingsAndPartsInfo(DATA_FOLDER+JS_FILE,CUSTOMIZATION,LAYERS_ORDER)


if __name__ == '__main__':
    pass