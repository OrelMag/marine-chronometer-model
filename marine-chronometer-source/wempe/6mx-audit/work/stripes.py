import sys,cv2,numpy as np,json
# Geneva stripes' pitch and direction on a flattened plate (12 px/mm): the 2D spectrum's peak in clear patches, refined parabolically
im=cv2.imread(sys.argv[1],0).astype(float);k=12.0
patches=[(-30,-25),(25,0),(30,-15),(-5,30),(20,20),(-35,-5)]   # patch centres (x, z) mm on bare plate, 12 mm square
for cx,cz in patches:
    u,v=int((cx+46)*k),int((cz+46)*k);n=144;p=im[v-n//2:v+n//2,u-n//2:u+n//2]
    p=(p-p.mean())*np.outer(np.hanning(n),np.hanning(n));N=1024;F=np.abs(np.fft.fftshift(np.fft.fft2(p,(N,N))))
    fy,fx=np.meshgrid(np.fft.fftshift(np.fft.fftfreq(N)),np.fft.fftshift(np.fft.fftfreq(N)),indexing='ij');r=np.hypot(fx,fy)
    F[r<1/(6*k)]=0;F[r>1/(0.6*k)]=0;i=np.unravel_index(np.argmax(F),F.shape);f=r[i];ang=np.degrees(np.arctan2(fy[i],fx[i]))
    print(f'patch ({cx:+d},{cz:+d}): pitch {1/f/k:.3f} mm, stripes run at {(ang+90)%180:.1f} deg (image x right = +x, z down; anticlockwise from +x toward -z)')
