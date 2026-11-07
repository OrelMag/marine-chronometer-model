"""Gamma: the hour hand's pear prepared for mfgfit.py (the measure-trace skill): the dial photograph laid out straight about the centre arbor along the hand's axis
(handstrip.strip, 40 px a mm, x along the hand from the centre, z across it), saved lossless with its map (px_per_mm, x0, z0: mfgfit's --map), and the hand's two
edges seeded from the colour contour (Lab distance from the dial over 25) every 0.3 mm from x 12 to the tip, as a trace of two open curves (upper, lower) that
mfgfit then snaps to the image's edge and fits as lines and arcs. Usage: python pearprep.py 247|2973|render"""
import cv2,numpy as np,json,sys
from hands import cal
from handstrip import strip
W=sys.argv[1]
SRC={'247':('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg',((498,308),(504,712),(105,125),(150,175)),(785,622)),
     '2973':('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg',((483,328),(484,712),(95,120),(140,160)),(752,622)),
     'render':('C:/Users/USER/AppData/Local/Temp/claude/5baf8887e4faf47f/2f6d7732-b608-494f-8cce-993c648648c6/scratchpad/pcg/r_pc_k247_Z_render.png',((498,308),(504,712),(105,125),(150,175)),(788,615))}
p,(ud,sc,rud,rsc),tip=SRC[W]; img=cv2.imread(p); U,S,k=cal(img,ud,sc,rud,rsc,range(180,360,2)); O=(U+S)/2
v=np.array(tip,float)-O; ax=np.degrees(np.arctan2(v[1],v[0])); X0,X1,HALF=-2,38,4
s=strip(img,O,k,ax,X0,X1,half=HALF); cv2.imwrite('pear_%s.png'%W,s)
json.dump({'px_per_mm':40,'x0':X0-0.5/40,'z0':-HALF-0.5/40,'note':'x along the hour hand from the centre arbor, z across it (+ to the image right of the hand looking out); %s, axis %.3f deg image, %.4f px/mm'%(p,ax,k)},open('pear_%s.map.json'%W,'w'),indent=1)
lab=cv2.cvtColor(s,cv2.COLOR_BGR2LAB).astype(np.float32); H=s.shape[0]; c=H//2; up=[];lo=[]
for xmm in np.arange(12,36,0.3):
    j=int(round((xmm-X0)*40)); col=lab[:,j,:]; bg=np.median(np.r_[col[:20],col[-20:]],0); d=np.linalg.norm(col-bg,axis=1)
    m=c-20+int(np.argmax(d[c-20:c+20]))
    if d[m]<25: continue
    a=m; b=m
    while a>0 and d[a-1]>25: a-=1
    while b<H-1 and d[b+1]>25: b+=1
    up.append([j,a]); lo.append([j,b])
tr={'image':'pear_%s.png'%W,'source':p,'planes':{'dial':{'face_y':0,'calibration':{},'traces':{'profile_upper':{'kind':'curve','h':0,'closed':False,'points_px':up},'profile_lower':{'kind':'curve','h':0,'closed':False,'points_px':lo}}}}}
json.dump(tr,open('pear_%s.trace.json'%W,'w'))
print(W,'axis %.2f, %d+%d seed points'%(ax,len(up),len(lo)))
