1 BORDER 1:INK 0:PAPER 0:CLS:LET L=6:LET S=0:GO SUB 42:GO SUB 30
2 LET A$=INKEY$:LET H=1:IF R=0 THEN BORDER 4:PAUSE 0:GO TO 1
3 IF A$="z" AND A>23200 THEN LET A=A-1:POKE A,40:POKE A+3,0:GO TO 5
4 IF A$="x" AND A<23229 THEN POKE A+3,40:POKE A,0:LET A=A+1
5 LET D=B-A+31:IF ABS D<3 THEN LET W=-1:LET V=SGN D:BEEP .03,12
6 LET W=(Y=0)+(Y<>0)*W:IF X=0 OR X=31 THEN LET V=-V:GO TO 10
7 LET U=B+W*32:IF PEEK U THEN LET T=U:LET W=-W:GO SUB 40:IF Z THEN LET V=-V
8 IF H*V*PEEK(B+V) THEN LET T=B+2*V:LET V=-V:GO SUB 40:IF Z THEN LET W=-W
9 LET U=U+V:IF H*PEEK U THEN LET T=U:LET W=-W:GO SUB 40:IF Z THEN LET V=-V
10 POKE B,0:LET X=X+V:LET Y=Y+W:LET B=B+V+32*W:POKE B,56
11 IF Y=21 THEN LET L=L-1:BORDER 2:BEEP .5,-23:IF L=0 THEN PAUSE 0:GO TO 1
12 IF Y=21 THEN PAUSE 25:BORDER 1:GO SUB 42:POKE B,0:GO SUB 32
20 GO TO 2: REM *** BreakIn 20-Liner Breakout by Marco Varesio 2019 ***
30 LET A=23214:LET R=0:FOR I=1 TO 7:FOR J=22562+32*I TO 22589+32*I
31 POKE J,I*8:LET R=R+1:NEXT J:NEXT I:LET V=1:LET W=1:GO SUB 42
32 LET B=A-31:LET X=A-23200+1:LET Y=20:POKE B, 56
33 FOR I=0 TO 2:POKE A+I,40:NEXT I:RETURN
40 FOR I=T-1 TO T+1:LET R=R-SGN(PEEK I):POKE I,0:NEXT I:BEEP .02,23
41 LET S=S+1:LET H=0:LET Z=PEEK(B+W*32+V)
42 PRINT #1;AT 1,0; "Score: ";S,"Lives: ";L-1:RETURN
