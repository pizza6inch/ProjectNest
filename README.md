# ProjectNest

for database course project


## development setup

### frontend

```cmd
cd frontend
npm install
npm run dev
```

### backend
```cmd
cd backend
```

(if first time)
create virtual environment
```cmd
python -m venv .venv
```

if using cmd
```
.venv\Scripts\activate
```
if using powershell
```
.venv\Scripts\Activate.ps1
```
if using macOS / Linux
```
source .venv/bin/activate
```

install dependencies & check
```cmd
pip install -r requirements.txt
cd myproject
python manage.py runserver
```

if you need to install new package then remember to update requirements.txt
```
pip freeze > requirements.txt
```

##