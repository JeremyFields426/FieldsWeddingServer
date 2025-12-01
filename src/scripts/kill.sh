#!/bin/bash

FILE="./src/scripts/processes.txt"

if [[ ! -f "$FILE" ]]; then
    exit
fi

echo "Killing Processes: "
cat "$FILE"
echo " "

cat "$FILE" | while read PID
do
   if ps -p $PID > /dev/null; then
      kill $PID
   fi
done

> "$FILE"

echo "KILLED."
echo " "
