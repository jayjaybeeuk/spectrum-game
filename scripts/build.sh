#!/bin/bash

# Check if a game file was provided as an argument
if [ -n "$1" ]; then
  file="games/$1.bas"
  if [ -f "$file" ]; then
    echo "Building $file"
    ./libs/zxbasic/zxbc.py "$file" -o "./public/games/$(basename "$file" .bas).tap" --tap --BASIC --autorun
  else
    echo "Error: File '$file' not found."
    exit 1
  fi
else
  # Default behavior: loop through all .bas files
  for file in games/*.bas; do
    echo "Building $file"
    ./libs/zxbasic/zxbc.py "$file" -o "./public/games/$(basename "$file" .bas).tap" --tap --BASIC --autorun
  done
fi
