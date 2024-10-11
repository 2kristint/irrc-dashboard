const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); //converts to JSON
app.use(bodyParser.urlencoded({ extended: true }));


/* Connect to database */
//env variables for security
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

/* Grab data from multiple queries */
app.get('/api/data', async (req, res) => {
    try {
        const query1 = new Promise((resolve, reject) => {
            db.query('SELECT data, COUNT(*) AS user_count FROM dbgyt2oi9llwgg.mdlxk_user_info_data WHERE fieldid = 3 GROUP BY data;',
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
        });

        const query2 = new Promise((resolve, reject) => {
            db.query('SELECT data, COUNT(*) AS user_count FROM dbgyt2oi9llwgg.mdlxk_user_info_data WHERE fieldid = 5 GROUP BY data;', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const query3 = new Promise((resolve, reject) => {
            db.query('SELECT fullname, id FROM dbgyt2oi9llwgg.mdlxk_course;', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const query4 = new Promise((resolve, reject) => {
            db.query(`SELECT c.fullname AS course_name, c.id,
                            COUNT(*) AS total_users,
                            COUNT(CASE WHEN cc.timecompleted IS NOT NULL THEN 1 END) AS completed_users
                        FROM dbgyt2oi9llwgg.mdlxk_course_completions cc
                        JOIN dbgyt2oi9llwgg.mdlxk_course c
                            ON cc.course = c.id
                        GROUP BY c.fullname;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });


        // Wait for all queries to complete
        const [userTypes, userZipcodes, courseNames, enrollmentData] = await Promise.all([query1, query2, query3, query4]);

        // Send combined response as JSON
        res.json({
            userTypes,
            userZipcodes,
            courseNames,
            enrollmentData
        });

    } catch (err) {
        console.error('Error executing queries:', err);
        res.status(500).send('Server error');
    }
});

app.get('/get', (req, res) => {
    const param = req.query.param; // Access query parameter
    console.log('Received request with param:', param); // Add this log
    res.json({ message: `Received param: ${param}` });
});

app.get('/get1', async (req, res) => {
    const param = req.query.param;
    try {
        const query5 = new Promise((resolve, reject) => {
            db.query(`SELECT quizzes.name AS quiz, quizzes.course, quizzes.id, questions.name, questions.id, answers.value
            FROM dbgyt2oi9llwgg.mdlxk_feedback quizzes
            JOIN dbgyt2oi9llwgg.mdlxk_feedback_item questions
            ON quizzes.id = questions.feedback
            Join dbgyt2oi9llwgg.mdlxk_feedback_value answers
                ON questions.id = answers.item
            WHERE quizzes.course = ${param};
                `,
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
        });

        // Wait for all queries to complete
        const [dataList] = await Promise.all([query5]);

        // Send combined response as JSON
        res.json({
            dataList
        });

    } catch (err) {
        console.error('Error executing queries:', err);
        res.status(500).send('Server error');
    }
});


/* Starting server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
