const express = require("express");
const router = express.Router();
const validator = require("validator");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    errors: ""
  });
});

/* POST download page */
router.post(
  "/convert",
  //Validation
  (req, res, next) => {
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)youtube.com\/watch\?v=/g;

    if (!validator.isURL(req.body.youtubeURL)) {
      res.render("index", {
        errors: { error: "Must be a valid URL" }
      });
    } else if (req.body.youtubeURL.match(regex) === null) {
      //Will be null if it doesn't match or an array if it does
      res.render("index", {
        errors: { error: "Must be a valid youtube URL" }
      });
    } else {
      next();
    }
  },
  (req, res, next) => {}
);

module.exports = router;
