const express = require('express');
const app = express();
const config = require('./config');

// Middleware pour parser le JSON
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const stationRoutes = require('./routes/stationRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/users', userRoutes);
app.use('/trains', trainRoutes);
app.use('/stations', stationRoutes);
app.use('/tickets', ticketRoutes);  

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
