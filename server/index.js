// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// dotenv.config();

// // Connect to the database
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());


// // Routes
// const authRoutes = require('./route/authRoutes');
// const contactRoutes = require('./route/contactRoutes');
// const jobRoutes = require('./route/jobRoutes');
// const applicationRoutes = require('./route/applicationRoute');
// const reviewRoutes = require('./route/reviewRoutes');

// // Mount Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/job', jobRoutes);
// app.use('/api/application', applicationRoutes);
// app.use('/api/review', reviewRoutes);


// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// server/index.js
// const express = require('express');
// const dotenv  = require('dotenv');
// const cors    = require('cors');
// const connectDB = require('./config/db');

// dotenv.config();
// connectDB();

// const app  = express();
// const PORT = process.env.PORT || 8000;

// // ── CORS ──────────────────────────────────────────────────────────────────────
// // Allow your Vercel frontend + localhost dev
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "http://127.0.0.1:5173",
//   "https://hiresetu.vercel.app",          // ← your Vercel URL
//   /\.vercel\.app$/,                        // covers all preview deployments
// ];

// // app.use(cors({
// //   origin: (origin, callback) => {
// //     // allow requests with no origin (mobile apps, curl, Postman)
// //     if (!origin) return callback(null, true);
// //     const allowed = allowedOrigins.some(o =>
// //       typeof o === "string" ? o === origin : o.test(origin)
// //     );
// //     if (allowed) callback(null, true);
// //     else callback(new Error(`CORS: origin ${origin} not allowed`));
// //   },
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // }));
// app.use(cors({
//   origin: function (origin, callback) {
//     // allow no origin (Postman, mobile apps)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     // allow all .vercel.app
//     if (origin.endsWith(".vercel.app")) {
//       return callback(null, true);
//     }

//     return callback(null, false); // ❗ DO NOT THROW ERROR
//   },
//   credentials: true,
// }));

// // // app.options("/*", cors()); // preflight for all routes

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // ── Routes ────────────────────────────────────────────────────────────────────
// const authRoutes        = require('./route/authRoutes');
// const contactRoutes     = require('./route/contactRoutes');
// const jobRoutes         = require('./route/jobRoutes');
// const applicationRoutes = require('./route/applicationRoute');
// const reviewRoutes      = require('./route/reviewRoutes');

// app.use('/api/auth',        authRoutes);
// app.use('/api/contact',     contactRoutes);
// app.use('/api/job',         jobRoutes);
// app.use('/api/application', applicationRoutes);
// app.use('/api/review',      reviewRoutes);

// // Health check
// app.get('/', (req, res) => res.json({ success: true, message: 'HireSetu API is running 🚀' }));

// // 404 handler
// app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("GLOBAL ERROR:", err.message);
//   res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
// });

// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app  = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("/{*path}", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const authRoutes        = require('./route/authRoutes');
const contactRoutes     = require('./route/contactRoutes');
const jobRoutes         = require('./route/jobRoutes');
const applicationRoutes = require('./route/applicationRoute');
const reviewRoutes      = require('./route/reviewRoutes');

app.use('/api/auth',        authRoutes);
app.use('/api/contact',     contactRoutes);
app.use('/api/job',         jobRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/review',      reviewRoutes);

app.get('/', (req, res) => res.json({ success: true, message: 'HireSetu API running 🚀' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`));