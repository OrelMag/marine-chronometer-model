import sys,cv2,numpy as np
from scipy.special import erf
from scipy.optimize import curve_fit
# a vertical cylinder's width row by row: each row's luma, the left and right edge found as the strongest step near a rough edge (+-w px), refined by an erf fit
im=cv2.imread(sys.argv[1]);ch=sys.argv[6] if len(sys.argv)>6 else 'luma'
g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(float) if ch=='luma' else im[:,:,{'b':0,'g':1,'r':2}[ch]].astype(float)
uL,uR,v0,v1=map(int,sys.argv[2:6]);w=6;out=[]
def edge(row,u):
    x=np.arange(u-w,u+w+1);y=row[x];f=lambda t,a,b,c,s:a+b*erf((t-c)/(s*1.414))
    try:p,_=curve_fit(f,x,y,p0=[y.mean(),(y[-1]-y[0])/2,u,1.0],maxfev=2000);return p[2] if abs(p[2]-u)<w and 0.3<abs(p[3])<4 else None
    except Exception:return None
for v in range(v0,v1+1):
    row=cv2.GaussianBlur(g,(0,0),0.7)[v];a=edge(row,uL);b=edge(row,uR)
    if a and b:out.append((v,a,b,b-a))
A=np.array(out);print(f'{len(A)} rows: width median {np.median(A[:,3]):.2f} px, IQR {np.percentile(A[:,3],25):.2f}-{np.percentile(A[:,3],75):.2f}; centre u {np.median((A[:,1]+A[:,2])/2):.2f}')
for r in A[::max(1,len(A)//12)]:print(f'  v {int(r[0])}: {r[1]:.1f} - {r[2]:.1f} = {r[3]:.2f}')
