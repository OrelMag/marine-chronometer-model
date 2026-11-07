"""Gamma: each dial screw's radial profile about its fitted centre (the median over 72 rays, the slot's rays dropped by their
darkness), in mm at its dial's arbors' scale: where the dark ring starts (light head to dark, steepest fall), its darkest
radius, and where it ends (dark to the white dial, steepest rise). A silver head in a dark crevice shows both edges; a dark head
on white shows only the outer one."""
import cv2,numpy as np
D='E:/Marine-Chronometer/References/wempe/photos/'
J=[('247 by 12',D+'dg-chrono-6mx/1_Kirow_247_Z.jpg',(449.08,74.49),8.7961),('247 by 4',D+'dg-chrono-6mx/1_Kirow_247_Z.jpg',(905.09,682.45),8.7961),
   ('247 by 7',D+'dg-chrono-6mx/1_Kirow_247_Z.jpg',(149.01,771.24),8.7961),
   ('2973 by 12',D+'dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg',None,8.3101),('2973 by 4',D+'dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg',None,8.3101)]
import z2973  # recompute 2973's centres quietly is overkill; use its printed centres below
