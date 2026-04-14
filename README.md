# Django Project

## Introduction
This project is a Django-based web application designed to demonstrate best practices in web development, utilizing a range of technologies and adhering to the principles of software design.

## Features
- User authentication and authorization
- RESTful API with Django REST framework
- Responsive front-end with Bootstrap
- Admin panel for content management
- Extensive testing suite using pytest
- Docker support for containerized deployment

## Tech Stack
- **Backend:** Django, Django REST Framework
- **Frontend:** HTML, CSS, Bootstrap
- **Database:** DBSqLite
- **Containerization:** Docker
- **Testing:** Pytest
- **Version Control:** Git

## Setup Instructions
### Prerequisites
- Python 3.8+
- pip (Python package installer)
- Git
- Docker (optional)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Satyajeetbh/djangoProject.git
   cd djangoProject
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install required packages:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up the database:**
   - Create a PostgreSQL database and user.
   - Update the `DATABASES` settings in `settings.py` accordingly.
   - Run database migrations:
     ```bash
     python manage.py migrate
     ```
5. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```
6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```
   - Navigate to `http://127.0.0.1:8000` to view your application.

## Deployment Guide
### Docker Deployment
1. **Build the Docker image:**
   ```bash
   docker build -t djangoProject .
   ```
2. **Run the Docker container:**
   ```bash
   docker run -d -p 8000:8000 djangoProject
   ```

### Manual Deployment
1. Set up the server with the necessary environment (Python, pip, PostgreSQL).
2. Clone the repository and follow the installation steps listed above.
3. Configure a web server like Nginx or Apache to serve your Django application.

## Conclusion
This Django project serves as a solid foundation for building robust web applications. Follow the above instructions for a smooth setup and deployment experience.
