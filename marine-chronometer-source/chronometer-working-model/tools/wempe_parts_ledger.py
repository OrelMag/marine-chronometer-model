"""wempe_parts_ledger.py: the sheets of the Wempe's works drawings (References/wempe/drawings/) against the parts audit (WEMPE-PARTS-LEDGER.md, started
3 November 2026): which batch reads each sheet, which parts it is compared with (recipe keys, measured by wempe_measure.py; page lines, measured by
wempe_pagemeasure.py), and the coverage check.

    python wempe_parts_ledger.py --check          exit 1 if a sheet image has no row, a row names a missing image, or a batch report is missing a sheet
    python wempe_parts_ledger.py --batch N        the batch's inputs, for its agents' brief (sheets, parts, measurement files)

Kinds: part (a detail sheet), asm (an assembly, kompl.), layout (a plan of the whole), audited against the model as last revised; copy (another print of a sheet read with it), superseded (an earlier
revision of a sheet audited here), other (another calibre's or a later revision the model doesn't follow), notbuilt (the lever chronometer, the hand
setting, the balance holding device, the seconds contact: not in the model): listed, not audited (the owner's choice, 3 November 2026: the model as last
revised only)."""
import argparse,pathlib,re,sys
HERE=pathlib.Path(__file__).resolve().parent;ROOT=HERE.parents[2];DW=ROOT/'References'/'wempe'/'drawings';REP=ROOT/'marine-chronometer-source'/'wempe'/'parts-audit'
# (image, sheet, title, kind, batch, recipe keys, page lines)
S=[
('001-002/Wempe_001','001','Federchronometer (plan of both plates with their parts)','layout',3,['pillarScrew','pillarScrewD','topPlate','pillarPlate'],[]),
('001-002/Wempe_002','002','Ankerchronometer (the lever chronometer\'s plan)','notbuilt',0,[],[]),
('05-08/Wempe_05-08_01a','05 08_1.a','Oberplatte 05 09 01 (15.6.43), sheet a','part',1,['topPlate','wireStud','blockScrew'],[]),
('05-08/Wempe_05-08_01b','05 08_1.b','Oberplatte 05 09 01 (15.6.43), sheet b','part',1,['topPlate','lowerCockScrew','settingEU','settingCEU','escScrewU'],['050406-1.eu','050408-1.eu']),
('05-08/Wempe_05-08_03a','05 08_3.a','Unterplatte 05 08 02-1, sheet a','part',1,['pillarPlate','bushHs'],[]),
('05-08/Wempe_05-08_03b','05 08_3.b','Unterplatte 05 08 02-1, sheet b','part',1,['pillarPlate','settingEL','settingCEL','escScrewL'],['050406-1.el','050408-1.el']),
('05-08/Wempe_05-08_04','05 08_4','Unruhkloben unten 05 08 00-2 (rev. 2.12.46)','part',2,['lowerCock','settingBL','settingCL','settingScrewL'],['050407-1.bl','050408-1.bl']),
('05-08/Wempe_05-08_05','05 08_5','Unruhkloben oben 05 08 03-1','part',2,['upperCock','upperCockScrew','settingBU','settingCU','settingScrewU'],['050407-1.bu','050408-1.bu']),
('05-08/Wempe_05-08_07','05 08_7','Werkring 05 08 00-3 (rev. 6.12.46)','part',2,['ring','ringScrew','dialPin'],[]),
('05-08/Wempe_05-08_08','05 08_8','Schneckenfutter 05 08 01-2','part',2,['fuseeBush'],[]),
('05-08/Wempe_05-08_09','05 08_9','Staubfutter 05 08 01-3','part',2,['dustBush'],[]),
('05-08/Wempe_05-08_11','05 08_11','Pfeiler 05 08 00-1','part',2,['pillars'],[]),
('05-08/Wempe_05-08_13','05 08_13','Federhausbrücke 05 08 05-1','part',2,['barrelBridge','bridgeScrew'],[]),
('05-08/Wempe_05-08_14','05 08_14','Sperrkegel 05 08 05-2','part',2,['click'],[]),
('05-08/Wempe_05-08_02','05 08_2','Oberplatte kompl. 05 08 01 (rev. 8.11.46)','asm',3,['topPlate','fuseeBush','fuseeBushScrew','dustBush','corkRing','bush301','bush300t38','bush300t35'],['050801-5']),
('05-08/Wempe_05-08_06','05 08_6','Unruhkloben oben kompl. (U 30)','asm',3,['upperCock','settingBU','settingCU','settingScrewU'],[]),
('05-08/Wempe_05-08_10','05 08_10','Zwischenbrücke kompl. 05 08 04','asm',3,['intermediateBridge','bush300zb','setting35','intermediateBridgeScrew'],['050504-1']),
('05-08/Wempe_05-08_12','05 08_12','Federhausbrücke kompl. 05 08 05','asm',3,['barrelBridge','click','clickScrew','bridgeScrew'],[]),
('05-08/Wempe_05-08_32-1','05 08_32.1','Unterplatte kompl. (U 36, 23.10.41)','asm',3,['pillarPlate','studBush','bush302','bushHs','studLong','studShort','intermediateBridge'],[]),
('05-08/Wempe_05-08_32-2','05 08_32.2','Unterplatte kompl. 05 08 02 (23.10.41)','asm',3,['pillarPlate','studBush','bush302','bushHs','studLong','studShort','intermediateBridge','intermediateBridgeScrew'],[]),
('05-08/Wempe_05-08_33','05 08_33','Unruhkloben unten kompl. (U 31)','asm',3,['lowerCock','settingBL','settingCL','settingScrewL'],[]),
('05-08/Wempe_05-08_30','05 08_30','Oberplatte (22.9.41)','superseded',0,[],[]),
('05-08/Wempe_05-08_31','05 08_31','Oberplatte kompl. (U 35, 25.9.41)','superseded',0,[],[]),
('05-05/Wempe_05-05_01','05 05_1','Laufwerk (the going train)','layout',4,['centreArbor','intermediateArbor','secondsArbor','escapeArbor','centreWheel','intermediateWheel','secondsWheel','escapeWheel'],[]),
('05-05/Wempe_05-05_02','05 05_2','Sekundenrad kompl. 05 05 01','asm',4,['secondsWheel','secondsArbor'],[]),
('05-05/Wempe_05-05_03','05 05_3','Sekundenrad 05 05 01-1','part',4,['secondsWheel'],[]),
('05-05/Wempe_05-05_04','05 05_4','Sekundentrieb 05 05 01-2 (rev. 6.6.46)','part',4,['secondsArbor'],[]),
('05-05/Wempe_05-05_05','05 05_5','Zwischenrad kompl. 05 05 02','asm',4,['intermediateWheel','intermediateArbor'],[]),
('05-05/Wempe_05-05_06','05 05_6','Zwischenrad 05 05 02-1','part',4,['intermediateWheel'],[]),
('05-05/Wempe_05-05_07','05 05_7','Zwischentrieb 05 05 02-2 (rev. 6.6.46)','part',4,['intermediateArbor'],[]),
('05-05/Wempe_05-05_08','05 05_8','Minutenrad kompl. 05 05 03 (22.7.43)','asm',5,['centreWheel','centreArbor','cannon'],[]),
('05-05/Wempe_05-05_09','05 05_9','Minutenrad 05 05 03-1 (25.8.46)','part',5,['centreWheel'],[]),
('05-05/Wempe_05-05_10','05 05_10','Minutentrieb 05 05 03-2 (rev. 7.6.46)','part',5,['centreArbor'],[]),
('05-05/Wempe_05-05_11','05 05_11','Gegensperrkegel kompl. 05 05 05','asm',5,['maintDetent','dtArbor','wireStud'],['050506-1']),
('05-05/Wempe_05-05_12','05 05_12','Gegensperrkegel 05 05 05-1 (19.7.44)','part',5,['maintDetent'],[]),
('05-04/Wempe_05-04_07-2','05 04_7.2','Gangrad 05 04 08 bis 10 / 05 04 05-1 (19.7.43)','asm',5,['escapeWheel','escapeArbor','escapeCollet'],[]),
('05-04/Wempe_05-04_08','05 04_8','Gangtrieb Hz 05 04 05-2 (7.6.40)','part',5,['escapeArbor'],[]),
('05-04/Wempe_05-04_23','05 04_23','Gangrad Zahnform 02 04 08 (20.1.42)','part',5,['escapeWheel'],[]),
('05-04/Wempe_05-04_07-1','05 04_7.1','Gangrad 05 04 08 bis 10 (4.4.41)','superseded',0,[],[]),
('05-04/Wempe_05-04_01','05 04_1','Hemmung für Feder-Chronometer, Kaliber 020 (3.2.40)','layout',6,['detent','goldSpring','goldScrew','footScrew','detentBlock','impulseRoller','dischargeRoller','escapeWheel','staff','cone41'],['050401-3','050404-2']),
('05-04/Wempe_05-04_02','05 04_2','Goldfeder 05 04 01-2 (16.9.42)','part',6,['goldSpring'],[]),
('05-04/Wempe_05-04_03','05 04_3','Gangfederkloben 05 04 01-4 (8.7.43)','part',6,['detentBlock','blockScrew','footScrew'],['WN-201.gk']),
('05-04/Wempe_05-04_06','51 04_6','Heberolle 02 04 02 (11.2.41)','part',6,['impulseRoller'],['050403-2']),
('05-04/Wempe_05-04_10-1_Wempe_Griessbach','05 04_10.1','Gangfeder, Rud. Grießbach 1436 (17.2.43), sheet 1','part',6,['detent'],['WN-205.d']),
('05-04/Wempe_05-04_10-2_Wempe_Griessbach','05 04_10.2','Gangfeder, Rud. Grießbach 1436 (17.2.43), sheet 2','part',6,['detent'],[]),
('05-04/Wempe_05-04_20','05 04_20','Hemmung für Anker-Chronometer','notbuilt',0,[],[]),
('05-04/Wempe_05-04_21','05 04_21 / 05 04_22','Anker kompl. and Ankerrad (the lever chronometer)','notbuilt',0,[],[]),
('05-04/Wempe_05-04_04','05 04_4','Unruhwelle kompl. 05 04 02','asm',7,['staff','hub','armScrew'],[]),
('05-04/Wempe_05-04_05','05 04_5','Unruhwelle 05 04 01-1 (4.4.41)','part',7,['staff','hub'],[]),
('05-03/Wempe_05-03_3-2','05 03_3.2','Unruhwelle 05 04 01 (12.3.65)','part',7,['staff'],[]),
('05-03/Wempe_05-03_1','05 03_1','Unruh kompl. (U 09, 20.5.41)','asm',7,['rim','masses','timingScrew','timingWeight','massScrew','hub','staff','armScrew'],['WN-12a']),
('05-03/Wempe_05-03_2','05 03_2','Unruh (kompl.) 05 03 01 (23.6.41)','asm',7,['rim','masses','timingScrew','timingWeight','massScrew'],['WN-12a']),
('05-03/Wempe_05-03_4','05 03_4','Unruhreifen 05 03 01-1 (31.7.41)','part',7,['rim','timingScrew'],[]),
('05-03/Wempe_05-03_3-1','05 03_3.1','Unruhwelle 17 04 01 (7.6.43; another calibre\'s number)','other',0,[],[]),
('05-03/Wempe_05-03_5','51 03_5','Spiralfeder kompl. (29.10.41)','asm',8,['hsCollet','hsStud','studScrew'],['050302-1','050302-4.c','050302-4.s']),
('05-03/Wempe_05-03_6','05 03_6','Spiralfeder 05 03 02-1 (26.6.41)','part',8,[],['050302-1']),
('05-03/Wempe_05-03_7','05 03_7','Spiralkurve (6.5.41)','part',8,[],['050302-1']),
('05-03/Wempe_05-03_8','05 03_8','Spiralrolle 05 03 02-2 (24.2.43)','part',8,['hsCollet'],['050302-4.c']),
('05-03/Wempe_05-03_9','05 03_9','Klötzchen 05 03 02-3 (6.6.41)','part',8,['hsStud','studScrew'],['050302-4.s']),
('05-06/Wempe_05-06_01','05 06_1','Schnecke kompl. (U 21, 15.3.41)','asm',9,['fusee','fuseeArbor','fuseeWheel','clickWheel','maintRatchet','mspring','coverPlate','dustPlate','vorreiber','clicks','stopBar','w19','w20','w21'],[]),
('05-06/Wempe_05-06_02-2','05 06_2.2','Schneckenkörper 05 06 04-2 (rev. 27.2.48)','part',9,['fusee','stopBar'],['050600-6','050604-4','050603-2']),
('05-06/Wempe_05-06_03-1','05 06_3.1','Schnecke (U 17, 24.7.41)','asm',9,['fusee','fuseeArbor','clickWheel','w19'],[]),
('05-06/Wempe_05-06_03-2','05 06_3.2','Schnecke 05 06 04 (24.7.41)','asm',9,['fusee','fuseeArbor','clickWheel','w19'],[]),
('05-06/Wempe_05-06_04','51 06_4','Schnecke Teilansicht 05 06 (8.4.41)','asm',9,['fusee','stopBar','clickWheel','maintRatchet','clicks','fuseeWheel','mspring'],['050506-1','050604-4','050603-2','050603-3','050801-5']),
('05-06/Wempe_05-06_15','05 06_15','Schneckenwelle 05 06 04-1 (29.11.40)','part',9,['fuseeArbor'],['050600-5']),
('05-06/Wempe_05-06_16','05 06_16','Schneckensperrrad 05 06 04-3 (rev. 6.8.47)','part',9,['clickWheel'],[]),
('05-06/Wempe_05-06_20','05 06_20','Schneckenkurve / Kraftverlauf (Herb. Müller, 24.7.41)','part',9,['fusee'],['050700-6']),
('05-06/Wempe_05-06_02-1','05 06_2.1','Schneckenkörper 02 06 13-2 (22.7.41)','superseded',0,[],[]),
('05-06/Wempe_05-06_05','05 06_5','Staubplatte 05 06 00-1','part',10,['dustPlate'],[]),
('05-06/Wempe_05-06_06','05 06_6','Vorreiber 05 06 00-2','part',10,['vorreiber'],['050600-5']),
('05-06/Wempe_05-06_07','05 06_7','Schneckenrad 05 06 00-3','part',10,['fuseeWheel'],[]),
('05-06/Wempe_05-06_08','05 06_8','Deckplatte 05 06 00-4','part',10,['coverPlate','w20'],[]),
('05-06/Wempe_05-06_09','05 06_9','Gegenfeder kompl. (U 18)','asm',10,['mspring'],['050600-8']),
('05-06/Wempe_05-06_10','05 06_10','Gegenfeder 05 06 01-1','part',10,['mspring'],[]),
('05-06/Wempe_05-06_11','05 06_11','Gegensperrrad kompl. 05 06 02','asm',11,['maintRatchet','clicks','w21'],['050602-2','050602-4']),
('05-06/Wempe_05-06_12','05 06_12','Gegensperrrad 05 06 02-1','part',11,['maintRatchet'],['050602-4']),
('05-06/Wempe_05-06_13','05 06_13','Sperrfeder 05 06 02-2','part',11,[],['050602-2']),
('05-06/Wempe_05-06_14','05 06_14','Sperrkegel 05 06 02-3','part',11,['clicks'],[]),
('05-07/Wempe_05-07_11','05 07_11','Schneckenband 05 07 03 (1.3.43)','asm',11,['bandHookRound','bandHookDrum'],['050703-1']),
('05-07/Wempe_05-07_12','05 07_12','Schneckenhaken rund 05 07 03-2 (18.3.43)','part',11,['bandHookRound'],[]),
('05-07/Wempe_05-07_13','05 07_13','Bandhaken f. Trommel 05 07 03-3 (9.6.44)','part',11,['bandHookDrum'],[]),
('05-07/Wempe_05-07_14','05 07_14','Kette 05 07 04 (16.7.41)','part',11,[],['050704']),
('05-07/Wempe_05-07_01','05 07_1','Federhaus kompl. (U 24, 13.4.41)','asm',12,['drum','lid','barrelArbor','hook','setupRatchet','hookBlock','steg'],['050700-6']),
('05-07/Wempe_05-07_03','05 07_3','Sperrrad (rev. 14.11.47)','part',12,['setupRatchet'],[]),
('05-07/Wempe_05-07_04','05 07_4','Federhaus mit Deckel 05 07 01 (2.8.44, rev. 20.4.48)','asm',12,['drum','lid','hookBlock'],[]),
('05-07/Wempe_05-07_05','05 07_5','Federhausrohling R 05 07 01-1 (29.8.44, rev. 20.4.48)','part',12,['drum'],[]),
('05-07/Wempe_05-07_06','51 07_6','Federhaustrommel 05 07 01-1 (28.2.41)','part',12,['drum','steg'],[]),
('05-07/Wempe_05-07_07','05 07_7','Federhausdeckel 05 07 01-2 (rev. 20.4.48)','part',12,['lid','steg'],[]),
('05-07/Wempe_05-07_08','05 07_8','Federkern kompl. 05 07 02 (28.1.43)','asm',12,['barrelArbor','hook'],[]),
('05-07/Wempe_05-07_09','05 07_9','Federkern 02 07 04-1 (4.7.41)','part',12,['barrelArbor'],[]),
('05-07/Wempe_05-07_10','05 07_10','Federhausring 02 07 01-3 (7.4.41): the 1941 barrel ring, superseded by the drawn drum 05 07 01-1 (batch 12 found no built part it draws)','part',12,[],[]),
('05-07/Wempe_05-07_02','05 07_2','Federhaus 02 07 01 (U 22, 16.7.41)','superseded',0,[],[]),
('05-02/Wempe_05-02_01','05 02_1','Zeigerwerk, Auf u. Ab. gesamt (28.3.41)','asm',13,['cannon','changeWheel','changePinion','changePipe','hourWheel','hourPipe','udWheel','udHub','udPinion','studLong','studShort','minuteHand','hourHand','udHand','secondsHand','collet','dial'],[]),
('05-02/Wempe_05-02_02','05 02_2','Minutenzeiger 05 02 00-1 (18.9.42)','part',13,['minuteHand'],[]),
('05-02/Wempe_05-02_03','05 02_3','Stundenzeiger 05 02 00-2 (14.6.40)','part',13,['hourHand'],[]),
('05-02/Wempe_05-02_04','05 02_4','Auf- u. Abzeiger 05 02 00-3 (16.1.41)','part',13,['udHand'],[]),
('05-02/Wempe_05-02_05','05 02_5','Sekundenzeiger 05 02 01-1 (14.6.40)','part',13,['secondsHand','collet'],[]),
('05-02/Wempe_05-02_12','05 02_12','Zifferblatt 05 02 00-1 (2.7.40)','part',13,['dial','dialScrew','dialPin'],[]),
('05-02/Wempe_05-02_13','05 02_13','(B-) Chronometerzifferblatt ALS-1453/A (9.6.44)','part',13,['dial'],[]),
('05-02/Wempe_05-02_06','51 02_6','Wechselrad kompl. 05 02 02 (28.2.41)','asm',14,['changeWheel','changePinion','changePipe'],[]),
('05-02/Wempe_05-02_07','05 02_7','Wechselrad 05 02 02-1 (19.8.40)','part',14,['changeWheel'],[]),
('05-02/Wempe_05-02_08','05 02_8','Stundenrad kompl. 05 02 03 (20.7.40)','asm',14,['hourWheel','hourPipe'],[]),
('05-02/Wempe_05-02_09','05 02_9','Stundenrad 05 02 04-1 (19.8.40)','part',14,['hourWheel'],[]),
('05-02/Wempe_05-02_10','05 02_10','Auf u. Abrad kompl. 05 02 04 (27.2.41)','asm',14,['udWheel','udHub'],[]),
('05-02/Wempe_05-02_11','05 02_11','Auf u. Abrad 05 02 04-1 (26.2.41)','part',14,['udWheel'],[]),
('05-01/Wempe_05-01_1','05 01_1','Gehäuse Kardan 05 01 (30.10.40)','asm',15,['bowl','caseBracket','lockBracket','gimbalRing','ringBracket','nutA','nutW','screw79','screwKr','screw78m4','screw78m25','screw71','screw72','screw80_3','screw80_9','lockBr','lockArbor','lockHub','lockLever','lockPin','lockKnob'],['050100-7','Holzkasten']),
('05-01/Wempe_05-01_2','05 01_2','Gehäusetopf R-05 01 00-1 (6.3.42)','part',15,['bowl'],[]),
('05-01/Wempe_05-01_3','05 01_3','Verschlussplatte 05 01 00-2 (6.12.41)','part',15,['closingPlate','screw71','screw71f','screw72','screw72f'],['050100-7']),
('05-01/Wempe_05-01_4','05 01_4','Glasrand kompl. 05 01 01 (29.11.41)','asm',15,['bezel'],['050101-1']),
('05-01/Wempe_05-01_5','05 01_5','Glasrand R-05 01 01-2 (6.3.42)','part',15,['bezel'],[]),
('05-01/Wempe_05-01_6','51 01_6','Aufzugschlüssel (U 01, 51 00 11; 12.12.40)','asm',16,['key40Pipe','key40Body','key40Cap','keyPaddle'],['127556.02-04','127556.02-05']),
('05-01/Wempe_05-01_7','05 01_7','Chronometerschlüssel 51 00 11 / 51 01 02 (16.7.43)','asm',16,['keyPaddle','keyBody','keyTube'],['510011-4','510011-6']),
('05-01/Wempe_05-01_8','05 01_8','Schlüsselmittelteil 05 01 02-2 (16.7.43)','part',16,['keyBody'],['510011-6']),
('05-01/Wempe_05-01_9','05 01_9','Schlüsselrohr 05 01 02-3 (16.7.43)','part',16,['keyTube'],[]),
('51-00/Wempe_51-00_1','51 00_1','Boden-Chronometer (the box; 4.3.42)','asm',16,['screwKh'],['Holzkasten','Holzkasten.D','Scharnier','Schluesselhalter','Schluesselhalter.F','Deckelglas','Ueberkasten']),
('51-00/Wempe_51-00_2','51 00_2','Griff f. Chronometerkasten 51 00 10 (14.7.42)','part',16,['screwHg','screw80_3','screw80_9'],['510010']),
('51-00/Wempe_51-00_3','51 00_3','Firmenschild (22.3.43)','part',16,[],['000101-9']),
('51-00/Wempe_51-00_4','51 00_4','Zunge P.51 00 02-2 (18.9.42)','part',16,['screwZg'],['P510002-2','Schliessblech','WN-zk']),
('51-00/Wempe_51-00_5','51 00_5','Überkasten (28.2.42)','asm',16,['screwUr','screwUr6'],['Ueberkasten','Ueberkasten.D','Randleiste','Polster.S','Polster.E','Polster.B','Polster.D','Riemen','Riemenoese','Scharnier.U','Hakenoese','Haken','WN-ro']),
('05-33/Wempe_05-33','05 33','Zeigerstellung kompl. (hand setting, 5.11.41)','notbuilt',0,[],[]),
('05-36/Wempe_05-36','05 36_1','Unruhhaltevorrichtung (balance holding device, 26.2.42)','notbuilt',0,[],[]),
('05-36/Wempe_05-36_2','05 36_2','Zangenteil 36 00 01-1 (29.8.41)','notbuilt',0,[],[]),
('05-38/Wempe_05-38','05 38','Sekundenkontakt 38 00 (9.12.42)','notbuilt',0,[],[]),
('Wempe_Einheitschronometer','Federchronometer 05','the coloured section of the whole movement (Wempe Observatory; Altmeppen 2017)','layout',17,['topPlate','pillarPlate','pillars','fusee','fuseeArbor','drum','barrelArbor','centreArbor','intermediateArbor','secondsArbor','escapeArbor','staff','upperCock','lowerCock','intermediateBridge','barrelBridge','dial','cannon','hourWheel'],[]),
('Wempe_Einheitschronometer_hires','Federchronometer 05 (copy)','the same section as printed in Klassik Uhren 3/2006, joined at 2.49 times (read labels on it with batch 17)','copy',0,[],[]),
]
def img(s):return DW/(s[0]+'.jpg')

def check():
    bad=[];have={p.relative_to(DW).as_posix()[:-4] for p in DW.rglob('*.jpg')}
    rows={s[0] for s in S}
    for h in sorted(have-rows):bad.append(f'no row: {h}')
    for r in sorted(rows-have):bad.append(f'no image: {r}')
    for s in S:
        if s[3] in ('part','asm','layout') and not s[4]:bad.append(f'audited kind without a batch: {s[0]}')
    for b in sorted({s[4] for s in S if s[4]}):
        for name in (f'batch{b:02d}.md',f'verify{b:02d}.md'):
            f=REP/name
            if not f.exists():continue
            t=f.read_text(encoding='utf-8')
            for s in S:   # (the catalogue's 51 for a sheet that prints 05)
                if s[4]==b and s[1] not in t and s[1].replace('51 ','05 ',1) not in t:bad.append(f'{name} does not mention sheet {s[1]}')
    print(f'{len(S)} rows, {len(have)} images, {sum(1 for s in S if s[4])} audited in {len({s[4] for s in S if s[4]})} batches');[print(' ',x) for x in bad]
    return not bad

def batch(n):
    for s in S:
        if s[4]!=n:continue
        print(f"- sheet {s[1]} ({s[3]}): {s[2]}\n  image: {img(s).as_posix()}")
        if s[5]:print('  parts (exact solids, r_wpa/measure/KEY.json and KEY.png): '+', '.join(s[5]))
        if s[6]:print('  page lines (page meshes, r_wpa/page/HN.json and HN.png): '+', '.join(s[6]))

VERD=[('not applicable','n/a'),('n/a','n/a'),('superseded','n/a'),('not built','not built'),('mismatch','mismatch'),("can't tell",'cant'),('cant tell','cant'),("can’t tell",'cant'),('extra','extra'),('match','match')]
def norm(v):
    v=(v or '').lower()
    for k,n in VERD:
        if k in v:return n
    return '?'
def cells(line):return [c.strip() for c in line.strip().strip('|').split('|')]
def items(b):
    """the batch's items: the reader's rows (batchNN.items.tsv) with the verifier's verdict (verifyNN.md), and the verifier's own new items"""
    f=REP/f'batch{b:02d}.items.tsv'
    if not f.exists():return []
    L=f.read_text(encoding='utf-8').splitlines();H=L[0].split('\t');R=[dict(zip(H,l.split('\t'))) for l in L[1:] if l.strip()]
    v={};vf=REP/f'verify{b:02d}.md'
    if vf.exists():
        for l in vf.read_text(encoding='utf-8').splitlines():
            c=cells(l)
            if len(c)>=5 and re.match(r'\d{2}-',c[0]):v[c[0]]=c
    for r in R:
        r['rv']=norm(r.get('verdict'));c=v.get(r['id'])
        r['vv']=norm(c[4]) if c else None;r['vwhy']=c[6] if c and len(c)>6 else '';r['vread']=c[2] if c else ''
        r['final']=r['vv'] if r['vv'] and r['vv']!='?' else r['rv']
    ids={r['id'] for r in R}
    for k,c in v.items():
        if k not in ids:R.append({'id':k,'sheet':'','item':c[2],'drawn':c[2],'built':c[3],'field':'','delta':'','rv':None,'vv':norm(c[4]),'final':norm(c[4]),'vwhy':c[6] if len(c)>6 else '','vread':c[2],'new':1})
    return R
def esc(x):return (x or '').replace('|','/').replace('\n',' ')
def build():
    out=[];allR=[];byPart={}
    for b in sorted({s[4] for s in S if s[4]}):
        R=items(b)
        for r in R:r['batch']=b
        allR+=R
        rows=[s for s in S if s[4]==b]
        for i,s in enumerate(rows):
            sR=[r for r in R if r['id'].startswith(f'{b:02d}-{i+1}-')]
            K=s[5]+s[6];named=lambda r,k:k in (r.get('field') or '') or k in (r.get('built') or '')
            for k in K:   # an item naming none of the sheet's parts counts for its main part (the first listed)
                pr=[r for r in sR if named(r,k) or (k==K[0] and not any(named(r,q) for q in K))]
                d=byPart.setdefault(k,{'sheets':[],'items':[]});d['sheets'].append(s[1]);d['items']+=[r for r in pr if r not in d['items']]
    C=lambda R,key:{n:sum(1 for r in R if r[key]==n) for n in ('match','mismatch','not built','extra','cant','n/a')}
    out.append("## Results by part\n\nEach part with the sheets it was compared against, the count of its items by final verdict (the verifier's where it gave one, else the reader's), and every item whose final verdict is mismatch, not built or extra. An item is counted for a part when its measured field names the part; items about a sheet as a whole are in the batch tables below.\n")
    out.append("| Part | Sheets | match | mismatch | not built | extra | can't tell | Findings (id: item (drawn / built)) |\n|---|---|---|---|---|---|---|---|")
    for k,d in sorted(byPart.items(),key=lambda kv:kv[0].lower()):
        c=C(d['items'],'final');f=[r for r in d['items'] if r['final'] in ('mismatch','not built','extra')]
        out.append(f"| {k} | {', '.join(dict.fromkeys(d['sheets']))} | {c['match']} | {c['mismatch']} | {c['not built']} | {c['extra']} | {c['cant']} | "+'; '.join(f"{r['id']}: {esc(r['item'])[:90]} ({esc(r.get('drawn'))[:40]} / {esc(r.get('built'))[:40]})" for r in f)+' |')
    out.append('\n## Results by batch and sheet\n')
    for b in sorted({s[4] for s in S if s[4]}):
        R=[r for r in allR if r['batch']==b]
        if not R:out.append(f'### Batch {b}: not yet read\n');continue
        cr=C([r for r in R if r['rv']],'rv');cf=C(R,'final')
        out.append(f"### Batch {b}\n\nReader: {cr['match']} match, {cr['mismatch']} mismatch, {cr['not built']} not built, {cr['extra']} extra, {cr['cant']} can't tell. After the verifier: {cf['match']} match, {cf['mismatch']} mismatch, {cf['not built']} not built, {cf['extra']} extra, {cf['cant']} can't tell, {cf['n/a']} not applicable (reports: `batch{b:02d}.md`, `verify{b:02d}.md`).\n")
        out.append("| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |\n|---|---|---|---|---|---|---|---|")
        rows=[s for s in S if s[4]==b]
        for i,s in enumerate(rows):
            sR=[r for r in R if r['id'].startswith(f'{b:02d}-{i+1}-')];c=C(sR,'final')
            out.append(f"| {s[1]} | {esc(s[2])} | {len(sR)} | {c['match']} | {c['mismatch']} | {c['not built']} | {c['extra']} | {c['cant']} |")
        F=[r for r in R if r['final'] in ('mismatch','not built','extra') or (r['vv'] and r['rv'] and r['vv']!=r['rv'])]
        if F:
            out.append("\n| id | item | drawn (reader) | built | reader | verifier | verifier's reason |\n|---|---|---|---|---|---|---|")
            for r in F:out.append(f"| {r['id']} | {esc(r['item'])[:120]} | {esc(r.get('drawn'))[:60]} | {esc(r.get('built'))[:60]} | {r['rv'] or '(new)'} | {r['vv'] or '-'} | {esc(r['vwhy'])[:160]} |")
        out.append('')
    out.append('## Sheets not audited\n\n| Sheet | Title | Why |\n|---|---|---|')
    why={'superseded':'an earlier revision of a sheet audited here','other':"another calibre's sheet",'notbuilt':'not in the model','copy':'another print of a sheet read with batch 17'}
    for s in S:
        if not s[4]:out.append(f"| {s[1]} | {esc(s[2])} | {why.get(s[3],s[3])} |")
    return '\n'.join(out)+'\n'

if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--check',action='store_true');a.add_argument('--batch',type=int);a.add_argument('--build',action='store_true');o=a.parse_args()
    if o.build:
        L=ROOT/'WEMPE-PARTS-LEDGER.md';t=L.read_text(encoding='utf-8');a0='<!-- generated by wempe_parts_ledger.py --build: do not edit below -->'
        L.write_text(t.split(a0)[0]+a0+'\n\n'+build(),encoding='utf-8',newline='\n');print('written',L);sys.exit(0 if check() else 1)
    if o.batch:batch(o.batch)
    else:sys.exit(0 if check() else 1)
