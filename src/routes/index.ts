import { handleIndexGet } from "../controllers/indexcontroller";

var express = require("express");
var router = express.Router();

router.get("/", handleIndexGet);

module.exports = router;
