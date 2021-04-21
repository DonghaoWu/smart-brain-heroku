#!/bin/bash

echo "Configuring heroku postgre database..."

heroku pg:reset DATABASE

heroku pg:psql < ./sql/login.sql
heroku pg:psql < ./sql/account.sql

echo "Heroku postgre database configured!"