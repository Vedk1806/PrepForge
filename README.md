# 🚀 PrepForge — AI-Powered Interview Preparation Platform

<p align="center">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Deployed-AWS EC2 | S3-orange" alt="Deployment" />
</p>

---

## 📌 Overview

**PrepForge** is a full-stack platform that helps job seekers master technical interviews.  
✅ Domain-specific questions  
✅ Real-time AI explanations (Gemini API)  
✅ Track bookmarks & completions  
✅ User dashboard  
✅ Secure JWT Auth  

Built with **React.js (Vite)** & **Django REST Framework**, deployed on **AWS EC2** & **S3**, secured with **Nginx + Gunicorn**.

---

## ✨ Features

- 🎯 **Role-Based Question Sets**
- 📚 **Bookmark & Completion Tracking**
- 🤖 **Ask AI — Gemini 1.5 Flash**
- 📊 **Progress Dashboard**
- 🛡️ **Secure JWT Auth**
- ⚡ **Fast & Responsive UI**

---

## 🛠️ Tech Stack

| Layer    | Technology                           |
|----------|--------------------------------------|
| Frontend | React.js (Vite), Bootstrap, Axios    |
| Backend  | Django REST Framework, PostgreSQL    |
| DevOps   | AWS EC2, S3, Nginx, Gunicorn, systemd |
| AI       | Gemini 1.5 Flash API                 |

---

## 📂 Project Structure

```plaintext
PrepForge/
├── frontend/           # React.js (Vite)
├── backend/            # Django API
├── db.sqlite3 / PostgreSQL
└── README.md
```

## ⚙️ Setup & Deployment
Prerequisites

Python 3.11+

Node.js 18+

PostgreSQL

AWS account with EC2 & S3



## 📦 Backend Setup

# Virtual env

python -m venv venv

source venv/bin/activate

# Install deps

pip install -r requirements.txt

# Migrate & run

python manage.py migrate

python manage.py runserver


## 🖥️ Frontend Setup

cd frontend

npm install

npm run dev

## 🌐 Production
✅ Frontend: npm run build → Upload /dist to S3

✅ Backend: EC2 + Gunicorn + Nginx

✅ Domain & SSL: Route53 + Certbot


## 🤖 AI Integration
Ask AI uses Gemini 1.5 Flash API via a secure /ask-ai/ endpoint, returning markdown-formatted explanations.

## 🔒 Authentication
Secure JWT authentication. Axios interceptors automatically attach tokens for protected API calls.



## 🗂️ Dashboard
Track:

⭐️ Bookmarked questions

✅ Completed questions

View all progress in a clean, Bootstrap-styled dashboard.

## 🌟 Live Demo
🔗 [See it Live](http://prepforge-frontend.s3-website.us-east-2.amazonaws.com/login)

## 📜 License
This project is licensed under the MIT License.



## 🤝 Contributing
Pull requests welcome! 

Please open an issue first to discuss major changes.




## 🙌 Credits
Built with ❤️ by Vedant Katti

📧 vkatti1@asu.edu

💼 www.linkedin.com/in/vedant-katti18





