"""Gamma (box fork): 13_ rectified (box13's quad, a = 0.52: x 0-1 the front's width, y from the lower parting), the six corner
strips on the front (dark brass on the wood: the red channel's steps along rows and columns through each strip, sub-pixel, medians
over 9 lines): each strip's length in from the edge, its top and bottom, all as fractions of the front's width W."""
import cv2,numpy as np,json
J=json.load(open('box13.json')); Q=np.array(J['Q'])
im=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/13_Kirow_247_Kasten_1.jpg')
S=800; a=0.52; Hm=cv2.getPerspectiveTransform(np.float32(Q),np.float32(np.array([[0,0],[1,0],[1,a],[0,a]])*S+[100,400]))
r=cv2.warpPerspective(im,Hm,(1000,900),flags=cv2.INTER_CUBIC).astype(np.float32); Rc=cv2.GaussianBlur(r[:,:,2],(5,5),1.5)
def st(v,t,sign):
    d=np.gradient(v)*sign; i=int(np.argmax(d)); 
    if i<1 or i>len(d)-2: return np.nan
    a_,b_,c_=d[i-1],d[i],d[i+1]; o=(a_-c_)/(2*(a_-2*b_+c_)+1e-9); return t[i]+o*(t[1]-t[0])
def along_row(y,x0,x1,sign): t=np.arange(x0,x1,0.25); return st(cv2.remap(Rc,np.float32(t[None]),np.float32(np.full_like(t,y)[None]),cv2.INTER_LINEAR)[0],t,sign)
def along_col(x,y0,y1,sign): t=np.arange(y0,y1,0.25); return st(cv2.remap(Rc,np.float32(np.full_like(t,x)[None]),np.float32(t[None]),cv2.INTER_LINEAR)[0],t,sign)
strips={'band left':(100,212,220,265,'L'),'band right':(785,900,218,265,'R'),'body left':(100,212,505,550,'L'),'body right':(790,900,503,550,'R'),'bottom left':(100,212,770,815,'L'),'bottom right':(790,900,770,815,'R')}
out={}
for nm,(x0,x1,y0,y1,side) in strips.items():
    ym=(y0+y1)/2; xm=(x0+x1)/2
    ys=np.linspace(y0+12,y1-12,9); xs=np.linspace(x0+20,x1-20,9)
    if side=='L': inner=np.nanmedian([along_row(y,x1-25,x1+25,1) for y in ys]); length=(inner-100)/S
    else: inner=np.nanmedian([along_row(y,x0-25,x0+25,-1) for y in ys]); length=(900-inner)/S
    top=np.nanmedian([along_col(x,y0-20,y0+20,-1) for x in xs]); bot=np.nanmedian([along_col(x,y1-20,y1+20,1) for x in xs]) if nm[:6]!='bottom' else np.nan
    out[nm]=dict(len=length,top=(top-400)/S,bot=(bot-400)/S if bot==bot else None)
    print('%-12s length %.4f W, top %+.4f W, bottom %s W (from the lower parting, + down)'%(nm,length,(top-400)/S,('%+.4f'%((bot-400)/S)) if bot==bot else 'on the box bottom'))
json.dump(out,open('box13c.json','w'),indent=1)
