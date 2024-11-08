const express = require('express');
const router = express.Router();
const db = require('../Config/DatabaseConfig');

router.get('/data', async (req, res) => {
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

        const courseEnrollmentQuery = new Promise((resolve, reject) => {
            db.query(`SELECT c.fullname AS course_name, c.id,
                        CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(*) END AS total_users,
                        CASE WHEN COUNT(CASE WHEN cc.timecompleted IS NOT NULL THEN 1 END) = 0 THEN NULL
                                ELSE COUNT(CASE WHEN cc.timecompleted IS NOT NULL THEN 1 END) END AS completed_users
                    FROM dbgyt2oi9llwgg.mdlxk_course_completions cc
                    JOIN dbgyt2oi9llwgg.mdlxk_course c
                    ON cc.course = c.id
                    GROUP BY c.fullname, c.id;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Wait for all queries to complete
        const [userTypes, userZipcodes, courseNames, courseEnrollment] = await Promise.all([userTypeQuery, userZipcodesQuery, courseNamesQuery, courseEnrollmentQuery]);

        // Send combined response as JSON
        res.json({
            userTypes,
            userZipcodes,
            courseNames,
            courseEnrollment
        });

    } catch (err) {
        console.error('Error executing queries:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;