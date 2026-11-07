"""Gamma: the contact's block screws' spacing as ratios, which hardly depend on the camera: along the row of four screws (block 57's two,
then block 52's two), each block's gap between its screws over the gap between the blocks' inner screws. Photo: the screws' axes
measured (k1screws.py's method) on 10_ (Kirov 247) and on 14_E-Kontakt1/2 (no serial; the model's comment calls it Kirov 2973).
Model: the four screws (train.js 6MX.cts at 226.0, 214.6, 193.3, 182.9 on r about 42.9) projected through every camera at hand."""
import cv2,numpy as np,json
from cam import proj as myproj
M=np.array([[30.86,-8.8,29.8],[24.36,-8.8,35.31],[10.03,-8.8,42.12],[2.17,-8.8,42.85]])
def axes(path,cs):
    g=cv2.GaussianBlur(cv2.cvtColor(cv2.imread(path),cv2.COLOR_BGR2GRAY).astype(np.float32),(3,3),0.8); out=[]
    for xc,ym in cs:
        mids=[]
        for y in range(ym-8,ym+9,2):
            xs=np.arange(xc-45,xc+45,0.25); v=cv2.remap(g,np.float32(xs[None]),np.float32(np.full((1,len(xs)),y)),cv2.INTER_LINEAR)[0]; d=np.abs(np.gradient(v))
            iL=np.argmax(d*(xs<xc-8)); iR=np.argmax(d*(xs>xc+8)); mids.append(((xs[iL]+xs[iR])/2,xs[iR]-xs[iL]))
        mids=np.array(mids); out.append((np.median(mids[:,0]),np.median(mids[:,1]),mids[:,0].std()))
    return np.array(out)
def rat(x): g=np.diff(x); return g, g[0]/g[1], g[2]/g[1]
D='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/'
PH={'10_ (Kirov 247)':(D+'10_Kirow_247_E-Kontakt_1.jpg',[(122,378),(292,412),(657,445),(906,440)]),
    '14_E-Kontakt1 (Kirov 2973?)':(D+'14_E-Kontakt1.jpg',[(120,350),(330,368),(697,360),(904,335)]),
    '14_E-Kontakt2 (same, other view)':(D+'14_E-Kontakt2.jpg',[(140,282),(300,312),(624,330),(831,317)])}
res={}
for k,(p,cs) in PH.items():
    a=axes(p,cs); g,r57,r52=rat(a[:,0]); res[k]=dict(axes=a[:,0].tolist(),widths=a[:,1].tolist(),gaps=g.tolist(),r57=r57,r52=r52)
    print('PHOTO %-34s axes %s (sd %s) gaps %s  block57/between %.3f  block52/between %.3f  head width/between %.3f'%(k,np.round(a[:,0],1),np.round(a[:,2],1),np.round(g,1),r57,r52,np.median(a[:,1])/g[1]))
def pcproj(P,q):
    q=np.asarray(q,float); K=np.array([[np.exp(q[6]),0,W/2+q[7]],[0,np.exp(q[6]),H/2+q[8]],[0,0,1]])
    return cv2.projectPoints(np.ascontiguousarray(P),q[:3],q[3:6],K,np.array([q[9]*0.01,0,0,0]))[0].reshape(-1,2)
PC='C:/Users/USER/AppData/Local/Temp/claude/5baf8887e4faf47f/914b5323-cc70-405d-bbda-b50fac1900b3/scratchpad/pc/'
for nm,f in [("Alpha's m6_contact (10_)",'r_pc_m6_contact.json'),("Alpha's m6_contact_front (14_E-K1)",'r_pc_m6_contact_front.json')]:
    d=json.load(open(PC+f)); W,H=d['W'],d['H']; pr=pcproj(M,d['q']); g,r57,r52=rat(pr[:,0])
    print('MODEL via %-36s x %s gaps %s  block57/between %.3f  block52/between %.3f'%(nm,np.round(pr[:,0],1),np.round(g,1),r57,r52))
for nm,f in [('Gamma k1 (14_E-K1, drawn parts)','cam_k1.json'),('Gamma k10 (10_, drawn parts, weak)','cam_k10.json')]:
    c=json.load(open(f)); pr=myproj(M,np.array(c['rv']),np.array(c['t']),c['f'],c['W'],c['H']); g,r57,r52=rat(pr[:,0])
    print('MODEL via %-36s x %s gaps %s  block57/between %.3f  block52/between %.3f'%(nm,np.round(pr[:,0],1),np.round(g,1),r57,r52))
# the model's chords in plan
ch=lambda a,b: np.hypot(*(M[a,[0,2]]-M[b,[0,2]]))
print('MODEL in plan: block 57 screws %.2f apart, between the blocks %.2f, block 52 %.2f; ratios %.3f %.3f'%(ch(0,1),ch(1,2),ch(2,3),ch(0,1)/ch(1,2),ch(2,3)/ch(1,2)))
json.dump(res,open('ctratio.json','w'),indent=1)
