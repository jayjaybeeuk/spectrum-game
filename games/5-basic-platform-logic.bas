' Platformer Game Starter
' Boriel ZX Basic - ZX Spectrum

' Set UDG memory location
POKE 23675, 255-6 ' Set UDG to 65368

' UDG Character (Simple 8x8 Stickman)
RESTORE char_data
FOR i = 0 TO 7
    READ b: POKE 65368 + i, b
NEXT i

' Character Data (UDG A)
char_data:
DATA 24, 60, 24, 24, 60, 36, 66, 66

' Constants
CONST SCREEN_WIDTH = 31
CONST GROUND_Y = 16 ' Row where the platform is
CONST GRAVITY = 1
CONST JUMP_STRENGTH = -3

' Variables
DIM x AS UBYTE
DIM y AS UBYTE
DIM dx AS BYTE
DIM dy AS BYTE
x = 15: y = GROUND_Y: dx = 0: dy = 0

' Game loop
DO
    CLS
    
    ' Draw platform
    FOR i = 0 TO SCREEN_WIDTH
        PRINT AT GROUND_Y, i; "-";
    NEXT i

    ' Input handling
    dx = 0
    IF INKEY$ = "O" THEN dx = -1 ' Move left
    IF INKEY$ = "P" THEN dx = 1  ' Move right
    IF INKEY$ = " " AND y = GROUND_Y THEN dy = JUMP_STRENGTH ' Jump

    ' Apply physics
    x = x + dx
    dy = dy + GRAVITY
    y = y + dy
    
    ' Prevent going below the platform
    IF y > GROUND_Y THEN
        y = GROUND_Y
        dy = 0
    ENDIF

    ' Prevent out-of-bounds
    IF x < 0 THEN x = 0
    IF x > SCREEN_WIDTH THEN x = SCREEN_WIDTH

    ' Draw character
    PRINT AT y, x; CHR$(144) ' UDG A

    ' Small delay
    PAUSE 10

LOOP
