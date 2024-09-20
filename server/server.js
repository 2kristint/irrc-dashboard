const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); //converts to JSON

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
            db.query('SELECT fullname FROM dbgyt2oi9llwgg.mdlxk_course;', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const query4 = new Promise((resolve, reject) => {
            db.query(`SELECT c.fullname AS course_name,
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


/* Starting server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
