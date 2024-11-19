const express = require('express');
const router = express.Router();
const db = require('../Config/DatabaseConfig');

router.get('/enrollmentdata', async (req, res) => {
    const { from, to } = req.query.param;
    try {
        const courseEnrollmentQuery = new Promise((resolve, reject) => {
            db.query(`SELECT c.fullname AS course_name,
                    COUNT(cs.timecompleted) AS total_complete,
                    COUNT(*) AS total_enrolled,
                    SUM(CASE WHEN FROM_UNIXTIME(cs.timeenrolled) BETWEEN '${from}' AND  '${to}' THEN 1 ELSE 0 END) AS recently_enrolled,
                    SUM(CASE WHEN FROM_UNIXTIME(cs.timecompleted) BETWEEN '${from}' AND  '${to}' THEN 1 ELSE 0 END) AS recently_completed
                    FROM mdlxk_course_completions AS cs
                    JOIN mdlxk_course AS c ON cs.course=c.id
                    LEFT JOIN mdlxk_user_info_data AS u ON cs.userid = u.userid
                    WHERE u.data NOT LIKE '%IRRC%' AND u.fieldid = '3'
                    GROUP BY c.id
                    ORDER BY c.fullname;`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Wait for all queries to complete
        const [courseEnrollment] = await Promise.all([courseEnrollmentQuery]);

        // Send combined response as JSON
        res.json({
            courseEnrollment
        });

    } catch (err) {
        console.error('Error executing queries:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;