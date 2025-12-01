#!/bin/bash

backup="/root/the-mermaids-purses-server/src/database/backups/DB Backup $1.sql"

echo Restoring database with backup \'$backup.\'

sudo -u postgres psql the_mermaids_purses_db < "/root/the-mermaids-purses-server/src/database/backups/DB Backup ${$1}.sql"