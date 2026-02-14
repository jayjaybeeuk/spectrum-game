#include <input.bas>

10 REM ************ZX CODE CLUB************
14 REM *                                  *
15 REM *   NORTHAMPTON ADVENTURE v0.1     *
16 REM *     by James Bolton 2024         *
17 REM *                                  *
20 REM ************************************

REM ---- Title Screen ----
50 BORDER 0 : PAPER 0 : INK 7 : CLS
55 PRINT AT 3,5; INK 6; "NORTHAMPTON ADVENTURE"
60 PRINT AT 5,8; "A Text Adventure"
65 PRINT AT 8,4; "Explore the historic town"
70 PRINT AT 9,7; "of Northampton!"
75 PRINT AT 12,2; "Commands:"
80 PRINT AT 13,2; " GO NORTH, GO SOUTH,"
85 PRINT AT 14,2; " GO EAST,  GO WEST"
87 PRINT AT 15,2; " Or just: N, S, E, W"
88 PRINT AT 16,2; " LOOK - look around"
89 PRINT AT 17,2; " TALK TO MAN - interact"
91 PRINT AT 18,2; " OPEN BAG - check items"
92 PRINT AT 19,2; " QUIT - end game"
90 PRINT AT 20,2; "Press any key to begin..."
95 PAUSE 0

REM ---- Initialise ----
100 DIM room AS UBYTE
101 DIM n, s, e, w AS UBYTE
102 DIM cmd$ AS STRING
103 DIM msg$ AS STRING
104 DIM exits$ AS STRING
105 DIM hasHotdog AS UBYTE
106 DIM answer$ AS STRING
107 LET room = 1
108 LET hasHotdog = 0
109 LET msg$ = ""

REM ---- Main Loop ----
200 CLS
205 GOSUB 1000
210 IF msg$ <> "" THEN
211 PRINT : PRINT INK 2; msg$ : LET msg$ = ""
212 END IF
215 PRINT ""
216 PRINT INK 4; "What now? ";
220 LET cmd$ = INPUT(20)
221 PRINT ""

REM ---- Parse Commands ----
300 IF cmd$ = "go north" OR cmd$ = "GO NORTH" OR cmd$ = "north" OR cmd$ = "NORTH" OR cmd$ = "n" OR cmd$ = "N" THEN GOTO 500: END IF
310 IF cmd$ = "go south" OR cmd$ = "GO SOUTH" OR cmd$ = "south" OR cmd$ = "SOUTH" OR cmd$ = "s" OR cmd$ = "S" THEN GOTO 510: END IF
320 IF cmd$ = "go east" OR cmd$ = "GO EAST" OR cmd$ = "east" OR cmd$ = "EAST" OR cmd$ = "e" OR cmd$ = "E" THEN GOTO 520: END IF
330 IF cmd$ = "go west" OR cmd$ = "GO WEST" OR cmd$ = "west" OR cmd$ = "WEST" OR cmd$ = "w" OR cmd$ = "W" THEN GOTO 530: END IF
340 IF cmd$ = "look" OR cmd$ = "LOOK" OR cmd$ = "l" OR cmd$ = "L" THEN GOTO 200: END IF
350 IF cmd$ = "quit" OR cmd$ = "QUIT" OR cmd$ = "q" OR cmd$ = "Q" THEN GOTO 9000: END IF
360 IF cmd$ = "help" OR cmd$ = "HELP" OR cmd$ = "h" OR cmd$ = "H" THEN GOTO 9100: END IF
365 IF cmd$ = "talk to man" OR cmd$ = "TALK TO MAN" OR cmd$ = "talk" OR cmd$ = "TALK" THEN GOTO 600: END IF
367 IF cmd$ = "open bag" OR cmd$ = "OPEN BAG" OR cmd$ = "look in bag" OR cmd$ = "LOOK IN BAG" OR cmd$ = "bag" OR cmd$ = "BAG" OR cmd$ = "inventory" OR cmd$ = "INVENTORY" OR cmd$ = "i" OR cmd$ = "I" THEN GOTO 700: END IF
370 LET msg$ = "I don't understand that."
380 GOTO 200

REM ---- Movement ----
500 IF n = 0 THEN LET msg$ = "You can't go north." : GOTO 200: END IF
505 LET room = n : GOTO 200
510 IF s = 0 THEN LET msg$ = "You can't go south." : GOTO 200: END IF
515 LET room = s : GOTO 200
520 IF e = 0 THEN LET msg$ = "You can't go east." : GOTO 200: END IF
525 LET room = e : GOTO 200
530 IF w = 0 THEN LET msg$ = "You can't go west." : GOTO 200: END IF
535 LET room = w : GOTO 200

REM ---- Talk to Man ----
600 IF room <> 2 THEN LET msg$ = "There is nobody here to talk to." : GOTO 200: END IF
605 IF hasHotdog = 1 THEN LET msg$ = "The man says: Enjoy your hotdog!" : GOTO 200: END IF
610 CLS
615 PRINT INK 6; "HOTDOG SELLER"
620 PRINT ""
625 PRINT "The man smiles and says:"
630 PRINT ""
635 PRINT INK 3; """Fancy a hotdog, mate?"
640 PRINT INK 3; " Only the best in"
645 PRINT INK 3; " Northampton!"""
650 PRINT ""
655 PRINT "Do you want to buy a hotdog?"
660 PRINT INK 4; "(YES or NO) ";
665 LET answer$ = INPUT(10)
670 IF answer$ = "yes" OR answer$ = "YES" OR answer$ = "y" OR answer$ = "Y" THEN GOTO 680: END IF
675 LET msg$ = "Maybe next time! says the man." : GOTO 200
680 LET hasHotdog = 1
685 LET msg$ = "You buy a hotdog and put it in your bag."
690 GOTO 200

REM ---- Open Bag / Look in Bag ----
700 CLS
705 PRINT INK 6; "YOUR BAG"
710 PRINT ""
715 IF hasHotdog = 0 THEN PRINT "Your bag is empty." : GOTO 740: END IF
720 PRINT "Your bag contains:"
725 PRINT ""
730 IF hasHotdog = 1 THEN PRINT " - A hotdog": END IF
740 PRINT ""
745 PRINT "Press any key..."
750 PAUSE 0
755 GOTO 200

REM ---- Room Descriptions ----
1000 REM Display current room
1005 LET n = 0 : LET s = 0 : LET e = 0 : LET w = 0
1010 IF room = 1 THEN GOTO 1100: END IF
1020 IF room = 2 THEN GOTO 1200: END IF
1030 IF room = 3 THEN GOTO 1300: END IF
1040 IF room = 4 THEN GOTO 1400: END IF
1050 IF room = 5 THEN GOTO 1500: END IF

REM Room 1: All Saints Church (Centre)
1100 LET n = 2 : LET s = 3 : LET e = 4 : LET w = 5
1110 PRINT INK 6; "ALL SAINTS CHURCH"
1115 PRINT ""
1120 PRINT "You stand before the grand"
1125 PRINT "portico of All Saints Church"
1130 PRINT "in the heart of Northampton."
1135 PRINT "The tall pillars rise above"
1140 PRINT "you. The bustling sounds of"
1145 PRINT "the market drift from the"
1150 PRINT "north. A path leads south"
1155 PRINT "towards the river. Streets"
1160 PRINT "stretch east and west."
1165 GOSUB 2000
1170 RETURN

REM Room 2: Market Square (North)
1200 LET s = 1
1210 PRINT INK 6; "MARKET SQUARE"
1215 PRINT ""
1220 PRINT "The old Market Square bustles"
1225 PRINT "with life. Traders call out"
1230 PRINT "their wares from colourful"
1235 PRINT "stalls. The smell of fresh"
1240 PRINT "bread fills the air. A man"
1245 PRINT "stands by a cart selling"
1246 PRINT "hotdogs, the sizzling smell"
1247 PRINT "drifts towards you. A stone"
1248 PRINT "fountain splashes gently in"
1250 PRINT "the centre of the square."
1255 PRINT "All Saints Church lies to"
1260 PRINT "the south."
1265 GOSUB 2000
1270 RETURN

REM Room 3: Becket's Park (South)
1300 LET n = 1
1310 PRINT INK 6; "BECKET'S PARK"
1315 PRINT ""
1320 PRINT "You stroll through Becket's"
1325 PRINT "Park by the River Nene. The"
1330 PRINT "water flows gently under the"
1335 PRINT "old stone bridge. Ducks"
1340 PRINT "paddle in the shallows and"
1345 PRINT "willow trees sway along the"
1350 PRINT "banks. The path back to the"
1355 PRINT "church leads north."
1360 GOSUB 2000
1365 RETURN

REM Room 4: Abington Street (East)
1400 LET w = 1
1410 PRINT INK 6; "ABINGTON STREET"
1415 PRINT ""
1420 PRINT "Abington Street stretches"
1425 PRINT "before you, the main"
1430 PRINT "shopping street of the town."
1435 PRINT "Old shopfronts with ornate"
1440 PRINT "facades line both sides. A"
1445 PRINT "street musician plays a"
1450 PRINT "familiar tune nearby. The"
1455 PRINT "way back to the church is"
1460 PRINT "to the west."
1465 GOSUB 2000
1470 RETURN

REM Room 5: The Drapery (West)
1500 LET e = 1
1510 PRINT INK 6; "THE DRAPERY"
1515 PRINT ""
1520 PRINT "You find yourself on The"
1525 PRINT "Drapery, a historic street"
1530 PRINT "named after the cloth trade"
1535 PRINT "that once made Northampton"
1540 PRINT "famous. The Welsh House, one"
1545 PRINT "of the oldest buildings in"
1550 PRINT "town, stands nearby with its"
1555 PRINT "dark timber frame. The church"
1560 PRINT "lies back to the east."
1565 GOSUB 2000
1570 RETURN

REM ---- Print Exits ----
2000 PRINT ""
2010 LET exits$ = "Exits: "
2020 IF n > 0 THEN LET exits$ = exits$ + "N ": END IF
2030 IF s > 0 THEN LET exits$ = exits$ + "S ": END IF
2040 IF e > 0 THEN LET exits$ = exits$ + "E ": END IF
2050 IF w > 0 THEN LET exits$ = exits$ + "W ": END IF
2060 PRINT INK 5; exits$
2070 RETURN

REM ---- Quit Screen ----
9000 CLS
9010 PRINT AT 10,4; "Thanks for exploring"
9020 PRINT AT 11,7; "Northampton!"
9030 PRINT AT 14,3; "Press any key to restart"
9040 PAUSE 0
9050 GOTO 50

REM ---- Help Screen ----
9100 CLS
9110 PRINT INK 6; "HELP"
9115 PRINT ""
9120 PRINT "Available commands:"
9125 PRINT ""
9130 PRINT " GO NORTH  (or N)"
9135 PRINT " GO SOUTH  (or S)"
9140 PRINT " GO EAST   (or E)"
9145 PRINT " GO WEST   (or W)"
9150 PRINT " LOOK      (or L)"
9152 PRINT " TALK TO MAN"
9154 PRINT " OPEN BAG  (or I)"
9155 PRINT " HELP      (or H)"
9160 PRINT " QUIT      (or Q)"
9170 PRINT ""
9180 PRINT "Press any key..."
9190 PAUSE 0
9200 GOTO 200
