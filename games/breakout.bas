#include <screen.bas>
10 REM ************ZX CODE CLUB************
14 REM *                                  *
15 REM *    BREAKOUT by J Bolton 2023     *
16 REM *              v0.1                *
17 REM *                                  *
20 REM ************************************
25 GO SUB 7000 
30 INK 1: PAPER 7: BORDER 4: CLS 
35 LET lives=3 
45 REM ******* Initialising variables 
50 PRINT AT 2,12; INK 7; BRIGHT 1; PAPER 2;"BREAKOUT"; BRIGHT 0; PAPER 7; INK 1;AT 6,10;"Taken from..";AT 8,2;"ZX Spectrum Games Code Club";AT 10,8;"Reprogrammed by";AT 12,9;"James Bolton";AT 14,10;"Version 0.1": PAUSE 0 
100 GO SUB 300: REM initialise 
120 GO SUB 500: REM menu 
130 GO SUB 1000: REM main loop for game 
200 GO TO 30 
300 LET ply=2: LET win=0: DIM a(9,2): DIM d(30): LET lvl=1: LET posy=30: LET x=10: LET timer=0: LET score=0: LET time=0: LET mov=11: LET pos=11: LET vx=0: LET vy=0: LET speed=1: LET ball=0: LET bx=0: LET by=0: LET score2=0 
310 LET b$=" "+CHR$(147)+CHR$(145)+" " : LET w$=CHR$(146)+CHR$(146)
400 RETURN 
500 CLS 
510 LET w$=CHR$(146) 
520 fOR n = 0 TO 31 
530 PRINT INK 2;AT 1,n;w$;AT 21,n;w$
540 NEXT n 
545 FOR n = 0 TO 20
546 PRINT INK 2; AT n,0;w$;AT n,31;w$ 
549 NEXT n 
550 RETURN 
1000 REM Main Loop 
1005 PRINT AT 20,x-2;" ";b$;" " 
1010 LET i$=INKEY$(): LET kemp=IN 31 
1020 LET timer=timer+1: 
1030 IF (i$="z" OR kemp=2) AND x>2 THEN LET x=x-1: 
1040 IF (i$="x" OR kemp=1) AND x<29 THEN LET x=x+1 
1045 IF i$="z" OR i$="x" OR kemp>0 THEN PRINT AT 20,x-2;" ";b$;" "
1050 IF (i$=CHR$(32) OR kemp=16) AND ball=0 THEN LET vx=(RND*1.5)-(RND*1.5): LET vy=-1: LET ball=1: LET bx=x: LET by=19
1060 IF timer=5 THEN GO SUB 3000 
1070 IF ball=1 THEN GO SUB 4000 
1080 PRINT AT 0,2;"SCORE:";score,"(Lvl:";lvl;") Lives:";lives:
1090 PAUSE 5
2000 GO TO 1010 
3000 REM draw blocks
3010 FOR n = 1 TO 20 STEP 2 
3020 FOR p = 1 TO 10 STEP 2
3025 LET ir=RND*4+1 
3030 PRINT AT p+2,n+4; INK 0; PAPER ir;"__"
3050 NEXT p 
3060 NEXT n 
3070 LET timer= 6 
3100 RETURN 
4000 REM *** BALL MOVE 
4005 PRINT AT by,bx;" "
4010 LET bx=bx+vx: LET by=by+vy 
4014 LET y$=SCREEN$ (INT (by),INT (bx))
4015 IF y$="_" THEN LET score = score + 1: BEEP .008,vx+bx: LET score2=score2+1: LET vy=-vy*speed 
4016 IF by>=19 AND ABS (bx-x)<2 THEN LET vx=((RND*2)+1)-((RND*2)+1): LET vy=-vy*speed: PRINT AT 20,x-2;" ";b$;" "
4020 PRINT AT by,bx;INK 2;CHR$(144)
4040 IF bx>29 THEN LET vx=-(vx*speed)
4050 IF bx<2 THEN LET vx=-(vx*speed)
4060 IF by>=20 THEN LET ball=0: LET lives=lives-1: BORDER 2: BEEP 1,0: BORDER 4
4070 IF by<3 THEN LET vy=-(vy*speed)
4080 IF lives=0 THEN GO SUB 5000: 
4090 IF score2>=70 THEN GO SUB 6000: REM Next level:
4200 RETURN 
5000 REM **** restart
5010 PRINT AT 10,5; FLASH 1; PAPER 6; INK 2;"G A M E   O v E R"
5030 FOR n =1 TO 200 
5050 NEXT n 
5100 PRINT AT 12,5;"PRESS KEY TO RESTART"
5110 IF INKEY$="" THEN GO TO 5110
5120 GO TO 30 
6000 REM ***** NEXT LEVEL 
6005 LET lvl=lvl+1: CLS : PRINT AT 10,10; FLASH 1;" L E V E L";lvl
6010 BEEP 1,13 
6020 LET timer=2 
6050 FOR n=1 TO 100 
6055 BEEP .001,n/10
6060 NEXT n 
6070 LET score2=0
6080 LET ball=0
6100 GO TO 120
7000 REM **** CREATE UDG GRAPHICS!!
7010 FOR n=1 TO 31
7020 READ graph
7030 POKE USR "a"+n,graph
7050 NEXT n 
7060 RETURN
7190 REM **********BALL
7200 DATA BIN 00111100
7210 DATA BIN 01100110
7220 DATA BIN 01011110
7230 DATA BIN 01011110
7240 DATA BIN 01111110
7250 DATA BIN 00111100
7260 DATA BIN 00000000
7270 DATA BIN 00000000
7280 REM **********BAT left side  using full numbers
7300 DATA 252,42,41,2,252,248,0,224
7370 REM **********wall
7400 DATA 231,195,165,24,24,165,195,231
7470 REM **********BAT right side 
7500 DATA 63,84,148,68,63,31,8,7
