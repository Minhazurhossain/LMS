# Learning Management System (LMS)

A comprehensive, secure Learning Management System built with Django REST Framework and React, featuring role-based access control, JWT authentication, and complete course management capabilities.

## 🚀 Features

### Authentication & Security
- **JWT-based Authentication** - Secure token-based authentication with automatic refresh
- **Role-Based Access Control** - Three user roles: Admin, Instructor, and Student
- **Password Management** - Forgot password, reset password, and change password functionality
- **Secure Password Hashing** - Using Django's built-in password validation and hashing

### User Management
- User registration with role selection
- Profile management (view and update)
- Role-specific dashboards and permissions
- User activity tracking

### Course Management
- Create, read, update, and delete courses
- Course categorization
- Course difficulty levels (Beginner, Intermediate, Advanced)
- Course thumbnails and rich descriptions
- Instructor assignment to courses

### Enrollment System
- Student course enrollment
- Enrollment status tracking (Enrolled, In Progress, Completed, Dropped)
- Progress tracking with percentage completion
- Enrollment history

### Dashboard & Reports
- **Admin Dashboard**: System-wide statistics (users, courses, enrollments)
- **Instructor Dashboard**: Course and student metrics
- **Student Dashboard**: Personal learning progress
- Comprehensive reporting APIs

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Python web framework
- **Django REST Framework** - API development
- **Simple JWT** - JWT authentication
- **PostgreSQL/SQLite** - Database
- **Pillow** - Image handling

### Frontend
- **React 18** - UI library
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- pip (Python package manager)
- npm or yarn

## ⚙️ Installation & Setup

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd lms-project
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@lms.com

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

5. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Run development server**
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
lms-project/
├── backend/
│   ├── lms_project/          # Main project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── authentication/        # Authentication app
│   │   ├── models.py         # User & PasswordResetToken models
│   │   ├── serializers.py    # Authentication serializers
│   │   ├── views.py          # Auth endpoints
│   │   ├── urls.py
│   │   └── admin.py
│   ├── lms_core/             # LMS core functionality
│   │   ├── models.py         # Course, Category, Enrollment, Lesson
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── permissions.py    # Custom permissions
│   │   ├── urls.py
│   │   └── admin.py
│   ├── templates/            # Email templates
│   ├── media/                # Uploaded files
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/       # Reusable components
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── context/          # React Context
    │   │   └── AuthContext.js
    │   ├── pages/            # Page components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── CourseList.js
    │   │   ├── CourseDetail.js
    │   │   ├── Profile.js
    │   │   ├── ForgotPassword.js
    │   │   └── ResetPassword.js
    │   ├── services/         # API services
    │   │   └── api.js
    │   ├── styles/           # CSS files
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/update/` - Update profile
- `POST /api/auth/password/forgot/` - Request password reset
- `POST /api/auth/password/reset/` - Reset password with token
- `POST /api/auth/password/change/` - Change password

### Courses
- `GET /api/lms/courses/` - List all courses
- `POST /api/lms/courses/` - Create course (Admin/Instructor)
- `GET /api/lms/courses/{id}/` - Get course details
- `PUT /api/lms/courses/{id}/` - Update course
- `DELETE /api/lms/courses/{id}/` - Delete course
- `GET /api/lms/courses/my_courses/` - Get user's courses
- `POST /api/lms/courses/{id}/enroll/` - Enroll in course

### Categories
- `GET /api/lms/categories/` - List categories
- `POST /api/lms/categories/` - Create category
- `GET /api/lms/categories/{id}/` - Get category
- `PUT /api/lms/categories/{id}/` - Update category
- `DELETE /api/lms/categories/{id}/` - Delete category

### Enrollments
- `GET /api/lms/enrollments/` - List enrollments
- `POST /api/lms/enrollments/{id}/update_progress/` - Update progress

### Dashboard & Reports
- `GET /api/lms/dashboard/stats/` - Get dashboard statistics
- `GET /api/lms/reports/admin/` - Get admin reports

## 👥 User Roles & Permissions

### Admin
- Full system access
- Manage all users, courses, and categories
- View comprehensive reports
- Access to admin dashboard

### Instructor
- Create and manage own courses
- View enrolled students
- Update course content
- Track student progress

### Student
- Browse and enroll in courses
- Track personal progress
- View course materials
- Update own profile

## 🔒 Security Features

1. **JWT Token Authentication** - Secure, stateless authentication
2. **Token Refresh Mechanism** - Automatic token renewal
3. **Password Hashing** - Secure password storage using Django's built-in hashing
4. **CORS Protection** - Configured CORS headers
5. **Permission Classes** - Role-based access control
6. **Input Validation** - Comprehensive data validation on both frontend and backend
7. **SQL Injection Protection** - Django ORM prevents SQL injection
8. **XSS Protection** - React's built-in XSS protection

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Responsive Design

The frontend is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Example with Heroku)

1. Install Heroku CLI
2. Create Heroku app
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy:
```bash
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Frontend Deployment (Example with Vercel)

1. Install Vercel CLI
2. Configure environment variables
3. Deploy:
```bash
vercel --prod
```

## 📝 Environment Variables

### Backend
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `ALLOWED_HOSTS` - Comma-separated allowed hosts
- `DATABASE_URL` - Database connection string
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_HOST_USER` - Email username
- `EMAIL_HOST_PASSWORD` - Email password
- `FRONTEND_URL` - Frontend application URL

### Frontend
- `REACT_APP_API_URL` - Backend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Minhazur Hossain - [minhazurhossain98@gmail.com]

## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- JWT.io for JWT resources
- All open-source contributors

