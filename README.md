# 🎓 STU E-Learning Platform

<!-- ![STU E-Learning Banner](elearning_platform_banner_1777906032591.png) -->

## 🌟 Overview

**STU E-Learning** is a modern, comprehensive educational platform designed to provide a seamless learning experience for students and an efficient management system for instructors. Built with a focus on interactivity and performance, it features real-time communication, structured course management, and advanced assessment tools.

## ✨ Key Features

### 📚 Course Management
- **Course Discovery**: Browse and enroll in a wide variety of courses.
- **Detailed Curriculum**: Structured lessons with rich text content and media.
- **Progress Tracking**: Keep track of your learning journey across all courses.

### 📝 Assessment & Quizzes
- **Dynamic Quizzes**: Interactive quiz system with multiple question types.
- **Quiz Creation**: Tools for instructors to design comprehensive assessments.
- **Real-time Feedback**: Instant results and reviews for quizzes.

### 💬 Social & Interaction
- **Real-time Chat**: Connect with peers and instructors via WebSocket-powered messaging.
- **Community Posts**: Share knowledge, ask questions, and interact with the student community.
- **Friend System**: Manage connections and build your learning network.

### 🔐 Security & Administration
- **Secure Authentication**: Robust login/register system with JWT and email verification.
- **Admin Dashboard**: Comprehensive management tools for platform administrators.
- **Profile Customization**: Detailed user profiles and preference management.

## 🛠 Tech Stack

- **Frontend**: [React.js 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [SCSS](https://sass-lang.com/), [Bootstrap 5](https://getbootstrap.com/)
- **Icons**: [FontAwesome](https://fontawesome.com/)
- **Real-time**: [STOMP over SockJS](https://stomp-js.github.io/stomp-websocket/)
- **Text Editor**: [Quill](https://quilljs.com/)
- **State Management**: React Hooks & Context API
- **Data Handling**: [XLSX](https://github.com/SheetJS/sheetjs) for Excel export/import

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ui-stu-e-learning
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory and add your API endpoints:
   ```env
   REACT_APP_API_URL=your_api_endpoint
   ```

4. **Run the application**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📁 Project Structure

```text
src/
├── assets/             # Images, fonts, and static files
├── components/         # Reusable UI components (Buttons, Inputs, etc.)
├── constant/           # App constants and configuration
├── GlobalStyles/       # Global CSS and SCSS definitions
├── pages/              # Main page views and route components
├── routes/             # Route definitions and navigation logic
├── App.jsx             # Main Application component
└── index.js            # Application entry point
```

## 🏗 Scripts

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm test`: Launches the test runner.
- `npm run eject`: Ejects the build tool configuration (use with caution).

---

Developed with ❤️ for the STU community.
