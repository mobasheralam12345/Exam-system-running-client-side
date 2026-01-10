# Online Exam System - Client

The frontend application for the Online Exam System, built with **React** and **Vite**. It delivers a high-performance, responsive interface for students to take exams and admins to manage the platform.

## 🔗 Related Repository

- **Server**: [../server/README.md](../server/README.md)

## ✨ Frontend Features

### 🎓 Student Interface

**1. Live Assessment Engine**

- **Strict Proctoring**:
  - **Webcam Monitoring**: Uses `face-api.js` for real-time face detection. Alerts on: missing face, multiple faces, head turning.
  - **Fullscreen Enforcement**: Forces fullscreen mode; logs violations on exit (`ESC`).
  - **Focus Tracking**: Detects browser tab switching or window blurring.
- **Real-time Timer**: Syncs with server time.
- **Dynamic Interface**: Supports complex question types (images, special symbols).

**2. Practice Mode**

- **Flexible Selection**: Choose exams by Category (BCS/HSC/Bank) -> Mode (Subject/Year).
- **Review System**:
  - Detailed score cards with accuracy percentage.
  - **PDF Download**: Generates a complete exam report with Bengali support using `html2pdf.js`.

**3. User Dashboard**

- **Profile**: Image upload, personal details editing.
- **Analytics**: Visualization of performance over time.
- **Verification**: UI for email and profile verification steps.

### 🛡️ Admin Interface

**1. Dynamic Exam Creator**

- **Step-by-Step Wizard**: Create exams in logical steps (Setup -> Subjects -> Questions).
- **Rich Text Editor**: Integrated **React Quill** custom toolbar for:
  - Text formatting
  - **Mathematical/Special Symbols**
  - Image embedding
- **Dynamic Structure**: Add unlimited subjects and questions per subject.

**2. Management & Monitoring**

- **Invitation System**: Send email invites to onboard new admins/editors.
- **Leaderboard Control**: View rankings with filters for "Cheat Score" (violation count).

## 🛠️ Tech Stack & Libraries

| Category    | Technology                   | Usage                       |
| :---------- | :--------------------------- | :-------------------------- |
| **Core**    | React 18, Vite               | UI Framework & Build Tool   |
| **Styling** | Tailwind CSS, DaisyUI        | Responsive Design System    |
| **State**   | React Query, Context API     | Server State & Global State |
| **Routing** | React Router v6              | Navigation                  |
| **Editor**  | React Quill                  | Rich Text Question Editing  |
| **PDF**     | html2pdf.js, html2canvas-pro | Report Generation           |
| **AI/ML**   | face-api.js                  | Webcam Proctoring           |
| **Charts**  | Recharts                     | Analytics Visualization     |
| **Icons**   | React Icons, Heroicons       | UI Elements                 |

## 🚀 Installation & Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

3. **Development Server**
   ```bash
   npm start
   ```
   Runs on `http://localhost:5173`.

## 📂 Key Directory Structure

```
src/
├── Pages/
│   ├── Admin/              # Exam Creation Wizard, Dashboard
│   ├── ExamRoom/           # LiveExamRoom (Proctoring logic), PracticeRoom
│   ├── StudentDashboard/   # Analytics, PDF Review
│   └── ...
├── components/             # Reusable UI (WebcamPanel, QuestionDisplay)
├── hooks/                  # Logic extraction
│   ├── useWebcamMonitoring.js  # Face detection & violation logic
│   ├── useFullscreen.js        # Screen security logic
│   └── ...
└── services/               # API calls (Axios)
```

## 📝 License

MIT License.
