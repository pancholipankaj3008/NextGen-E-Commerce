let dotenv = require("dotenv");
dotenv.config();

let express = require('express');
let cors = require('cors');
var cookieParser = require('cookie-parser')
const ConnectDB = require("./Config/dbConfig");
const UserRouter = require("./Routes/UserRoutes");
let app = express();
let Port = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin:"*",
    credentials:true
}));
app.use(cookieParser());



app.get("/",(req,res)=>{
    console.log("Test Route hit");
})

app.use("/user", UserRouter);

app.listen(Port, ()=>{
    console.log('Server is Runnig on port '+ Port);
    ConnectDB();
})