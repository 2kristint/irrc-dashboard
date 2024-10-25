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
        const userTypeQuery = new Promise((resolve, reject) => {
            db.query(`SELECT data, COUNT(*) AS user_count 
                FROM dbgyt2oi9llwgg.mdlxk_user_info_data 
                WHERE fieldid = 3 
                GROUP BY data
                ORDER BY COUNT(*) DESC;`,
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
        });

        const userZipcodesQuery = new Promise((resolve, reject) => {
            db.query(`SELECT data, 
                COUNT(*) AS user_count FROM dbgyt2oi9llwgg.mdlxk_user_info_data 
                WHERE fieldid = 5 
                GROUP BY data
                ORDER BY COUNT(*) DESC;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const courseNamesQuery = new Promise((resolve, reject) => {
            db.query(`SELECT fullname, 
                id FROM dbgyt2oi9llwgg.mdlxk_course;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Wait for all queries to complete
        const [userTypes, userZipcodes, courseNames] = await Promise.all([userTypeQuery, userZipcodesQuery, courseNamesQuery]);

        // Send combined response as JSON
        res.json({
            userTypes,
            userZipcodes,
            courseNames
        });

    } catch (err) {
        console.error('Error executing queries:', err);
        res.status(500).send('Server error');
    }
});

app.get('/getCourseData', async (req, res) => {
    const param = req.query.param;
    try {

        const enrollmentDataQuery = new Promise((resolve, reject) => {
            db.query(`SELECT c.fullname AS course_name, c.id,
                        CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(*) END AS total_users,
                        CASE WHEN COUNT(CASE WHEN cc.timecompleted IS NOT NULL THEN 1 END) = 0 THEN NULL
                                ELSE COUNT(CASE WHEN cc.timecompleted IS NOT NULL THEN 1 END) END AS completed_users
                    FROM dbgyt2oi9llwgg.mdlxk_course_completions cc
                    JOIN dbgyt2oi9llwgg.mdlxk_course c
                    ON cc.course = c.id
                    WHERE c.id = ${param}
                    GROUP BY c.fullname, c.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const userTypeChoicesQuery = new Promise((resolve, reject) => {
            db.query(`SELECT
                        quizzes.name AS quiz,
                        quizzes.course,
                        quizzes.id AS quiz_id,
                        questions.name AS question_name,
                        questions.id AS question_id,
                        questions.presentation AS answer_choices
                    FROM dbgyt2oi9llwgg.mdlxk_feedback quizzes
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_item questions
                        ON quizzes.id = questions.feedback
                    WHERE quizzes.course =  ${param}
                        AND LOWER(quizzes.name) LIKE LOWER('%Pre-Course Survey%')
                        AND LOWER(questions.name) LIKE LOWER('%I am taking this eLearning module as a(n):');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const userTypeAnswersQuery = new Promise((resolve, reject) => {
            db.query(`SELECT
                        quizzes.name AS quiz,
                        quizzes.course,
                        quizzes.id AS quiz_id,
                        questions.name AS question_name,
                        questions.id AS question_id,
                        answers.value AS answer,
                        COUNT(answers.value) AS answerCount
                    FROM dbgyt2oi9llwgg.mdlxk_feedback quizzes
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_item questions
                        ON quizzes.id = questions.feedback
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_value answers
                        ON questions.id = answers.item
                    WHERE quizzes.course =  ${param}
                        AND LOWER(quizzes.name) LIKE LOWER('%Pre-Course Survey%')
                        AND LOWER(questions.name) LIKE LOWER('%I am taking this eLearning module as a(n):')
                    GROUP BY questions.id, quizzes.id, answers.value
                    ORDER BY quizzes.id, questions.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Wait for all queries to complete
        const [enrollmentData, userTypeChoices, userTypeAnswers] = await Promise.all([enrollmentDataQuery, userTypeChoicesQuery, userTypeAnswersQuery]);

        //format data

        const answerChoicesString = userTypeChoices[0].answer_choices;
        const choiceLabels = answerChoicesString.split('|'); // Splits into an array of labels          

        const feedbackData = userTypeAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: choiceLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        // Send combined response as JSON
        res.json({
            enrollmentData,
            feedbackData
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
