const express = require("express");
const router = express.Router();
const db = require("../Config/DatabaseConfig");
const getStatesList = require("../HelperFunctions/getStatesList");

router.get("/data", async (req, res) => {
  try {
    const [userTypes] = await db.query(
      `SELECT data, COUNT(*) AS user_count 
                FROM dbgyt2oi9llwgg.mdlxk_user_info_data 
                WHERE fieldid = 3 
                GROUP BY data
                ORDER BY COUNT(*) DESC;`,
    );
    const [userZipcodes] = await db.query(
      `SELECT data, 
                COUNT(*) AS user_count FROM dbgyt2oi9llwgg.mdlxk_user_info_data 
                WHERE fieldid = 5 
                GROUP BY data
                ORDER BY COUNT(*) DESC;`,
    );
    const [courseNames] = await db.query(
      `SELECT DISTINCT 
                        c.fullname AS fullname, 
                        c.id AS id
                    FROM dbgyt2oi9llwgg.mdlxk_course_completions AS cs
                    JOIN dbgyt2oi9llwgg.mdlxk_course AS c ON cs.course = c.id
                    LEFT JOIN dbgyt2oi9llwgg.mdlxk_user_info_data AS u ON cs.userid = u.userid
                    WHERE u.data NOT LIKE '%IRRC%' AND u.fieldid = '3'
                    ORDER BY c.fullname;`,
    );
    const [courseEnrollment] = await db.query(
      `SELECT c.fullname AS course_name,
                        c.id AS id,
                        COUNT(cs.timecompleted) AS total_complete,
                        COUNT(*) AS total_enrolled
                        FROM dbgyt2oi9llwgg.mdlxk_course_completions AS cs
                        JOIN dbgyt2oi9llwgg.mdlxk_course AS c ON cs.course=c.id
                        LEFT JOIN dbgyt2oi9llwgg.mdlxk_user_info_data AS u ON cs.userid = u.userid
                        WHERE u.data NOT LIKE '%IRRC%' AND u.fieldid = '3'
                        GROUP BY c.id`,
    );
    const statesList = getStatesList(userZipcodes);
    res.json({
      userTypes,
      statesList,
      courseNames,
      courseEnrollment,
    });
  } catch (err) {
    console.error("Error executing queries:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
