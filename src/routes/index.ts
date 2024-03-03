import { handleIndexGet } from "../controllers/indexcontroller";
import { handleSubPageGet } from "../controllers/subpagecontroller";
import { handleMemberGet } from "../controllers/membercontroller";

var express = require("express");
var router = express.Router();

router.get("/", handleIndexGet);

router.get("/secondary-use-data", handleSubPageGet);

router.get("/member", handleMemberGet);

module.exports = router;
