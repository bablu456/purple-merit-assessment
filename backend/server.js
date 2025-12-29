const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const cors = require('cors'); // <--- YE LINE HONI CHAHIYE

dotenv.config();
connectDB();

const app = express();

// --- CORS CONFIGURATION (YE ADD KARNA HAI) ---
// Isse hum Render ko bata rahe hain ki Vercel allowed hai
app.use(cors({
  origin: ["http://localhost:3000", "https://purple-merit-assessment-gules.vercel.app/"], 
  credentials: true
}));
// Note: Upar 'https://purple-merit-assessment-gules.vercel.app/' ki jagah APNA VERCEL LINK dalo (bina '/' ke end me)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));