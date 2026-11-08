r"""thread_rows.py: the bowl rim's thread ridges on Kirov 247's side photograph (6MX case review, 8 November 2026).

    python thread_rows.py   # prints the mean grey of each row over x 380-470, rows 60-180, of 12_Kirow_247_E-Kontakt_3.jpg, and writes band_247.png (5x) to E:\mc-video\oq\6mx-case

The band above the case bracket's arm shows five ridges about 7.8 px apart (read on the 5x crop). The rim spans 1010 px for its Ø 110.1, about 9.2 px/mm at
mid-depth and less at the far side, and the band is foreshortened by the view's tilt, so its vertical scale is at most about 8.5 px/mm: the pitch is 0.9-1.2 mm."""
import pathlib
import numpy as np
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[4]
F=ROOT/'References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/12_Kirow_247_E-Kontakt_3.jpg'
x0,x1,y0,y1=380,470,60,180
im=Image.open(F);im.crop((x0,y0,x1,y1)).resize(((x1-x0)*5,(y1-y0)*5),Image.LANCZOS).save(r'E:\mc-video\oq\6mx-case\band_247.png')
print(np.round(np.asarray(im.convert('L'),float)[y0:y1,x0:x1].mean(1)).astype(int).tolist())
