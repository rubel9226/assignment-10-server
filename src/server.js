const app = require("./app");
const { serverPort, mongodbURL } = require("./secret");
const connectDatabase = require("./config/db");



app.listen(serverPort, '0.0.0.0', async (req, res)=> {
    console.log(`server is running http://localhost:${serverPort}`);
    await connectDatabase();
});