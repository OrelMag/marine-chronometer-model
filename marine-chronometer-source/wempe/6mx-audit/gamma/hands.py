"""Gamma: a dial photograph's hands measured on their own axes. Scale and centres from the dial's printed circles about the arbors (zcal's method: the up-and-down
circle's and the seconds track's centres, 46 apart). Each hand's mask (gilt: hue 10-35, saturation over 90; blued: hue 95-130, saturation over 60) is taken in a
sector about its arbor; its axis is the mask's angular mean beyond the boss; the image is rotated about the arbor so the hand lies along +x and supersampled x4,
and each column's mask run through the axis gives the width against the distance from the centre. Tip and tail are the farthest mask on the axis either way.
A hand stands 1-6 mm over the dial: on a camera about 300-600 mm off that reads it 0.2-2 % large (not corrected)."""
import cv2,numpy as np,sys,json
from zcal import fitc
def cal(img,ud,sec,r_ud,r_sec,angs_sec):
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY).astype(np.float32)
    def lp(c,r0,r1,angs):
        pts=[]
        for a in np.radians(angs):
            rr=np.arange(r0,r1,0.25); x=c[0]+rr*np.cos(a); y=c[1]+rr*np.sin(a); v=cv2.remap(g,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]
            i=int(np.argmin(v))
            if 2<i<len(v)-3 and v[i]<np.median(v)-40:
                y0,y1,y2=v[i-1],v[i],v[i+1]; r=rr[i]+0.25*(y0-y2)/(2*(y0-2*y1+y2)+1e-9); pts.append((c[0]+r*np.cos(a),c[1]+r*np.sin(a)))
        return fitc(np.array(pts))[0]
    U=lp(ud,*r_ud,range(0,360,2))[:2]; S=lp(sec,*r_sec,angs_sec)[:2]; return U,S,np.linalg.norm(S-U)/46
def masks(img):
    hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
    gold=((hsv[:,:,0]>=10)&(hsv[:,:,0]<=35)&(hsv[:,:,1]>90)&(hsv[:,:,2]>80)).astype(np.float32)
    blue=((hsv[:,:,0]>=95)&(hsv[:,:,0]<=130)&(hsv[:,:,1]>60)).astype(np.float32)
    return gold,blue
def hand(mask,C,k,ang_guess,win=25,rmin_mm=5,rmax_mm=55,label=''):
    H,W=mask.shape; ys,xs=np.mgrid[0:H,0:W]; dx=xs-C[0]; dy=ys-C[1]; r=np.hypot(dx,dy)/k; a=np.degrees(np.arctan2(dy,dx))
    d=(a-ang_guess+180)%360-180; sel=(mask>0)&(np.abs(d)<win)&(r>rmin_mm)&(r<rmax_mm)
    w=r[sel]; axis=ang_guess+np.average(d[sel],weights=w)
    M=cv2.getRotationMatrix2D((float(C[0]),float(C[1])),axis,1.0)   # rotate so the hand lies along +x
    S=4; big=cv2.resize(mask,None,fx=S,fy=S,interpolation=cv2.INTER_LINEAR); M2=M.copy(); M2[:,2]*=S
    rot=cv2.warpAffine(big,M2,(W*S,H*S),flags=cv2.INTER_LINEAR)>0.5
    cx,cy=int(round(C[0]*S)),int(round(C[1]*S)); band=rot[cy-int(4*k*S):cy+int(4*k*S)+1]   # within 4 mm of the axis
    prof=[]
    for col in range(band.shape[1]):
        c=band[:,col]
        if not c.any(): prof.append(0);continue
        mid=band.shape[0]//2
        # the run of mask through or nearest the axis
        idx=np.where(c)[0]; j=idx[np.argmin(np.abs(idx-mid))]
        lo=j; hi=j
        while lo>0 and c[lo-1]: lo-=1
        while hi<len(c)-1 and c[hi+1]: hi+=1
        prof.append(hi-lo+1 if abs(j-mid)<1.5*k*S else 0)
    prof=np.array(prof)/(k*S); xmm=(np.arange(band.shape[1])-cx)/(k*S)
    on=prof>0.15
    # tip: last x>0 with mask continuing from the boss; tail likewise for x<0
    def run(sign):
        xs_=np.where(sign*xmm>=0)[0]; xs_=xs_ if sign>0 else xs_[::-1]; last=None; gap=0
        for i in xs_:
            if on[i]: last=i; gap=0
            else:
                gap+=1
                if gap>int(0.6*k*S) and last is not None and abs(xmm[last])>1: break
        return abs(xmm[last]) if last is not None else 0
    tip=run(1); tail=run(-1)
    return dict(label=label,axis_img_deg=axis,tip=tip,tail=tail,xmm=xmm,prof=prof)
def report(h,stations):
    print('%-20s axis %.2f deg (image), tip %.2f mm, tail %.2f mm'%(h['label'],h['axis_img_deg'],h['tip'],h['tail']))
    xm,pr=h['xmm'],h['prof']
    pos=(xm>3)&(xm<h['tip']-0.3)
    if pos.any():
        i=np.argmax(np.where(pos,pr,0)); print('   widest on the blade %.2f mm at %.1f from the centre'%(pr[i],xm[i]))
    neg=(xm<-2)&(xm>-h['tail']+0.3)
    if neg.any():
        i=np.argmax(np.where(neg,pr,0)); print('   widest on the tail %.2f mm at %.1f'%(pr[i],-xm[i]))
    print('   width at', ', '.join('%g: %.2f'%(s,np.interp(s,xm,pr)) for s in stations))
if __name__=='__main__':
    which=sys.argv[1]
    if which=='247':
        img=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg'); U,S,k=cal(img,(498,308),(504,712),(105,125),(150,175),range(180,360,2))
        G={'minute':190,'hour':22}; B={'seconds':-73,'seconds tail':107,'up-and-down':-108}
    else:
        img=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg'); U,S,k=cal(img,(483,328),(484,712),(95,120),(140,160),range(180,360,2))
        G={'minute':197,'hour':20}; B={'seconds':-23,'seconds tail':157,'up-and-down':180}
    O=(U+S)/2; print(which,'px/mm %.4f, centre %s'%(k,np.round(O,1)))
    gold,blue=masks(img); out={}
    for nm,a in G.items():
        h=hand(gold,O,k,a,label=nm,rmin_mm=4.6); report(h,[5,10,15,20,25,30,35,40,45]); out[nm]=dict(tip=h['tip'],tail=h['tail'],axis=h['axis_img_deg'],prof=[[float(x),float(p)] for x,p in zip(h['xmm'][::8],h['prof'][::8]) if abs(x)<60])
    for nm,a in B.items():
        if nm=='seconds tail': continue
        C=S if nm.startswith('seconds') else U
        h=hand(blue,C,k,a,label=nm,rmin_mm=1.2,rmax_mm=20 if nm.startswith('seconds') else 15); report(h,[2,4,6,8,10,12,14,16])
        out[nm]=dict(tip=h['tip'],tail=h['tail'],axis=h['axis_img_deg'],prof=[[float(x),float(p)] for x,p in zip(h['xmm'][::8],h['prof'][::8]) if abs(x)<25])
    json.dump(out,open('hands_%s.json'%which,'w'))
