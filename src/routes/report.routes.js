const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const { handleCreateReport } = require("../controllers/report.controllers");

const reportRouter = express.Router();


// post api/reports
reportRouter.post(
    '/', 
    isLoggedIn, 
    handleCreateReport
)


 



module.exports = reportRouter;