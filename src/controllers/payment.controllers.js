const Stripe = require("stripe");


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.model");
const User = require("../models/users.modal");






const handlePaymentSection = async (req, res, next) => {
    try {
        const signature = req.headers["stripe-signature"]; 
        let event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );


        switch (event.type) {
            case "checkout.session.completed": {

                const session = event.data.object; 
                const userId = session.metadata.userId; 
                const userEmail = session.metadata.userEmail;
        
                // Premium Update
                await User.findByIdAndUpdate(userId, {
                    isPremium: true,
                });
        
                // Payment History
                await Payment.create({
                    userId, 
                    userEmail, 
                    stripeSessionId: session.id, 
                    paymentIntent: session.payment_intent, 
                    amount: session.amount_total, 
                    currency: session.currency, 
                    paymentStatus: session.payment_status,
                });
        
                console.log("Premium Updated");
                break;
            } 
            default: console.log(`Unhandled event ${event.type}`);
        } 


        return res.status(200).json({
            received: true,
        });
    } catch (error) {
        console.log(error.message);
        next(error);            
    }
};



module.exports = {handlePaymentSection}