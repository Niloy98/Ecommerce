import dotenv from 'dotenv';
import { app } from './app.js';
import connectDb from './db/index.js';

dotenv.config({
    path: './.env',
});

const port = process.env.PORT || 3000;

connectDb()
.then(() => {
    app.get("/", (req, res) => {
        res.send("Server is connected")
    })
    app.listen(port, (res, req) => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
})
.catch((err) => {
    console.log("MongoDb connection error", err);
})