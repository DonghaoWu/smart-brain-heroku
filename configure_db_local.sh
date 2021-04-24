#!/bin/bash
echo "Configuring smart-brain-local db..."

dropdb smart-brain-local
createdb smart-brain-local

psql smart-brain-local < ./sql/account.sql
psql smart-brain-local < ./sql/accountProfile.sql

echo "smart-brain-local db configured!"