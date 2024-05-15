# Games notes for Basic Platform Logic:

This is a quite set of notes about the basic platformer game logic written in basic to be compiled with zxbasic.

## Initialization:

- BORDER 0: PAPER 0: INK 7: CLS sets the screen border, background, and text color, then clears the screen.
- Variables x and y set the player's initial position.
- scrollPos keeps track of the scrolling position.
- The bg array holds the background data.

## Background and Player Drawing:

- The initial background is drawn using a loop.
- The player is drawn at the starting position.

## Main Game Loop:

- Erase Player: Clears the player's current position.
- Get Input: Checks for user input to move the player or exit the game.
- Boundary Check: Ensures the player doesn't move out of bounds.
- Draw Player: Redraws the player at the new position.
- Scroll Background: Scrolls the background by shifting the array and generating new random elements.
- Pause: Adds a short pause to control game speed.
- End Game: Exits the loop and prints "GAME OVER" when the space key is pressed.
