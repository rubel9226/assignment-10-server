const express = require('express');
const createError = require('http-errors');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { clientUrl } = require('./secret');
const { errorResponse } = require('./controllers/response.controllers');



app.use(cors({
    origin: ["https://assignment-10-woad.vercel.app", "http://localhost:3000", clientUrl],
    credentials: true
}));




const paymentRouter = require('./routes/payment.route');
app.use('/api/payments', paymentRouter);


app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 


const lessonRouter = require('./routes/lesson.route');
app.use('/api/lessons', lessonRouter);

const commentRouter = require('./routes/comment.routes');
app.use('/api/comments', commentRouter);

const reportRouter = require('./routes/report.routes');
app.use('/api/reports', reportRouter);

const userRouter = require('./routes/user.routes');
app.use('/api/users', userRouter);

const adminRouter = require('./routes/admin.routes');
app.use('/api/admins', adminRouter);



app.use((req, res, next) => {
    next(createError(404, 'route not found'));
});

app.use((err, req, res, next) => {
    console.log(err?.message)
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    });
})










module.exports = app;