#!/bin/bash
set -e

cd /home/fangqi/webservice/learning_logs/ll_proj_py_react
python3 -m venv venv
#source venv/bin/activate
. venv/bin/activate
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py collectstatic --noinput
gunicorn ll_project.wsgi:application --bind 0.0.0.0:8000 --daemon
