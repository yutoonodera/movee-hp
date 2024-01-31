import { handleIndexGet } from "../controllers/indexcontroller";
import { handleSubPageGet } from "../controllers/subpagecontroller";

var express = require("express");
var router = express.Router();

router.get("/", handleIndexGet);

router.get("/secondary-use-data", handleSubPageGet);

module.exports = router;
