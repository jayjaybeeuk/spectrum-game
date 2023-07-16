#!/bin/bash

# create a dist folder if one doesnt exist already
mkdir -p dist

# build the tapes
./libs/zxbasic/zxbc.py ./games/helloworld.bas -o ./dist/helloworld.tap --tap --BASIC --autorun
