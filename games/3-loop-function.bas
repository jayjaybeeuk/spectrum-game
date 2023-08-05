function mirror (dowedoit as uByte, number as uByte) as uByte

REM I want this function to only mirror if told to. So if dowedoit=0, that means we don't mirror the bits.


 if dowedoit=0 then return number :end if

 

 DIM loopcount as uByte : REM this counts our 8 bit loop.

 DIM potentialOutput as uByte : REM this is the variable we need to hold our part built output.

 

 REM The algorithm here isn't too difficult to follow, if you think of "number" as 8 bits, instead of a numeric value.

 REM This is wise, since we're going to use this function to mirror pixels for the screen.

 REM How it works is that it takes the bits input, and checks the rightmost column

 REM If there's a 1 there, it puts it in the right hand side of the output, and the input rolls right

 REM and the output rolls left.


 REM The result of this is the same bits in the output as were in the input, but opposite way around.

 REM Input bits 01234567 --> output bits 76543210

 

 REM this lets us store graphics as facing left, but be flipped for facing right if we need that, for example.

 

 for loopcount=0 to 7

    let potentialOutput=potentialOutput*2


    REM this in binary shifts all the bits one to the left, and adds a zero on the end.

    REM It's the same thing in decimal - if you multiply by 10, all the columns move one to the left. Since binary is

    REM a base 2 system, and decimal is base 10, then *2 in binary behaves a lot like *10 in decimal.


    if number BAND 1 = 1 then let potentialOutput=potentialOutput+1:END IF

   


REM "BAND" is the binary AND function. In this case, we're looking at the rightmost bit, and seeing if it's 1. If it's            REM 1, we put a 1 in the right most column of the output too.

   

    let number=number/2

REM Just like above, we're rolling the bits right with a divide by 2. Here, the last bit is lost, since in integer maths

REM 1/2=0. We don't have a binary point for fractions.

 next loopcount

 

 return potentialOutput

 REM Return sends back the output from the function


END FUNCTION


cls

REM Here’s how you use it:


print 0,mirror(1,0)

print 1,mirror(1,1)

print "(not mirrored) ";1,mirror(0,1)

print 2,mirror(1,2)

print 3,mirror(1,3)

print 4,mirror(1,4)

print 8,mirror(1,8)

print 16,mirror(1,16)

print 32,mirror(1,32)

print 64,mirror(1,64)

print 127,mirror(1,127)

print 255,mirror(1,255)

print

print 208,mirror(1,208)