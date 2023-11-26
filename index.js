const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./routes'); // require routes.js

require('dotenv').config();

const app = express();

app.use(express.json()); // parse JSON req bodies

app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
