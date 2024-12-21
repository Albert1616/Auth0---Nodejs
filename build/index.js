"use strict";
var express = require("express");
require('dotenv').config();
var app = express();
app.listen(process.env.PORT || 3333, function () {
    console.log("Server running on port 8000");
});
