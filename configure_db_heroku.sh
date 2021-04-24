#!/bin/bash

echo "Configuring heroku postgre database..."

heroku pg:reset DATABASE

heroku pg:psql < ./sql/account.sql
heroku pg:psql < ./sql/accountProflie.sql

echo "Heroku postgre database configured!"