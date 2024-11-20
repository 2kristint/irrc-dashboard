const express = require('express');
const router = express.Router();
const db = require('../Config/DatabaseConfig');
const getStatesList = require('../HelperFunctions/getStatesList');

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
            db.query(`SELECT DISTINCT 
                        c.fullname AS fullname, 
                        c.id AS id
                    FROM dbgyt2oi9llwgg.mdlxk_course_completions AS cs
                    JOIN dbgyt2oi9llwgg.mdlxk_course AS c ON cs.course = c.id
                    LEFT JOIN dbgyt2oi9llwgg.mdlxk_user_info_data AS u ON cs.userid = u.userid
                    WHERE u.data NOT LIKE '%IRRC%' AND u.fieldid = '3'
                    ORDER BY c.fullname;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const courseEnrollmentQuery = new Promise((resolve, reject) => {
            db.query(`SELECT c.fullname AS course_name,
                        c.id AS id,
                        COUNT(cs.timecompleted) AS total_complete,
                        COUNT(*) AS total_enrolled
                        FROM dbgyt2oi9llwgg.mdlxk_course_completions AS cs
                        JOIN dbgyt2oi9llwgg.mdlxk_course AS c ON cs.course=c.id
                        LEFT JOIN dbgyt2oi9llwgg.mdlxk_user_info_data AS u ON cs.userid = u.userid
                        WHERE u.data NOT LIKE '%IRRC%' AND u.fieldid = '3'
                        GROUP BY c.id`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Wait for all queries to complete
        const [userTypes, userZipcodes, courseNames, courseEnrollment] = await Promise.all([userTypeQuery, userZipcodesQuery, courseNamesQuery, courseEnrollmentQuery]);

        statesList = getStatesList(userZipcodes);

        // Send combined response as JSON
        res.json({
            userTypes,
            statesList,
            courseNames,
            courseEnrollment
        });

    } catch (err) {
        console.error('Error executing queries:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;