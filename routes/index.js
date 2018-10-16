const express = require("express");
const router = express.Router();
const validator = require("validator");
const ytdl = require("youtube-dl");
const path = require("path");
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
  (req, res, next) => {
    //yeap.
    ytdl.getInfo(req.body.youtubeURL, function(err, info) {
      if (err) throw err;
      let x = info.title.replace(/[^A-Za-z0-9 ]/gi, "");
      res.locals.title = x;
      next();
    });
  },
  (req, res, next) => {
    p = path.join(__dirname + "/../public/files/" + res.locals.title + ".mp3");
    ytdl.exec(
      req.body.youtubeURL,
      ["--no-playlist", "-x", "--audio-format", "mp3", "-o", p],
      {},
      (err, output) => {
        if (err) throw err;
        console.log(output.join("\n"));
        res.download(p);
      }
    );
  }
);

module.exports = router;
