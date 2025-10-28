investment-platform/
├── client/                                # React Frontend (User Interface)
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── build/                             # Created after npm run build
│
├── server/                                # Node.js Backend (API + Socket.io)
│   ├── config/
│   │   ├── db.js                          # MongoDB connection logic
│   │   └── cloudinary.js                  # Optional (if using Cloudinary)
│   │
│   ├── controllers/                       # All route controllers (logic)
│   │   ├── userController.js
│   │   ├── transactionController.js
│   │   ├── authController.js
│   │   └── ...
│   │
│   ├── models/                            # Mongoose models (MongoDB schemas)
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── DailyTask.js
│   │   └── ...
│   │
│   ├── routes/                            # Express routes
│   │   ├── userRoutes.js
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── ...
│   │
│   ├── utils/                             # Helper functions, cron jobs, etc.
│   │   ├── dailyTaskScheduler.js
│   │   └── errorHandler.js
│   │
│   ├── middlewares/                       # Authentication, validation, etc.
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── server.js                          # Main entry (Express + Socket.io)
│   ├── package.json
│   ├── .env
│   └── logs/                              # Optional - for PM2 log files
│
├── nginx/                                 # Optional (for reverse proxy setup)
│   └── default.conf
│
├── docker-compose.yml                     # Optional (if using Docker)
├── Dockerfile                             # Optional (build both client + server)
├── ecosystem.config.js                    # PM2 deployment configuration
└── README.md
