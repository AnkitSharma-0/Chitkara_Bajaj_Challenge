const express = require("express");

const router = express.Router();

router.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "Data must be an array",
      });
    }

    return res.status(200).json({
      user_id: "yourname_ddmmyyyy",
      email_id: "yourcollegeemail@example.com",
      college_roll_number: "YOUR_ROLL_NUMBER",
      data_received: data,
      is_success: true,
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      message: error.message,
    });
  }
});

module.exports = router;