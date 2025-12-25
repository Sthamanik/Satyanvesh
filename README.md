# Satyanvesh - Modern Judiciary Platform

Satyanvesh is a comprehensive web-based legal case management system designed to streamline judiciary processes. It provides a centralized platform for judges, lawyers, litigants, and administrators to track cases, schedule hearings, and manage documents with high transparency and efficiency.

## 🚀 Key Features

- **Dynamic Case Management**: Track case progress from filing to judgment.
- **Role-Based Access Control**: Tailored workflows for Admins, Judges, Advocates, and Litigants.
- **Smart Notifications**: Real-time alerts for hearing schedules, document uploads, and case status updates.
- **"My Cases" Dashboard**: Dedicated views for judges and lawyers to manage their assigned matters.
- **Advanced Search & Filtering**: Quickly find cases by number, title, court, or status.
- **Document Repository**: Securely upload and manage evidence and legal documents.
- **Hearings Scheduling**: Automated calendar and scheduling system for court hearings.
- **Rich Analytics**: Visual insights into case distribution and system statistics.

## 🛠️ Technology Stack

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens) with Cookie-based storage
- **Storage**: Multer & Cloudinary for document management
- **Security**: Bcryptjs, Express-rate-limit, CORS

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: Shadcn UI (Radix-UI)
- **State Management**: TanStack Query (fetching) & Zustand (global state)
- **Charts**: Recharts for statistical visualizations
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```bash
Satyanvesh/
├── backend/            # Express.js Server & MongoDB Models
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   └── services/    # Business logic
│   └── scripts/         # Database seeding & utilities
└── frontend/           # React Application
    ├── src/
    │   ├── api/         # Axios API clients
    │   ├── components/  # Reusable UI components
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Page components
    │   └── stores/      # Zustand state stores
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Satyanvesh.git
   cd Satyanvesh
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # PORT=8000
   # MONGODB_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # CLOUDINARY_CLOUD_NAME=...
   # CLOUDINARY_API_KEY=...
   # CLOUDINARY_API_SECRET=...
   npm run build
   npm run start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create .env file with:
   # VITE_API_BASE_URL=http://localhost:8000/api/v1
   npm run dev
   ```

## 🛡️ License

This project is licensed under the ISC License.

---
*Built with ❤️ for a more efficient legal system.*
