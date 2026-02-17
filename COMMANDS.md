# ScholaMatch - Run Commands

## Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Email (dev)
Emails print to console. For production, configure SMTP in settings.py.
