REM Initialize the Screen and Variables
10 BORDER 0: PAPER 0: INK 7: CLS
20 LET x = 10
30 LET y = 15
40 LET scrollPos = 0
50 DIM bg(31)
60 FOR i = 0 TO 31: READ bg(i): NEXT i
70 DATA 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1
80 DATA 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0

REM 
90 FOR i = 0 TO 31
100   POKE 16384 + i, bg(i)
110 NEXT i
120 POKE 22528 + y*32 + x, 255

REM Main game loop
130 LET running = 1
140 WHILE running = 1
150   REM Erase player
160   POKE 22528 + y*32 + x, 0
170   
180   REM Get input
190   LET k = INKEY$
200   IF k = " " THEN LET running = 0
210   IF k = "8" THEN LET y = y - 1
220   IF k = "2" THEN LET y = y + 1
230   IF y < 0 THEN LET y = 0
240   IF y > 23 THEN LET y = 23
250   
260   REM Draw player
270   POKE 22528 + y*32 + x, 255
280   
290   REM Scroll background
300   FOR i = 0 TO 30
310     LET bg(i) = bg(i+1)
320   NEXT i
330   LET bg(31) = INT(RND*2)
340   FOR i = 0 TO 31
350     POKE 16384 + i, bg(i)
360   NEXT i
370   
380   REM Pause for a short duration
390   PAUSE 10
400 WEND
410 PRINT "GAME OVER"

