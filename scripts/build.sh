#!/bin/bash

# build the tapes
for file in games/*.bas; do
  echo "Building $file"
  ./libs/zxbasic/zxbc.py "$file" -o "./public/games/$(basename "$file" .bas).tap" --tap --BASIC --autorun
done

