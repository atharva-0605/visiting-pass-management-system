const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const visitorRoutes = require('./routes/visitors');
const appointmentRoutes = require('./routes/appointments');
const passRoutes = require('./routes/passes');
const checkLogRoutes = require('./routes/checkLogs');
const reportRoutes = require('./routes/reports');

const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: [ 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(req,res) => {
    res.json({
        message: "Welcome to our application"
    })
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/checklogs', checkLogRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
app.listen(PORT,() => {
    console.log(`Server is up and listening at: http://localhost:${PORT} & connected to our db`);
})
})
.catch((error)=>{console.log(error)});