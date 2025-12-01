#!/bin/bash

tsc
node ./src/scripts/ExtensionAdder.js
node index.js
