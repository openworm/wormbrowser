/*******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2011, 2013 OpenWorm.
 * http://openworm.org
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the MIT License
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *     	OpenWorm - http://openworm.org/people.html
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *******************************************************************************/

MODELS['Virtual_Worm_February_2012.obj'] = {
  materials: {
    'vulval_muscle': {
      Ka: [0, 0, 0],
      Kd: [122, 163, 81],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'sphnc_&_anal_dep_musc': {
      Ka: [0, 0, 0],
      Kd: [81, 122, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'uterine_muscle': {
      Ka: [0, 0, 0],
      Kd: [122, 163, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'uterus': {
      Ka: [0, 0, 0],
      Kd: [122, 163, 163],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'seam_cell': {
      Ka: [0, 0, 0],
      Kd: [163, 81, 40],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'intestine': {
      Ka: [0, 0, 0],
      Kd: [204, 163, 204],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'interneuron': {
      Ka: [0, 0, 0],
      Kd: [204, 40, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'socketcell': {
      Ka: [0, 0, 0],
      Kd: [204, 122, 122],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'temp_drg_color': {
      Ka: [0, 0, 0],
      Kd: [197, 41, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'dtc_&_somatic_gonad': {
      Ka: [0, 0, 0],
      Kd: [122, 81, 204],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'hypodermis': {
      Ka: [0, 0, 0],
      Kd: [175, 156, 137],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'polymodalneuron': {
      Ka: [0, 0, 0],
      Kd: [196, 1, 1],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'motor_neuron': {
      Ka: [0, 0, 0],
      Kd: [122, 81, 190],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'neurunkfunc': {
      Ka: [0, 0, 0],
      Kd: [122, 0, 40],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'stomatoint_muscle': {
      Ka: [0, 0, 0],
      Kd: [0, 81, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'sensoryneuron': {
      Ka: [0, 0, 0],
      Kd: [204, 81, 190],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'vpi_&_vir': {
      Ka: [0, 0, 0],
      Kd: [122, 81, 40],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'coelomocyte': {
      Ka: [0, 0, 0],
      Kd: [204, 163, 0],
      Ks: [127, 127, 127],
      Ns: 96.078430,
      d: 12
    },
    'even': {
      Ka: [0, 0, 0],
      Kd: [163, 204, 122],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'glr_cells': {
      Ka: [0, 0, 0],
      Kd: [190, 122, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'marginal_cells': {
      Ka: [0, 0, 0],
      Kd: [190, 40, 190],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'excretory_duct_cell': {
      Ka: [0, 0, 0],
      Kd: [163, 122, 81],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'body_wall_muscle': {
      Ka: [0, 0, 0],
      Kd: [40, 81, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'sheathother': {
      Ka: [0, 0, 0],
      Kd: [40, 122, 122],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'excretory_gland_cells': {
      Ka: [0, 0, 0],
      Kd: [122, 122, 163],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'vulva_epithelium': {
      Ka: [0, 0, 0],
      Kd: [122, 122, 204],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'germline': {
      Ka: [0, 0, 0],
      Kd: [0, 40, 81],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'pharyngeal_epithelium': {
      Ka: [0, 0, 0],
      Kd: [122, 81, 81],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'head_mesodermal_cell': {
      Ka: [0, 0, 0],
      Kd: [204, 81, 40],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'rectal_epithelium': {
      Ka: [0, 0, 0],
      Kd: [122, 81, 81],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'odd': {
      Ka: [0, 0, 0],
      Kd: [40, 163, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'phary_&_rect_glands': {
      Ka: [0, 0, 0],
      Kd: [163, 163, 204],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'excretory_cell': {
      Ka: [0, 0, 0],
      Kd: [163, 40, 81],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'excretory_pore_cell': {
      Ka: [0, 0, 0],
      Kd: [188, 197, 114],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'arcade_cells': {
      Ka: [0, 0, 0],
      Kd: [163, 163, 0],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'spermatheca': {
      Ka: [0, 0, 0],
      Kd: [40, 122, 204],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    },
    'spermath_uterin_valve': {
      Ka: [0, 0, 0],
      Kd: [81, 81, 122],
      Ks: [0, 0, 0],
      Ns: 96.078430,
      d: 12
    }
  },
  decodeParams: {
    decodeOffsets: [-619,-1417,-8191,0,0,-511,-511,-511],
    decodeScales: [0.000498,0.000498,0.000498,0.000978,0.000978,0.001957,0.001957,0.001957]
  },
  urls: {
    'df4944b1.Virtual_Worm_February_2012.utf8': [
      { material: 'arcade_cells',
        attribRange: [0, 14853],
        indexRange: [118824, 29504],
        bboxes: 207336,
        names: ['arcade_cell_ant', 'arcade_cell_post'],
        lengths: [47040, 41472]
      }
    ],
    'fd0da1ba.Virtual_Worm_February_2012.utf8': [
      { material: 'body_wall_muscle',
        attribRange: [0, 55294],
        indexRange: [442352, 110457],
        bboxes: 3208384,
        names: ['mu_bod_vl22', 'mu_bod_vl20', 'mu_bod_vl18', 'mu_bod_vl16', 'mu_bod_vl14', 'mu_bod_vl12', 'mu_bod_vl10', 'mu_bod_vl8', 'mu_bod_vl6', 'mu_bod_vl4', 'mu_bod_vl2', 'mu_bod_vl21', 'mu_bod_vl19', 'mu_bod_vl17', 'mu_bod_vl15', 'mu_bod_vl13', 'mu_bod_vl11', 'mu_bod_vl9', 'mu_bod_vl7', 'mu_bod_vl5', 'mu_bod_vl3'],
        lengths: [34656, 34944, 28800, 18576, 26736, 27120, 22464, 11616, 7824, 5376, 11232, 10848, 7968, 13728, 14880, 11040, 12576, 12432, 8400, 8400, 1755]
      },
      { material: 'body_wall_muscle',
        attribRange: [773723, 55294],
        indexRange: [1216075, 110297],
        bboxes: 3208510,
        names: ['mu_bod_vl3', 'mu_bod_vl1', 'mu_bod_vr22', 'mu_bod_vr20', 'mu_bod_vr18', 'mu_bod_vr16', 'mu_bod_vr14', 'mu_bod_vr12', 'mu_bod_vr10', 'mu_bod_vr8', 'mu_bod_vr6', 'mu_bod_vr4', 'mu_bod_vr2', 'mu_bod_vr21', 'mu_bod_vr19', 'mu_bod_vr17', 'mu_bod_vr15', 'mu_bod_vr13', 'mu_bod_vr11', 'mu_bod_vr9'],
        lengths: [5445, 9792, 33216, 36480, 28848, 18672, 26736, 27984, 21312, 11616, 6192, 6000, 12384, 12528, 8016, 12480, 14880, 12624, 10944, 14742]
      },
      { material: 'body_wall_muscle',
        attribRange: [1546966, 55294],
        indexRange: [1989318, 110298],
        bboxes: 3208630,
        names: ['mu_bod_vr9', 'mu_bod_vr7', 'mu_bod_vr5', 'mu_bod_vr3', 'mu_bod_vr1', 'mu_bod_dr23', 'mu_bod_dr22', 'mu_bod_dr20', 'mu_bod_dr18', 'mu_bod_dr16', 'mu_bod_dr14', 'mu_bod_dr12', 'mu_bod_dr10', 'mu_bod_dr8', 'mu_bod_dr6', 'mu_bod_dr4', 'mu_bod_dr2', 'mu_bod_dr3', 'mu_bod_dr5', 'mu_bod_dr7', 'mu_bod_dr9', 'mu_bod_dr11', 'mu_bod_dr21', 'mu_bod_dr19', 'mu_bod_dr17', 'mu_bod_dr15', 'mu_bod_dr13', 'mu_bod_dl22'],
        lengths: [11514, 8400, 9696, 5904, 9792, 20784, 17760, 24240, 15984, 14448, 14448, 16224, 12624, 12864, 5856, 6720, 8352, 6096, 9840, 8592, 10992, 10896, 10944, 7248, 11184, 13488, 8544, 17460]
      },
      { material: 'body_wall_muscle',
        attribRange: [2320212, 55294],
        indexRange: [2762564, 110341],
        bboxes: 3208798,
        names: ['mu_bod_dl22', 'mu_bod_dl20', 'mu_bod_dl18', 'mu_bod_dl16', 'mu_bod_dl14', 'mu_bod_dl12', 'mu_bod_dl10', 'mu_bod_dl8', 'mu_bod_dl6', 'mu_bod_dl4', 'mu_bod_dl2', 'mu_bod_dl23', 'mu_bod_dl21', 'mu_bod_dl19', 'mu_bod_dl17', 'mu_bod_dl15', 'mu_bod_dl3', 'mu_bod_dl5', 'mu_bod_dl7', 'mu_bod_dl9', 'mu_bod_dl11', 'mu_bod_dl13', 'mu_bod_vr23', 'mu_bod_vl23', 'mu_bod_dr1', 'mu_bod_dr24', 'mu_bod_dl1', 'mu_bod_dl24'],
        lengths: [300, 19584, 16080, 14448, 14448, 15936, 12576, 11760, 7728, 6720, 8376, 20688, 11016, 7272, 12192, 12120, 6144, 9816, 8496, 10968, 11016, 8544, 23040, 23040, 9744, 18480, 9840, 651]
      },
      { material: 'body_wall_muscle',
        attribRange: [3093587, 8209],
        indexRange: [3159259, 16375],
        bboxes: 3208966,
        names: ['mu_bod_dl24', 'mu_bod_vr24'],
        lengths: [19413, 29712]
      }
    ],
    '5ec61bf2.Virtual_Worm_February_2012.utf8': [
      { material: 'coelomocyte',
        attribRange: [0, 5772],
        indexRange: [46176, 11520],
        bboxes: 80736,
        names: ['ccdr', 'ccdl', 'ccpl', 'ccal', 'ccar', 'ccpr'],
        lengths: [5760, 5760, 5760, 5760, 5760, 5760]
      }
    ],
    'ef56b91b.Virtual_Worm_February_2012.utf8': [
      { material: 'dtc_&_somatic_gonad',
        attribRange: [0, 32250],
        indexRange: [258000, 63680],
        bboxes: 449040,
        names: ['gonadal_sheath_a5d', 'gonadal_sheath_a4d', 'gonadal_sheath_p5d', 'gonadal_sheath_p4d', 'gonadal_sheath_p3l', 'gonadal_sheath_p2l', 'gonadal_sheath_p1l', 'gonadal_sheath_a3l', 'gonadal_sheath_a2l', 'gonadal_sheath_a1l', 'gonadal_sheath_p4v', 'gonadal_sheath_p3r', 'gonadal_sheath_p2r', 'gonadal_sheath_p1r', 'distal_tip_cell_p', 'gonadal_sheath_a4v', 'gonadal_sheath_a3r', 'gonadal_sheath_a2r', 'gonadal_sheath_a1r', 'distal_tip_cell_a', 'gonadal_sheath_p5v', 'gonadal_sheath_a5v'],
        lengths: [9120, 6048, 8400, 6048, 6624, 8736, 19488, 5280, 6624, 18768, 4512, 6624, 8736, 19488, 3264, 4512, 5280, 6624, 18768, 3840, 7440, 6816]
      }
    ],
    '55bbb055.Virtual_Worm_February_2012.utf8': [
      { material: 'even',
        attribRange: [0, 18337],
        indexRange: [146696, 36656],
        bboxes: 256664,
        names: ['pm2vr', 'pm2vl', 'pm2d', 'pm8', 'pm6vl', 'pm6d', 'pm6vr', 'pm4vl', 'pm4d', 'pm4vr'],
        lengths: [14400, 13824, 13632, 2688, 16608, 3384, 15072, 10128, 10056, 10176]
      }
    ],
    '68eacfe3.Virtual_Worm_February_2012.utf8': [
      { material: 'excretory_cell',
        attribRange: [0, 4642],
        indexRange: [37136, 9280],
        bboxes: 64976,
        names: ['excretory_cell_excretory_cell'],
        lengths: [27840]
      }
    ],
    'b7440319.Virtual_Worm_February_2012.utf8': [
      { material: 'excretory_duct_cell',
        attribRange: [0, 546],
        indexRange: [4368, 1088],
        bboxes: 7632,
        names: ['excretory_duct_cell_excretory_duct_cell'],
        lengths: [3264]
      }
    ],
    '88879a20.Virtual_Worm_February_2012.utf8': [
      { material: 'excretory_gland_cells',
        attribRange: [0, 1664],
        indexRange: [13312, 3328],
        bboxes: 23296,
        names: ['excretory_gland_cell'],
        lengths: [9984]
      }
    ],
    'e48d7856.Virtual_Worm_February_2012.utf8': [
      { material: 'excretory_pore_cell',
        attribRange: [0, 482],
        indexRange: [3856, 960],
        bboxes: 6736,
        names: ['excretory_pore_cell'],
        lengths: [2880]
      }
    ],
    '267cfce8.Virtual_Worm_February_2012.utf8': [
      { material: 'germline',
        attribRange: [0, 13460],
        indexRange: [107680, 19520],
        bboxes: 166240,
        names: ['rachis_p', 'rachis_a', 'oocyte_post_8', 'oocyte_post_7', 'oocyte_post_6', 'oocyte_post_5', 'oocyte_post_4', 'oocyte_post_3', 'oocyte_post_2', 'oocyte_post_1', 'oocyte_ant_10', 'oocyte_ant_9', 'oocyte_ant_8', 'oocyte_ant_7', 'oocyte_ant_6', 'oocyte_ant_5', 'oocyte_ant_4', 'oocyte_ant_3', 'oocyte_ant_2', 'oocyte_ant_1'],
        lengths: [10560, 9408, 2688, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112, 2112]
      }
    ],
    'f8a47c2f.Virtual_Worm_February_2012.utf8': [
      { material: 'glr_cells',
        attribRange: [0, 7500],
        indexRange: [60000, 14976],
        bboxes: 104928,
        names: ['glrvr', 'glrdr', 'glrr', 'glrl', 'glrdl', 'glrvl'],
        lengths: [6720, 7488, 8256, 8256, 7488, 6720]
      }
    ],
    '03c8448a.Virtual_Worm_February_2012.utf8': [
      { material: 'head_mesodermal_cell',
        attribRange: [0, 2432],
        indexRange: [19456, 4864],
        bboxes: 34048,
        names: ['head_mesodermal_cell'],
        lengths: [14592]
      }
    ],
    'cf2096e6.Virtual_Worm_February_2012.utf8': [
      { material: 'hypodermis',
        attribRange: [0, 55294],
        indexRange: [442352, 109276],
        bboxes: 1670280,
        names: ['hyp10', 'hyp9', 'hyp8', 'hyp11', 'hyp7'],
        lengths: [6720, 6288, 5424, 8304, 301092]
      },
      { material: 'hypodermis',
        attribRange: [770180, 55294],
        indexRange: [1212532, 108432],
        bboxes: 1670310,
        names: ['hyp7', 'hyp5', 'hyp4', 'hyp2', 'hyp1', 'hyp3', 'cuticle'],
        lengths: [43308, 32256, 42240, 68352, 61440, 36864, 40836]
      },
      { material: 'hypodermis',
        attribRange: [1537828, 9625],
        indexRange: [1614828, 18484],
        bboxes: 1670352,
        names: ['cuticle'],
        lengths: [55452]
      }
    ],
    '9ef380e0.Virtual_Worm_February_2012.utf8': [
      { material: 'interneuron',
        attribRange: [0, 55294],
        indexRange: [442352, 110383],
        bboxes: 3215376,
        names: ['siavr', 'sdqr', 'sdql', 'bdur', 'pvnr', 'pvwr', 'pvcr', 'luar', 'pvpl', 'ripr', 'urbr', 'aibr', 'adar', 'mi', 'i6', 'i5', 'i4', 'i3', 'i2r', 'i1r', 'pvnl', 'pvcl'],
        lengths: [19392, 7872, 13632, 8256, 31680, 6336, 23232, 5472, 19776, 13248, 5184, 12480, 7872, 7488, 9792, 36480, 16320, 5568, 12096, 10560, 37440, 20973]
      },
      { material: 'interneuron',
        attribRange: [773501, 55294],
        indexRange: [1215853, 110422],
        bboxes: 3215508,
        names: ['pvcl', 'pvql', 'pvt', 'pvpr', 'pvwl', 'lual', 'pvqr', 'bdul', 'i1l', 'i2l', 'rivr', 'avjr', 'ricr', 'sibvr', 'siadr', 'aiar', 'saadl', 'ribr', 'avkr', 'avkl', 'avfl', 'avfr'],
        lengths: [1491, 24384, 22848, 19008, 6336, 5472, 24000, 8256, 10560, 12096, 9792, 22080, 9888, 25632, 19872, 5568, 14496, 12480, 24864, 24864, 25152, 2127]
      },
      { material: 'interneuron',
        attribRange: [1547119, 55295],
        indexRange: [1989479, 107288],
        bboxes: 3215640,
        names: ['avfr', 'avar', 'avbr', 'avdl', 'avbl', 'aval', 'avdr', 'saadr', 'rir', 'sibdr', 'aver', 'riar', 'saavr', 'ainr', 'avhr', 'urxr', 'ris', 'ripl', 'urbl', 'adal', 'rid'],
        lengths: [23409, 22176, 25728, 22176, 25728, 22176, 22176, 14496, 10176, 20256, 13248, 10176, 14400, 6816, 22080, 8256, 8736, 13248, 5184, 7872, 3351]
      },
      { material: 'interneuron',
        attribRange: [2311343, 55294],
        indexRange: [2753695, 100535],
        bboxes: 3215766,
        names: ['rid', 'urxl', 'rivl', 'avhl', 'avjl', 'ainl', 'saavl', 'rial', 'avel', 'sibdl', 'ribl', 'aizl', 'ricl', 'aiyr', 'aimr', 'aibl', 'rigl', 'sabd', 'avg', 'rifl', 'rigr', 'rifr', 'sabvr', 'sabvl', 'aiml', 'aiyl', 'siadl'],
        lengths: [24105, 8256, 9792, 22080, 22464, 6816, 14400, 10176, 13248, 20256, 12480, 8640, 9888, 5568, 5952, 12480, 5568, 15936, 19776, 5952, 5568, 5952, 5184, 5184, 5952, 5568, 14364]
      },
      { material: 'interneuron',
        attribRange: [3055300, 11485],
        indexRange: [3147180, 22732],
        bboxes: 3215928,
        names: ['siadl', 'aial', 'siavl', 'sibvl', 'rih'],
        lengths: [5508, 5568, 19392, 25632, 12096]
      }
    ],
    '89e6fddc.Virtual_Worm_February_2012.utf8': [
      { material: 'intestine',
        attribRange: [0, 22808],
        indexRange: [182464, 45536],
        bboxes: 319072,
        names: ['int1dl', 'int9l', 'int8l', 'int7l', 'int6l', 'int5l', 'int4v', 'int3v', 'int2d', 'int1vr', 'int1vl', 'int4d', 'int6r', 'int5r', 'int9r', 'int8r', 'int2v', 'int1dr', 'int7r', 'int3d'],
        lengths: [6528, 9024, 5568, 5568, 7872, 6720, 7872, 6192, 6720, 6576, 6528, 7872, 7872, 6720, 9024, 5568, 5568, 6528, 5568, 6720]
      }
    ],
    '82f5d638.Virtual_Worm_February_2012.utf8': [
      { material: 'marginal_cells',
        attribRange: [0, 30820],
        indexRange: [246560, 61604],
        bboxes: 431372,
        names: ['mc3dr', 'mc2v', 'mc2dr', 'mc1v', 'mc1dr', 'mc3v', 'mc3dl', 'mc2dl', 'mc1dl'],
        lengths: [20976, 19104, 19008, 27072, 27936, 18528, 5244, 19008, 27936]
      }
    ],
    '1266f863.Virtual_Worm_February_2012.utf8': [
      { material: 'motor_neuron',
        attribRange: [0, 55294],
        indexRange: [442352, 110400],
        bboxes: 3231456,
        names: ['va11', 'hsnr', 'dd6', 'dd4', 'dd3', 'dd5', 'dd2', 'db7', 'db6', 'da9', 'da7', 'da6', 'da5', 'as11', 'as10', 'as9', 'as8', 'as7', 'as6', 'as5', 'as4', 'as3', 'as2', 'vd13', 'vd12', 'vd11', 'vd10', 'vd9'],
        lengths: [4416, 17856, 15168, 19008, 15168, 14016, 12096, 12480, 14016, 12096, 17472, 22080, 17664, 9408, 8928, 9408, 10848, 10176, 9024, 9792, 9408, 8256, 8640, 10560, 10944, 10944, 10944, 384]
      },
      { material: 'motor_neuron',
        attribRange: [773552, 55294],
        indexRange: [1215904, 110411],
        bboxes: 3231624,
        names: ['vd9', 'vd8', 'vd7', 'vd6', 'vd5', 'vd4', 'vd3', 'db5', 'db4', 'da8', 'da4', 'da3', 'da2', 'vc5', 'uravr', 'm5', 'm3r', 'm2r', 'm1', 'dvb', 'va12', 'pda', 'pdb', 'vb11', 'va10', 'vb10', 'va9', 'vc6', 'vb9', 'va8', 'vb8'],
        lengths: [10176, 13632, 12480, 10944, 10944, 10944, 9792, 20160, 23232, 12096, 14400, 11712, 11328, 11328, 7872, 18624, 11328, 6336, 9408, 8640, 3264, 10560, 13248, 6336, 5952, 7488, 9408, 5184, 7104, 10176, 7137]
      },
      { material: 'motor_neuron',
        attribRange: [1547137, 55294],
        indexRange: [1989489, 110396],
        bboxes: 3231810,
        names: ['vb8', 'va7', 'vb7', 'va6', 'vc3', 'vb6', 'va5', 'vc2', 'vb5', 'va4', 'vc1', 'vb4', 'va3', 'db3', 'vb3', 'va2', 'hsnl', 'vc4', 'm4', 'm2l', 'm3l', 'smbvr', 'rmfr', 'rmgr', 'uradr', 'rmer', 'rmhr', 'smbdr', 'smddr'],
        lengths: [2655, 10560, 9792, 10176, 23304, 10944, 6720, 10560, 11328, 7104, 11328, 11328, 6720, 19776, 10560, 5568, 17856, 11328, 20160, 6336, 11328, 22080, 10560, 7488, 8640, 7008, 10560, 17856, 11565]
      },
      { material: 'motor_neuron',
        attribRange: [2320677, 55294],
        indexRange: [2763029, 110271],
        bboxes: 3231984,
        names: ['smddr', 'rmddr', 'rmdr', 'rmdvr', 'smdvr', 'rimr', 'rmed', 'rmel', 'rmev', 'smdvl', 'rmdvl', 'rmdl', 'riml', 'vd2', 'da1', 'vd1', 'as1', 'db1', 'dd1', 'va1', 'db2', 'vb1', 'vb2', 'rmfl', 'smbdl', 'smddl', 'rmhl'],
        lengths: [6675, 5952, 6720, 6720, 19776, 14016, 11904, 7008, 25152, 19776, 6720, 6720, 14016, 9408, 10176, 12480, 8256, 24384, 11328, 7488, 20928, 12864, 11712, 10560, 17856, 18240, 3978]
      },
      { material: 'motor_neuron',
        attribRange: [3093842, 9875],
        indexRange: [3172842, 19538],
        bboxes: 3232146,
        names: ['rmhl', 'rmddl', 'rmgl', 'uravl', 'uradl', 'smbvl'],
        lengths: [6582, 5952, 7488, 7872, 8640, 22080]
      }
    ],
    'd53efa90.Virtual_Worm_February_2012.utf8': [
      { material: 'neurunkfunc',
        attribRange: [0, 33050],
        indexRange: [264400, 66048],
        bboxes: 462544,
        names: ['alnr', 'plnr', 'canl', 'uryvr', 'auar', 'plnl', 'alnl', 'canr', 'urydr', 'ala', 'aual', 'urydl', 'uryvl'],
        lengths: [17472, 20544, 13632, 7872, 13248, 19776, 17472, 13632, 11712, 29952, 13248, 11712, 7872]
      }
    ],
    '3fc12c12.Virtual_Worm_February_2012.utf8': [
      { material: 'odd',
        attribRange: [0, 28764],
        indexRange: [230112, 57504],
        bboxes: 402624,
        names: ['pm1', 'pm7vl', 'pm7d', 'pm5vl', 'pm5d', 'pm5vr', 'pm3vl', 'pm3d', 'pm3vr', 'pm7vr'],
        lengths: [30144, 13872, 15552, 15024, 16128, 13104, 19728, 15696, 18960, 14304]
      }
    ],
    'fd752c87.Virtual_Worm_February_2012.utf8': [
      { material: 'phary_&_rect_glands',
        attribRange: [0, 12112],
        indexRange: [96896, 24192],
        bboxes: 169472,
        names: ['phar_gland_g1_r_phar_gland_vd_g1_.000', 'rect_vr', 'rect_d', 'rect_vl', 'phar_gland_g2_vr_phar_gland_vg2r', 'phar_gland_dorsal_g2_phar_gland_vd', 'phar_gland_g1_l_phar_gland_vg1l', 'phar_gland_g2_vl_phar_gland_vg2l'],
        lengths: [6720, 2880, 5184, 2880, 5952, 12480, 30528, 5952]
      }
    ],
    '4940a7a2.Virtual_Worm_February_2012.utf8': [
      { material: 'pharyngeal_epithelium',
        attribRange: [0, 15434],
        indexRange: [123472, 30800],
        bboxes: 215872,
        names: ['anus', 'e1vr', 'e3vr', 'e2dr', 'e2dl', 'e3d', 'e1d', 'e2v', 'e3vl', 'e1vl'],
        lengths: [1920, 7872, 8208, 13104, 12336, 9120, 10176, 13584, 8208, 7872]
      }
    ],
    'dd73fee7.Virtual_Worm_February_2012.utf8': [
      { material: 'polymodalneuron',
        attribRange: [0, 24178],
        indexRange: [193424, 48296],
        bboxes: 338312,
        names: ['olqvr', 'il1vr', 'il1r', 'nsmr', 'mcr', 'mcl', 'olqdr', 'nsml', 'il1dr', 'avl', 'il1dl', 'il1vl', 'il1l', 'olqdl', 'olqvl'],
        lengths: [7872, 8256, 10944, 9408, 11712, 11712, 9408, 9408, 2268, 25152, 2268, 8256, 10944, 9408, 7872]
      }
    ],
    'fd4525b1.Virtual_Worm_February_2012.utf8': [
      { material: 'rectal_epithelium',
        attribRange: [0, 4428],
        indexRange: [35424, 8832],
        bboxes: 61920,
        names: ['y', 'b', 'u', 'f', 'k', 'kprime'],
        lengths: [4416, 4416, 4416, 4416, 4416, 4416]
      }
    ],
    'def30c6c.Virtual_Worm_February_2012.utf8': [
      { material: 'seam_cell',
        attribRange: [0, 11076],
        indexRange: [88608, 22144],
        bboxes: 155040,
        names: ['seam_cells_left', 'seam_cells_right'],
        lengths: [33216, 33216]
      }
    ],
    'b8859a42.Virtual_Worm_February_2012.utf8': [
      { material: 'sensoryneuron',
        attribRange: [0, 55294],
        indexRange: [442352, 109643],
        bboxes: 4930384,
        names: ['pvm', 'pvdr'],
        lengths: [14016, 314913]
      },
      { material: 'sensoryneuron',
        attribRange: [771281, 55294],
        indexRange: [1213633, 109391],
        bboxes: 4930396,
        names: ['pvdr'],
        lengths: [328173]
      },
      { material: 'sensoryneuron',
        attribRange: [1541806, 55294],
        indexRange: [1984158, 109433],
        bboxes: 4930402,
        names: ['pvdr', 'pder', 'avm', 'almr', 'pvr', 'plmr', 'phcr', 'phbr', 'phar', 'pvdl'],
        lengths: [22914, 20160, 15936, 12096, 28992, 17088, 9408, 7488, 7488, 186729]
      },
      { material: 'sensoryneuron',
        attribRange: [2312457, 55294],
        indexRange: [2754809, 109194],
        bboxes: 4930462,
        names: ['pvdl'],
        lengths: [327582]
      },
      { material: 'sensoryneuron',
        attribRange: [3082391, 55294],
        indexRange: [3524743, 109764],
        bboxes: 4930468,
        names: ['pvdl', 'il2vr', 'flpr', 'bagr', 'il2r', 'awcr', 'awbr', 'awar', 'askr', 'asir', 'aser', 'ashr', 'adlr', 'adfr', 'ader'],
        lengths: [152073, 7872, 18240, 11712, 8256, 14784, 13632, 13632, 13632, 14784, 16704, 13632, 13248, 13248, 3843]
      },
      { material: 'sensoryneuron',
        attribRange: [3854035, 55294],
        indexRange: [4296387, 110199],
        bboxes: 4930558,
        names: ['ader', 'pqr', 'phcl', 'phbl', 'phal', 'plml', 'pdel', 'alml', 'il2vl', 'cepdr', 'asgr', 'ollr', 'il2dr', 'afdr', 'cepvr', 'asjr', 'aqr', 'il2dl', 'bagl', 'cepvl', 'adel', 'flpl', 'adll', 'ashl', 'awbl', 'afdl', 'adfl', 'asel'],
        lengths: [8637, 9024, 9408, 7488, 7488, 17088, 19776, 12096, 7872, 12096, 11712, 14016, 8256, 13248, 10944, 14400, 14016, 8256, 11712, 10944, 12480, 18240, 13248, 13632, 13632, 13248, 13248, 4392]
      },
      { material: 'sensoryneuron',
        attribRange: [4626984, 21722],
        indexRange: [4800760, 43208],
        bboxes: 4930726,
        names: ['asel', 'awcl', 'asjl', 'cepdl', 'asil', 'askl', 'asgl', 'awal', 'olll', 'il2l'],
        lengths: [12312, 14784, 14400, 12096, 14784, 13632, 11712, 13632, 14016, 8256]
      }
    ],
    'f9a38374.Virtual_Worm_February_2012.utf8': [
      { material: 'sheathother',
        attribRange: [0, 21382],
        indexRange: [171056, 42688],
        bboxes: 299120,
        names: ['olqshvr', 'ilshvr', 'ollshr', 'ilshr', 'amshr', 'phshr', 'phshl', 'olqshdr', 'cepshvr', 'cepshdr', 'ilshdr', 'adeshr', 'adeshl', 'ilshvl', 'ilshdl', 'olqshdl', 'ilshl', 'olqshvl', 'ollshl', 'cepshdl', 'cepshvl'],
        lengths: [5568, 3648, 5184, 5568, 8640, 2880, 2880, 5184, 9792, 9792, 4032, 9600, 6528, 3648, 4032, 5184, 5568, 5568, 5184, 9792, 9792]
      }
    ],
    'b8d90ec1.Virtual_Worm_February_2012.utf8': [
      { material: 'socketcell',
        attribRange: [0, 17968],
        indexRange: [143744, 35840],
        bboxes: 251264,
        names: ['olqsovr', 'ilsovr', 'xxxr', 'ollsor', 'ilsor', 'amsor', 'phso1r', 'phso2r', 'phso2l', 'phso1l', 'adesol', 'amsol', 'ilsodr', 'adesor', 'cepsovr', 'cepsodr', 'olqsodr', 'ilsovl', 'olqsovl', 'ilsol', 'ilsodl', 'olqsodl', 'xxxl', 'ollsol', 'cepsodl', 'cepsovl'],
        lengths: [3264, 2880, 3648, 5184, 3648, 3648, 5184, 4416, 4416, 5184, 5760, 3648, 3264, 5760, 4416, 5184, 3264, 2880, 3264, 3648, 3264, 3264, 3648, 5184, 5184, 4416]
      }
    ],
    'da54c9e0.Virtual_Worm_February_2012.utf8': [
      { material: 'spermath_uterin_valve',
        attribRange: [0, 1152],
        indexRange: [9216, 2304],
        bboxes: 16128,
        names: ['sp_ut_valve_post', 'sp_ut_valve_ant'],
        lengths: [3456, 3456]
      }
    ],
    'e6aa14af.Virtual_Worm_February_2012.utf8': [
      { material: 'spermatheca',
        attribRange: [0, 55294],
        indexRange: [442352, 110373],
        bboxes: 816424,
        names: ['sp_bag_p_4r', 'sp_neck_p_1l', 'sp_neck_p_1r', 'sp_neck_p_2l', 'sp_neck_p_3r', 'sp_neck_p_4l', 'sp_neck_p_3l', 'sp_neck_p_2r', 'sp_neck_p_4r', 'sp_bag_p_1v', 'sp_bag_p_2r', 'sp_bag_p_3v', 'sp_bag_p_1d', 'sp_bag_p_1r', 'sp_bag_p_1l', 'sp_bag_p_2d', 'sp_bag_p_2l', 'sp_bag_p_2v', 'sp_bag_p_3d', 'sp_bag_p_3l', 'sp_bag_p_3r', 'sp_bag_p_4d', 'sp_bag_p_4l', 'sp_bag_p_4v', 'sp_bag_a_4v', 'sp_bag_a_4r', 'sp_bag_a_4d', 'sp_bag_a_3l', 'sp_bag_a_3r', 'sp_bag_a_3d', 'sp_bag_a_2v', 'sp_bag_a_2r', 'sp_bag_a_2d', 'sp_bag_a_1r', 'sp_bag_a_1l', 'sp_bag_a_1d', 'sp_bag_a_3v', 'sp_bag_a_2l', 'sp_bag_a_1v', 'sp_neck_a_4l', 'sp_neck_a_2l', 'sp_neck_a_3r', 'sp_neck_a_4r', 'sp_neck_a_3l', 'sp_neck_a_2r'],
        lengths: [3648, 6912, 6912, 7104, 7296, 7296, 7296, 7104, 7296, 18432, 3648, 3648, 18432, 18432, 18432, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 3648, 18432, 18432, 18432, 3648, 3648, 18432, 7296, 7104, 7296, 7296, 7296, 6255]
      },
      { material: 'spermatheca',
        attribRange: [773471, 3079],
        indexRange: [798103, 6107],
        bboxes: 816694,
        names: ['sp_neck_a_2r', 'sp_neck_a_1l', 'sp_neck_a_1r', 'sp_bag_a_4l'],
        lengths: [849, 6912, 6912, 3648]
      }
    ],
    '65fda73e.Virtual_Worm_February_2012.utf8': [
      { material: 'sphnc_&_anal_dep_musc',
        attribRange: [0, 3410],
        indexRange: [27280, 6816],
        bboxes: 47728,
        names: ['sph_mu', 'mu_anal'],
        lengths: [13344, 7104]
      }
    ],
    '53f3b3bd.Virtual_Worm_February_2012.utf8': [
      { material: 'stomatoint_muscle',
        attribRange: [0, 6788],
        indexRange: [54304, 13568],
        bboxes: 95008,
        names: ['mu_int_r', 'mu_int_l'],
        lengths: [20496, 20208]
      }
    ],
    '00c50ff0.Virtual_Worm_February_2012.utf8': [
      { material: 'temp_drg_color',
        attribRange: [0, 8150],
        indexRange: [65200, 16320],
        bboxes: 114160,
        names: ['dvc', 'dva'],
        lengths: [24480, 24480]
      }
    ],
    '527bd07e.Virtual_Worm_February_2012.utf8': [
      { material: 'uterine_muscle',
        attribRange: [0, 10064],
        indexRange: [80512, 20096],
        bboxes: 140800,
        names: ['um1l_post', 'um1l_ant', 'um1r_post', 'um2l_post', 'um2l_ant', 'um2r_ant', 'um1r_ant', 'um2r_post'],
        lengths: [4032, 3648, 3648, 11328, 11328, 11328, 3648, 11328]
      }
    ],
    'bf699c9b.Virtual_Worm_February_2012.utf8': [
      { material: 'uterus',
        attribRange: [0, 20101],
        indexRange: [160808, 40160],
        bboxes: 281288,
        names: ['ut2_ant', 'uv2_post', 'uv1_post', 'uv3_post', 'uv3_ant', 'uv2_ant', 'uv1_ant', 'du', 'ut3_post', 'ut2_post', 'ut1_post', 'ut1_ant', 'ut3_ant', 'utse', 'ut4_post', 'ut4_ant'],
        lengths: [6144, 6336, 6336, 2688, 2688, 6336, 6336, 7488, 4608, 6144, 13248, 12288, 6048, 25728, 4608, 3456]
      }
    ],
    'cd53909a.Virtual_Worm_February_2012.utf8': [
      { material: 'vpi_&_vir',
        attribRange: [0, 11886],
        indexRange: [95088, 23744],
        bboxes: 166320,
        names: ['pharyn-intest-valve', 'virr', 'virl', 'vpi3_v', 'vpi3_d', 'vpi2_dl', 'vpi2_v', 'vpi2_dr', 'vpi1'],
        lengths: [12288, 2496, 2496, 5664, 5664, 5616, 6816, 5616, 24576]
      }
    ],
    '57c495b3.Virtual_Worm_February_2012.utf8': [
      { material: 'vulva_epithelium',
        attribRange: [0, 5120],
        indexRange: [40960, 10240],
        bboxes: 71680,
        names: ['vula', 'vulb1', 'vulb2', 'vulc', 'vuld', 'vule', 'vulf'],
        lengths: [3840, 3840, 3840, 3840, 3840, 7680, 3840]
      }
    ],
    '8e763d75.Virtual_Worm_February_2012.utf8': [
      { material: 'vulval_muscle',
        attribRange: [0, 2512],
        indexRange: [20096, 4992],
        bboxes: 35072,
        names: ['vm1l_ant', 'vm2r_ant', 'vm2l_post', 'vm1r_ant', 'vm1r_post', 'vm1l_post', 'vm2r_post', 'vm2l_ant'],
        lengths: [1728, 1728, 1728, 2112, 2112, 2112, 1728, 1728]
      }
    ]
  }
};
