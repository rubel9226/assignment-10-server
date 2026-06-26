const express = require("express"); 
const { handlePaymentSection } = require("../controllers/payment.controllers");
const { isLoggedIn } = require("../middlewares/auth");
const paymentRouter = express.Router();


// post api/users
paymentRouter.post(
    '/payments-update',
    express.raw({ type: "application/json"}),
    handlePaymentSection
);
 

 



module.exports = paymentRouter;