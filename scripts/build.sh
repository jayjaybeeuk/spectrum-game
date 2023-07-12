#!/bin/bash

# create a dist folder if one doesnt exist already
mkdir -p dist

# Clear the dist folder
rm -rf dist/*

# Copy the jsspeccy installation file
cp -r libs/jsspeccy-3.1/* dist/
