#!/bin/bash

echo "Configuring heroku postgre database..."

heroku pg:reset DATABASE

heroku pg:psql < ./sql/account.sql
heroku pg:psql < ./sql/accountProfile.sql

echo "Heroku postgre database configured!"