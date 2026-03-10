const express = require("express");
const router = express.Router();
const db = require("../Config/DatabaseConfig");

router.get("/getCourseData", async (req, res) => {
  const param = req.query.param;
  try {
    //Number of users enrolled and completed query
    const enrollmentDataQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT c.fullname AS course_name,
                        COUNT(cs.timecompleted) AS total_complete,
                        COUNT(*) AS total_enrolled
                        FROM dbgyt2oi9llwgg.mdlxk_course_completions AS cs
                        JOIN dbgyt2oi9llwgg.mdlxk_course AS c ON cs.course=c.id
                        LEFT JOIN dbgyt2oi9llwgg.mdlxk_user_info_data AS u ON cs.userid = u.userid
                        WHERE u.data NOT LIKE '%IRRC%' AND u.fieldid = '3'AND c.id = ${param}
                        GROUP BY c.id`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    //** PreCourse survey queries **//
    const userTypeChoicesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%I am taking this eLearning module as a(n):');`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const userTypeAnswersQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                    ORDER BY quizzes.id, questions.id;`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const gradeLevelChoicesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%With what grade level(s) do you primarily work (or plan to work) ?%');`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const gradeLevelAnswersQuery = new Promise((resolve, reject) => {
      db.query(
        `WITH RECURSIVE numbers AS (
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
                    ORDER BY answer;`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    //Course feedback queries
    const Q1_OverallFeedbackChoicesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%Overall, how satisfied or dissatisfied are you with this learning module?%');`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q1_OverallFeedbackAnswersQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                    ORDER BY quizzes.id, questions.id;`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q2_ApplicableChoicesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%In your position, how applicable was the content presented in this learning module?%');`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q2_ApplicableAnswersQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                    ORDER BY quizzes.id, questions.id;`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q3_EngagingAppropriateChoicesQuery = new Promise(
      (resolve, reject) => {
        db.query(
          `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%The course material was engaging and appropriate for the topic.%');`,
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          },
        );
      },
    );

    const Q3_EngagingAppropriateAnswersQuery = new Promise(
      (resolve, reject) => {
        db.query(
          `SELECT
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
                    ORDER BY quizzes.id, questions.id;`,
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          },
        );
      },
    );

    const Q4_NavigateChoicesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%How easy was it to navigate this learning module%');`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q4_NavigateAnswersQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                    ORDER BY quizzes.id, questions.id;`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q5_TechnologyChoicesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                        AND LOWER(questions.name) LIKE LOWER('%How often did you encounter issues related to the learning module technology?%');`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const Q5_TechnologyAnswersQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
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
                    ORDER BY quizzes.id, questions.id;`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const qualitativeFeedbackLikesQuery = new Promise((resolve, reject) => {
      db.query(
        `SELECT
                        course.fullname,
                        quizzes.course,
                        quizzes.name AS quiz,
                        quizzes.id AS quiz_id,
                        questions.name AS question_name,
                        questions.id AS question_id,
                        answers.value
                    FROM dbgyt2oi9llwgg.mdlxk_feedback quizzes
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_item questions
                        ON quizzes.id = questions.feedback
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_value answers
                        ON questions.id = answers.item
                    JOIN dbgyt2oi9llwgg.mdlxk_course course
	                    ON quizzes.course = course.id
                    WHERE quizzes.course = ${param}
                        AND LOWER(quizzes.name) LIKE LOWER('%Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%What did you like most about this learning module?%')
                        AND answers.value <> '';`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });

    const qualitativeFeedbackImprovementsQuery = new Promise(
      (resolve, reject) => {
        db.query(
          `SELECT
                        course.fullname,
                        quizzes.course,
                        quizzes.name AS quiz,
                        quizzes.id AS quiz_id,
                        questions.name AS question_name,
                        questions.id AS question_id,
                        answers.value
                    FROM dbgyt2oi9llwgg.mdlxk_feedback quizzes
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_item questions
                        ON quizzes.id = questions.feedback
                    JOIN dbgyt2oi9llwgg.mdlxk_feedback_value answers
                        ON questions.id = answers.item
                    JOIN dbgyt2oi9llwgg.mdlxk_course course
	                    ON quizzes.course = course.id
                    WHERE quizzes.course = ${param}
                        AND LOWER(quizzes.name) LIKE LOWER('%Feedback%')
                        AND LOWER(questions.name) LIKE LOWER('%What aspects of the learning module could be improved?%')
                        AND answers.value <> '';`,
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          },
        );
      },
    );

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
      Q5_TechnologyAnswers,
      qualitativeFeedbackLikes,
      qualitativeFeedbackImprovements,
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
      Q5_TechnologyAnswersQuery,
      qualitativeFeedbackLikesQuery,
      qualitativeFeedbackImprovementsQuery,
    ]);

    //** format data **//

    //enrollment data pie chart
    const enrollmentCompletedData = [
      {
        id: 0,
        value: enrollmentData[0].total_complete,
        label: "Total Completed",
      },
      {
        id: 1,
        value: enrollmentData[0].total_enrolled,
        label: "Total Enrolled",
      },
    ];
    //user type pie chart
    const answerChoicesString = userTypeChoices[0].answer_choices;
    const choiceLabels = answerChoicesString.split("|"); // Splits into an array of labels
    const feedbackUserTypeData = userTypeAnswers.map((ele, index) => ({
      id: index,
      value: ele.answerCount,
      label: choiceLabels[ele.answer - 1] || `Choice ${ele.answer}`,
    }));

    //grade level bar chart
    const gradeLevelChoicesString = gradeLevelChoices[0].answer_choices;
    const gradeLevelLabels = gradeLevelChoicesString.split("|");
    const feedbackGradeLevelData = gradeLevelAnswers.map(
      (ele) => ele.answerCount,
    );

    //q1 overall feedback pie chart
    const Q1_OverallFeedbackChoicesString =
      Q1_OverallFeedbackChoices[0].answer_choices;
    const Q1_OverallFeedbackLabels = Q1_OverallFeedbackChoicesString.split("|"); // Splits into an array of labels
    const Q1_OverallFeedback = Q1_OverallFeedbackAnswers.map((ele, index) => ({
      id: index,
      value: ele.answerCount,
      label: Q1_OverallFeedbackLabels[ele.answer - 1] || `Choice ${ele.answer}`,
    }));

    //q2 applicable pie chart
    const Q2_ApplicableChoicesString = Q2_ApplicableChoices[0].answer_choices;
    const Q2_ApplicableLabels = Q2_ApplicableChoicesString.split("|"); // Splits into an array of labels
    const Q2_Applicable = Q2_ApplicableAnswers.map((ele, index) => ({
      id: index,
      value: ele.answerCount,
      label: Q2_ApplicableLabels[ele.answer - 1] || `Choice ${ele.answer}`,
    }));

    //Q3_EngagingAppropriate pie chart
    const Q3_EngagingAppropriateString =
      Q3_EngagingAppropriateChoices[0].answer_choices;
    const Q3_EngagingAppropriateLabels =
      Q3_EngagingAppropriateString.split("|"); // Splits into an array of labels
    const Q3_EngagingAppropriate = Q3_EngagingAppropriateAnswers.map(
      (ele, index) => ({
        id: index,
        value: ele.answerCount,
        label:
          Q3_EngagingAppropriateLabels[ele.answer - 1] ||
          `Choice ${ele.answer}`,
      }),
    );

    //Q4_Navigate pie chart
    const Q4_NavigateString = Q4_NavigateChoices[0].answer_choices;
    const Q4_NavigateLabels = Q4_NavigateString.split("|"); // Splits into an array of labels
    const Q4_Navigate = Q4_NavigateAnswers.map((ele, index) => ({
      id: index,
      value: ele.answerCount,
      label: Q4_NavigateLabels[ele.answer - 1] || `Choice ${ele.answer}`,
    }));

    //Q5_Technology pie chart
    const Q5_TechnologyString = Q5_TechnologyChoices[0].answer_choices;
    const Q5_TechnologyLabels = Q5_TechnologyString.split("|"); // Splits into an array of labels
    const Q5_Technology = Q5_TechnologyAnswers.map((ele, index) => ({
      id: index,
      value: ele.answerCount,
      label: Q5_TechnologyLabels[ele.answer - 1] || `Choice ${ele.answer}`,
    }));

    const feedbackSurveys = [
      {
        label:
          "Overall, how satisfied or dissatisfied are you with this learning module?",
        data: Q1_OverallFeedback,
      },
      {
        label: "How applicable was the content?",
        data: Q2_Applicable,
      },
      {
        label:
          "The course material was engaging and appropriate for the topic.",
        data: Q3_EngagingAppropriate,
      },
      {
        label: "How easy was it to navigate this learning module?",
        data: Q4_Navigate,
      },
      {
        label:
          "How often did you encounter issues related to the learning module technology?",
        data: Q5_Technology,
      },
    ];

    // Send combined response as JSON
    res.json({
      enrollmentCompletedData,
      feedbackUserTypeData,
      gradeLevelLabels,
      feedbackGradeLevelData,
      feedbackSurveys,
      qualitativeFeedbackLikes,
      qualitativeFeedbackImprovements,
    });
  } catch (err) {
    console.error("Error executing queries:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
