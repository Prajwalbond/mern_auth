const express =  require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//set up a server
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use(express.json()); //makes any request into json object

//connect to MongoDB
mongoose.connect(
    process.env.MDB_CONNECT,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },
    (err) => {
        if(err) return console.error(err);
        console.log("Connected to MongoDB");
    }
);

// set up router

app.use("/auth",require("./routers/userRouter"));
