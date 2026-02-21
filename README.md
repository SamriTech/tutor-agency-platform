## Setup


### Frontend
**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. `npm run build`
3. Run the app:
   `npm run dev`

### Backend
**Prerequisites:**  Python

1. create virtualenv 
    `python -m venv virtualenv`
2. activate virtualenv
    `virtualenv\Scripts\activate`
3. install dependancies
    `pip install -r requirments.txt`
4. make migrations and migrate
    `python manage.py makemigrations` &&
    `python manage.py migrate`
6. runserver
    `python manage.py runserver`

### Additional 

7. create superuser
    `python manage.py createsuperuser`
    * after that fill only username and password 
    * go to `127.0.0.1:8000/admin` fill your created username and password

## Project includes (Backend)

* uses python 3.12
* setted up Corsheaders (don't forget to remove it in production)
* setted up DjangoRestAPI 
* Custom user model in user app
* custom authentication in user app

## Project settings
* rest_framework setup in settings.py
* custom user model setup in user/model 



