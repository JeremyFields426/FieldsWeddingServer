FILE="./src/scripts/processes.txt"

if [[ -f "$FILE" ]]; then
    echo "Processes: "
    cat "$FILE"
    echo " "
fi