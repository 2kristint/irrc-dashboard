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

        //Number of users enrolled and completed query
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

        //** PreCourse survey queries **//
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

        const gradeLevelChoicesQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(questions.name) LIKE LOWER('%With what grade level(s) do you primarily work (or plan to work) ?%');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const gradeLevelAnswersQuery = new Promise((resolve, reject) => {
            db.query(`WITH RECURSIVE numbers AS (
                        SELECT 1 AS num
                        UNION ALL
                        SELECT num + 1
                        FROM numbers
                        WHERE num < 10
                    ),
                    split_answers AS (
                        SELECT
                            quizzes.name AS quiz,
                            quizzes.course,
                            quizzes.id AS quiz_id,
                            questions.name AS question_name,
                            questions.id AS question_id,
                            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(answers.value, '|', numbers.num), '|', -1)) AS answer
                        FROM dbgyt2oi9llwgg.mdlxk_feedback quizzes
                        JOIN dbgyt2oi9llwgg.mdlxk_feedback_item questions
                            ON quizzes.id = questions.feedback
                        JOIN dbgyt2oi9llwgg.mdlxk_feedback_value answers
                            ON questions.id = answers.item
                        JOIN numbers ON CHAR_LENGTH(answers.value)
                            - CHAR_LENGTH(REPLACE(answers.value, '|', '')) >= numbers.num - 1
                        WHERE quizzes.course = ${param}
                            AND LOWER(quizzes.name) LIKE LOWER('%Pre-Course Survey%')
                            AND LOWER(questions.name) LIKE LOWER('%With what grade level(s) do you primarily work (or plan to work) ?%')
                    )
                    SELECT
                        answer,
                        COUNT(*) AS answerCount
                    FROM split_answers
                    WHERE answer <> ''
                    GROUP BY answer
                    ORDER BY answer;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        //Course feedback queries
        const Q1_OverallFeedbackChoicesQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%Overall, how satisfied or dissatisfied are you with this learning module?%');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q1_OverallFeedbackAnswersQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%Overall, how satisfied or dissatisfied are you with this learning module?%')
                    GROUP BY questions.id, quizzes.id, answers.value
                    ORDER BY quizzes.id, questions.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q2_ApplicableChoicesQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%In your position, how applicable was the content presented in this learning module?%');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q2_ApplicableAnswersQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%Overall, how satisfied or dissatisfied are you with this learning module?%')
                    GROUP BY questions.id, quizzes.id, answers.value
                    ORDER BY quizzes.id, questions.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q3_EngagingAppropriateChoicesQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%The course material was engaging and appropriate for the topic.%');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q3_EngagingAppropriateAnswersQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%The course material was engaging and appropriate for the topic.%')
                    GROUP BY questions.id, quizzes.id, answers.value
                    ORDER BY quizzes.id, questions.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q4_NavigateChoicesQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%How easy was it to navigate this learning module%');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q4_NavigateAnswersQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%How easy was it to navigate this learning module%')
                    GROUP BY questions.id, quizzes.id, answers.value
                    ORDER BY quizzes.id, questions.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q5_TechnologyChoicesQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%How often did you encounter issues related to the learning module technology?%');`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Q5_TechnologyAnswersQuery = new Promise((resolve, reject) => {
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
                        AND LOWER(quizzes.name) LIKE LOWER('%Course Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%How often did you encounter issues related to the learning module technology?%')
                    GROUP BY questions.id, quizzes.id, answers.value
                    ORDER BY quizzes.id, questions.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Wait for all queries to complete
        const [
            enrollmentData,
            userTypeChoices,
            userTypeAnswers,
            gradeLevelChoices,
            gradeLevelAnswers,
            Q1_OverallFeedbackChoices,
            Q1_OverallFeedbackAnswers,
            Q2_ApplicableChoices,
            Q2_ApplicableAnswers,
            Q3_EngagingAppropriateChoices,
            Q3_EngagingAppropriateAnswers,
            Q4_NavigateChoices,
            Q4_NavigateAnswers,
            Q5_TechnologyChoices,
            Q5_TechnologyAnswers
        ] = await Promise.all([
            enrollmentDataQuery,
            userTypeChoicesQuery,
            userTypeAnswersQuery,
            gradeLevelChoicesQuery,
            gradeLevelAnswersQuery,
            Q1_OverallFeedbackChoicesQuery,
            Q1_OverallFeedbackAnswersQuery,
            Q2_ApplicableChoicesQuery,
            Q2_ApplicableAnswersQuery,
            Q3_EngagingAppropriateChoicesQuery,
            Q3_EngagingAppropriateAnswersQuery,
            Q4_NavigateChoicesQuery,
            Q4_NavigateAnswersQuery,
            Q5_TechnologyChoicesQuery,
            Q5_TechnologyAnswersQuery
        ]);

        //** format data **//

        //user type pie chart
        const answerChoicesString = userTypeChoices[0].answer_choices;
        const choiceLabels = answerChoicesString.split('|'); // Splits into an array of labels          
        const feedbackUserTypeData = userTypeAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: choiceLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        //grade level bar chart
        const gradeLevelChoicesString = gradeLevelChoices[0].answer_choices;
        const gradeLevelLabels = gradeLevelChoicesString.split('|');
        const feedbackGradeLevelData = gradeLevelAnswers.map(ele => ele.answerCount);

        //q1 overall feedback pie chart
        const Q1_OverallFeedbackChoicesString = Q1_OverallFeedbackChoices[0].answer_choices;
        const Q1_OverallFeedbackLabels = Q1_OverallFeedbackChoicesString.split('|'); // Splits into an array of labels          
        const Q1_OverallFeedback = Q1_OverallFeedbackAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: Q1_OverallFeedbackLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        //q2 applicable pie chart
        const Q2_ApplicableChoicesString = Q2_ApplicableChoices[0].answer_choices;
        const Q2_ApplicableLabels = Q2_ApplicableChoicesString.split('|'); // Splits into an array of labels          
        const Q2_Applicable = Q2_ApplicableAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: Q2_ApplicableLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        //Q3_EngagingAppropriate pie chart
        const Q3_EngagingAppropriateString = Q3_EngagingAppropriateChoices[0].answer_choices;
        const Q3_EngagingAppropriateLabels = Q3_EngagingAppropriateString.split('|'); // Splits into an array of labels          
        const Q3_EngagingAppropriate = Q3_EngagingAppropriateAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: Q3_EngagingAppropriateLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        //Q4_Navigate pie chart
        const Q4_NavigateString = Q4_NavigateChoices[0].answer_choices;
        const Q4_NavigateLabels = Q4_NavigateString.split('|'); // Splits into an array of labels          
        const Q4_Navigate = Q4_NavigateAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: Q4_NavigateLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        //Q5_Technology pie chart
        const Q5_TechnologyString = Q5_TechnologyChoices[0].answer_choices;
        const Q5_TechnologyLabels = Q5_TechnologyString.split('|'); // Splits into an array of labels          
        const Q5_Technology = Q5_TechnologyAnswers.map((ele, index) => ({
            id: index,
            value: ele.answerCount,
            label: Q5_TechnologyLabels[ele.answer - 1] || `Choice ${ele.answer}`
        }));

        // Send combined response as JSON
        res.json({
            enrollmentData,
            feedbackUserTypeData,
            gradeLevelLabels,
            feedbackGradeLevelData,
            Q1_OverallFeedback,
            Q2_Applicable,
            Q3_EngagingAppropriate,
            Q4_Navigate,
            Q5_Technology
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
