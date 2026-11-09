"""Blind case/gimbals/box audit of the 6MX: my pixel picks (read by eye off the photographs named, +-8 px unless said)
turned into millimetres and angles.  No model value is read or used.  Run: python case_readings.py
Scale assumption (stated, not measured on a ruler): bowl wall diameter 110 mm +-6 (bezel knurled band 121 mm), from the
movement ring's gilt flange 105.95 sitting in the bowl bore, the flange being 0.875 of the bezel's outer diameter on
chasy-ru-9985-kirova-14100/9C22A7DC (flange ~805 px, bezel ~920 px), wall/bezel 0.91 on 11_Kirow_DEC_422_Gehause (890/978 px).
Box scale assumption: the front face of the closed box is 190 mm wide (TU 1984); the photo only supports 'about square'."""
import math
BEZ, WALL = 121.0, 110.0
def mm(px, basis_px, basis_mm): return px * basis_mm / basis_px

print('--- DEC 422 Gehause (bowl, foot up), scale = wall 890 px = %.0f mm' % WALL)
s = WALL / 890
cx = 512; R = 445                     # wall centre x and radius in px
def ang(x): return math.degrees(math.asin((x - cx) / R))
rd = dict(foot_D=630, strap_h=113, upright_w=100, upright_len=205, hole_D=44, head_D_L=82, head_D_R=78, lock_head_D=55, lockplate_w=95, lockplate_h=135, lug_w=67, lug_h=60)
for k, v in rd.items(): print('  %-12s %4d px = %5.1f mm' % (k, v, v * s))
print('  foot/wall = %.2f' % (630 / 890))
print('  strap ends %+.1f deg .. %+.1f deg about the axis (arc %.0f mm, chord %.0f mm)' % (ang(272), ang(752), math.radians(ang(752) - ang(272)) * WALL / 2, (752 - 272) * s))
print('  upright centre %+.1f deg, locking-plate centre %+.1f deg -> separation %.1f deg' % (ang(522), ang(165), ang(522) - ang(165)))
print('  hole centre below the knurl band top (y 560): %.1f mm; band height (575-755) %.1f mm' % ((630 - 560) * s, 180 * s))
print('  cone: boss rim (y110) to wall (y215), dr 130 px, dh 105 px -> half angle %.0f deg from the axis, height %.1f mm' % (math.degrees(math.atan2(130, 105)), 105 * s))
print('  boss rim height (y45-110) %.1f mm; step ring 470-560 %.1f mm' % (65 * s, 90 * s))

print('--- Kirov 247 E-Kontakt_3 (case bracket + locking bracket), scale: bowl wall 1000 px = %.0f mm' % WALL)
s = WALL / 1000; cx = 512; R = 507
for k, v in dict(hole_D=40, upright_w=105, arm_len=275, arm_h=100, head_D=90, slot_h=45, lock_head_D=62, lockplate_w=125, lockplate_h=200, hook_above_rim=70).items(): print('  %-14s %4d px = %5.1f mm' % (k, v, v * s))
a1 = math.degrees(math.asin((192 - cx) / R)); a2 = math.degrees(math.asin((665 - cx) / R))
print('  hole centre %+.1f deg, locking-plate centre %+.1f deg -> separation %.1f deg' % (a1, a2, a2 - a1))
print('  arm right end %+.1f deg (%.1f deg beyond the hole); foot visible to %+.1f deg' % (math.degrees(math.asin((530 - cx) / R)), math.degrees(math.asin((530 - cx) / R)) - a1, math.degrees(math.asin((40 - cx) / R))))
print('--- Kirov 2973 E-Kontakt4, scale: bowl 985 px = %.0f mm' % WALL)
s = WALL / 985; cx = 512; R = 492
for k, v in dict(hole_D=38, upright_w=110, head_D=88, lock_head_D=62, hook_above_rim=35).items(): print('  %-14s %4d px = %5.1f mm' % (k, v, v * s))
a1 = math.degrees(math.asin((160 - cx) / R)); a2 = math.degrees(math.asin((637 - cx) / R)); print('  hole %+.1f, lock %+.1f -> %.1f deg' % (a1, a2, a2 - a1))

print('--- Kirova 14100 bowl bottom (37E5A7C1, seen from the foot, ~25 deg tilt)')
bx, by = 690, 690   # boss centre
boss = 570; hole = (865, 697); hD = 55; screw = (688, 668); sD = 62
print('  boss face D %d px; foot hole offset %.0f px = %.2f of boss D, %.2f of boss radius; hole D %.2f of boss D; screw head D %.2f of boss D' % (boss, math.hypot(hole[0]-bx, hole[1]-by), math.hypot(hole[0]-bx, hole[1]-by)/boss, math.hypot(hole[0]-bx, hole[1]-by)/(boss/2), hD/boss, sD/boss))
print('  boss / wall (820 px at the shoulder) = %.2f' % (590/820))
bossD = 0.70 * WALL; print('  -> boss face D ~ %.0f mm, hole centre %.0f mm from the axis, hole D ~ %.1f mm, screw head ~ %.1f mm' % (bossD*0.97, 0.30*bossD*0.97*1, hD/boss*bossD*0.97, sD/boss*bossD*0.97))

print('--- 14100 gimbal ring (9C22A7DC face-on; 37E5A7C1 / 56956DF5 oblique)')
print('  ring outer ~985 px against bezel 920 px (=121 mm): ring OD ~ %.0f mm; ring/wall 1.17' % (985/920*BEZ))
print('--- 22823 box front face (10_Kirow_22823_Kasten), scale: front width 775 px = 190 mm')
s = 190 / 775
for k, v in dict(front_h=800, plaque_w=190, plaque_h=110, catch_w=215, catch_h=115, knob_D=50, corner_leg=100, joint1_from_top=100, joint2_from_top=345).items(): print('  %-16s %4d px = %5.1f mm' % (k, v, v * s))
print('  front W:H = %.2f' % (775/800))
