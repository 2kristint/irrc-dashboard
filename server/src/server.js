const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const CummulativeData = require('./Routes/CummulativeData');
const CourseSpecificData = require('./Routes/CourseSpecificData');
const CourseEnrollmentData = require('./Routes/CourseEnrollmentData');

const app = express();
app.use(cors());
app.use(express.json()); //converts to JSON
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/cummulative-data', CummulativeData);
app.use('/api/course-specific', CourseSpecificData);
app.use('/api/enrollment-data', CourseEnrollmentData);

/* Starting server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});