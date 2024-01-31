"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indexcontroller_1 = require("../controllers/indexcontroller");
const subpagecontroller_1 = require("../controllers/subpagecontroller");
var express = require("express");
var router = express.Router();
router.get("/", indexcontroller_1.handleIndexGet);
router.get("/secondary-use-data", subpagecontroller_1.handleSubPageGet);
module.exports = router;
