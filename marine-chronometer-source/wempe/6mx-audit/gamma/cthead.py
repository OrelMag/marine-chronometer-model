"""Gamma: the contact's block screws' heads (6MX.cts) against pillar 39's body (Ø 8.0, the drawn pillars' size: Beta, 7 November 2026). Each silhouette edge is
searched in its own window (set on crops of the photograph, r_cth_*.png: the head's cylindrical side against what lies behind it, the pillar's two outer edges),
row by row over the head's side and the pillar's clear height, the steepest step sub-pixel by a parabola; widths are medians over the rows. (A first pass searched
from each head's centre outward and caught the slot and the reflections inside the head: 54-61 px, where the silhouette is 76-82: withdrawn.) A head nearer the
camera than the pillar is magnified more: each width is scaled by its distance from the camera over the pillar's, the camera's centre from Alpha's photocompare fits
(m6_contact on 10_, m6_contact_front on 14_E-Kontakt1), the screws at train.js's places, the pillar at P39_6MX (6.477, 36.733) and 0.5 nearer and farther from the
centre. Ø = 8.0 x (head px / pillar px) x (d_head / d_pillar)."""
import cv2,numpy as np,json
D='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/'
PC='C:/Users/USER/AppData/Local/Temp/claude/5baf8887e4faf47f/914b5323-cc70-405d-bbda-b50fac1900b3/scratchpad/pc/'
SCR={'57@226.0':(30.86,29.8),'57@214.6':(24.36,35.31),'52@193.3':(10.03,42.12),'52@182.9':(2.17,42.85)}
P39=np.array([6.477,36.733])
def edge(g,y,x0,x1):
    xs=np.arange(x0,x1,0.25); v=cv2.remap(g,np.float32(xs[None]),np.float32(np.full((1,len(xs)),y)),cv2.INTER_LINEAR)[0]; d=np.abs(np.gradient(v)); i=int(np.argmax(d))
    if 0<i<len(d)-1: y0,y1,y2=d[i-1],d[i],d[i+1]; return xs[i]+0.25*(y0-y2)/(2*(y0-2*y1+y2)+1e-9)
    return xs[i]
def width(g,L,R,rows):
    w=np.array([edge(g,y,*R)-edge(g,y,*L) for y in rows]); m=np.median(w); k=np.abs(w-m)<3*1.4826*np.median(np.abs(w-m))+0.5
    return np.median(w[k]),1.2533*w[k].std()/np.sqrt(k.sum()),int(k.sum())
camc=lambda q:-cv2.Rodrigues(np.array(q[:3]))[0].T@np.array(q[3:6])
J={'10_ (Kirov 247)':(D+'10_Kirow_247_E-Kontakt_1.jpg','r_pc_m6_contact.json',((655,680),(848,875),range(200,400,3)),
        {'57@226.0':((74,90),(154,170),range(365,400,2)),'52@193.3':((612,628),(688,704),range(432,472,2)),'52@182.9':((853,870),(936,952),range(428,468,2))}),
   '14_E-Kontakt1 (Kirov 2973)':(D+'14_E-Kontakt1.jpg','r_pc_m6_contact_front.json',((638,658),(811,831),range(110,330,3)),
        {'57@226.0':((72,88),(152,168),range(335,378,2)),'57@214.6':((283,300),(362,378),range(355,395,2)),'52@182.9':((857,873),(936,952),range(317,353,2))})}
res={}
for nm,(p,cf,(PL,PR,prow),heads) in J.items():
    g=cv2.GaussianBlur(cv2.cvtColor(cv2.imread(p),cv2.COLOR_BGR2GRAY).astype(np.float32),(3,3),0.7)
    wp,sp,npn=width(g,PL,PR,prow); C=camc(json.load(open(PC+cf))['q'])[[0,2]]
    print('%s: pillar %.1f px (±%.2f, %d rows)'%(nm,wp,sp,npn))
    for k,(L,R,rows) in heads.items():
        wh,sh,nh=width(g,L,R,rows); o=[]
        for dr in (-0.5,0,0.5):
            pp=P39*(1+dr/np.linalg.norm(P39)); o.append(8.0*wh/wp*np.linalg.norm(C-np.array(SCR[k]))/np.linalg.norm(C-pp))
        res.setdefault(nm,{})[k]=dict(head_px=wh,head_sd=sh,pillar_px=wp,raw=8*wh/wp,dia=o[1],dia_pillar_r_less=o[0],dia_pillar_r_more=o[2])
        print('   %-9s head %.1f px (±%.2f, %d rows): raw Ø %.2f, with depth Ø %.2f; pillar r -0.5/+0.5: %.2f / %.2f'%(k,wh,sh,nh,8*wh/wp,o[1],o[0],o[2]))
json.dump(res,open('cthead.json','w'),indent=1)
