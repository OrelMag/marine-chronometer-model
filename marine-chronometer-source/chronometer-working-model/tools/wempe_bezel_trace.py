"""The Wempe's bezel (Glasrand kompl. 05 01 01) and its hanging in the gimbals (05 01), read off the sheets (no browser; Pillow, numpy).

The points below were traced by hand on pixel-gridded crops of the scans (References/wempe/drawings/05-01), each the middle of the drawn line:

05 01 01 (Glasrand kompl., 1:1, no figures; scan 4.78 px/mm, the transcription's scale from the title block, which gives the ring the casting's 16.0 high): the
hatched section at the right end. The scan is turned 0.67 deg (its top line falls 6 px over 530, its bottom line the same); the axis at x 470.5 (the centre line).

05 01 (Gehäuse Kardan, 1:1; scan 2.46 px/mm, scaled locally on its "11,5", axis to the ring's top): the elevation's left end and Schnitt C-D's right end, rows only.

    python wempe_bezel_trace.py            prints the bezel's profile in mm (r from the axis, h over its underside) and the seat's height over the pivots
    python wempe_bezel_trace.py --png OUT  draws the traced points and case.js's profile over the sheet's crop (OUT), for comparing

case.js (the bezel, YSEAT) is built from these numbers."""
import sys,pathlib,math
ROOT=pathlib.Path(__file__).resolve().parents[3]
SHEET=ROOT/'References/wempe/drawings/05-01/Wempe_05-01_4.jpg'
K=4.78; CX=470.5; Y0=269.0; TILT=6/530   # px/mm; the axis; the underside's row at the right end; the scan's turn (rows fall to the right)
# the right end's section (x, y px): outside from the underside up, then inside from the top down
OUT=[(741,269),(748,240),(752,236),(760,233),(760,222),(758,221),(733,193)]
IN=[(733,193),(735,210),(737,210.5),(690,245),(733,245),(733,269)]
GLASS=[(180,192.5),(735,192.5),(735,210),(180,210)]   # the glass's band at the top (05 01 01-1), its edge where the bevel starts
def mm(x,y):return ((x-CX)/K,(Y0-y)/K)
# 05 01: rows (px) on the original scan
ELEV={'ring top':112.5,'axis A':141.5,'flange top':119,'seat (flange underside, bowl top)':130,'glass top':90,'glass underside':100.5}
CD={'ring top':116.5,'axis b':147,'seat':134.4}
def main():
    print('05 01 01, the ring (r, h) mm:')
    for nm,pts in(('outside',OUT),('inside',IN),('glass',GLASS[1:3])):print(f'  {nm}: '+', '.join(f'({r:.2f}, {h:.2f})' for r,h in(mm(*p) for p in pts)))
    print(f"  height {(Y0-192.5)/K:.2f} (the casting R-05 01 01-2: 16)")
    s=11.5/(ELEV['axis A']-ELEV['ring top']);sc=11.5/(CD['axis b']-CD['ring top'])
    print('05 01, over the pivot axis (mm, scaled on the "11,5"):')
    for k,v in ELEV.items():print(f'  elevation {k}: {(ELEV["axis A"]-v)*s:.2f}')
    for k,v in CD.items():print(f'  Schnitt C-D {k}: {(CD["axis b"]-v)*sc:.2f}')
    print('the cast bowl (R-05 01 00-1) turning about the inner pivots inside the ring (r 70), its pivots s under its top:')
    for sv in(4.7,5.0,5.11,5.3):print(f'  s {sv}: foot edge {math.hypot(36.25,65-sv):.2f}, body corner {math.hypot(53,50.5-sv):.2f}')
    if '--png' in sys.argv:
        from PIL import Image,ImageDraw
        im=Image.open(SHEET).convert('RGB');x0,y0,k=660,180,10;c=im.crop((x0,y0,780,280)).resize((1200,1000),Image.NEAREST);d=ImageDraw.Draw(c)
        P=lambda x,y:((x-x0)*k,(y-y0)*k)
        for pts,col in((OUT,(255,0,0)),(IN,(255,0,0)),(GLASS[1:3],(0,160,0))):d.line([P(*p) for p in pts],fill=col,width=3)
        # case.js's profile (r, h) back to px
        RG=55.25;cone=lambda r:5.0+(r-45.9)*7.3/(RG-45.9);bev=lambda r:16-(r-RG)*6.2/(60.6-RG)
        prof=[(46.0,5.0),(46.0,cone(46.0)),(RG,cone(RG)),(RG,16),(60.2,bev(60.2)),(60.6,9.8),(60.6,7.5),(58.9,6.9),(58.05,6.07),(56.6,0),(RG,0),(RG,5.0),(46.0,5.0)]
        d.line([P(CX+r*K,Y0-h*K) for r,h in prof],fill=(0,0,255),width=2)
        c.save(sys.argv[sys.argv.index('--png')+1]);print('red: traced; green: the glass; blue: case.js')
main()
