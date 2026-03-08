# LMS (React + Express + MySQL)

## Features
- JWT auth with refresh token cookie
- Subject/section/video hierarchy
- Strict server-side locking by previous video completion
- YouTube embedded playback with resume
- Progress upsert and subject completion summary
- Seeded with multiple courses/subjects

## Run Backend
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

## Run Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Base
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Important Paths
- Backend migrations: `backend/src/migrations`
- Backend seeds: `backend/src/seeds`
- Shared ordering logic: `backend/src/utils/ordering.js`
- Video player: `frontend/src/components/Video/VideoPlayer.jsx`
