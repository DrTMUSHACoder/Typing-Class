# Typing Class 🚀

A premium, modern web application for mastering touch typing. Built with a focus on aesthetics, real-time feedback, and cloud-synced progress tracking.

![Typing Flow Hero](typing_flow_hero_1768370939389.png)

## ✨ Features
- **Modern UI**: Sleek glassmorphic design with smooth animations.
- **Interactive Guides**: Real-time virtual keyboard and hand guides showing correct finger placement.
- **Progress Dashboard**: Interactive line graphs (Chart.js) visualizing your WPM and Accuracy trends.
- **Cloud Sync**: All sessions are stored in **Supabase**, allowing you to track your progress across any device.
- **Comprehensive Lessons**: Structured practice sessions ranging from basic home row to advanced word integration.
- **Performance Reports**: Detailed breakdowns of most frequent misses and daily performance metrics.

## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6 Modules)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Visuals**: Chart.js for data visualization, custom CSS for animations.

## 🚀 Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/DrTMUSHACoder/Typing-Class.git
   ```
2. **Setup Supabase**:
   - Create a project on Supabase.
   - Run the provided SQL migration scripts to set up the `profiles` and `typing_history` tables.
   - Replace your credentials in `supabase-config.js`.

3. **Run Locally**:
   - Use any live server (e.g., Python `http.server` or VS Code Live Server) to host the project.

## 📜 Database Schema
The project uses two primary tables:
- `profiles`: User information and role management.
- `typing_history`: Records of every typing session including WPM, accuracy, and missed keys.

---
Built with ❤️ for better typing.
