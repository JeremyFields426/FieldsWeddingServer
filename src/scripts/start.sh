#!/bin/bash

tsc
bash ./src/scripts/kill.sh
node ./src/scripts/ExtensionAdder.js
node index.js &
echo "$!" >> ./src/scripts/processes.txt
