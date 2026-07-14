let dotenv = require("dotenv");
dotenv.config();

let express = require('express');
let cors = require('cors');
var cookieParser = require('cookie-parser')
const ConnectDB = require("./Config/dbConfig");

const UserRouter = require("./Routes/UserRoutes");
const ProductRouter = require("./Routes/ProductRoutes");
const CartRouter = require("./Routes/CartRoutes");
const ReviewRouter = require("./Routes/ReviewRoutes");
const NewsletterRouter = require("./Routes/NewsletterRoutes");
const CouponRouter = require("./Routes/CouponRoutes");
const OrderRouter = require("./Routes/OrderRoutes");
const ReturnRouter = require("./Routes/ReturnRoutes");


let app = express();
let Port = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin:["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials:true
}));
app.use(cookieParser());



app.get("/",(req,res)=>{
    res.json({message: "Test Route hit"})
})

app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter)
app.use("/api/cart", CartRouter);
app.use("/api/review", ReviewRouter);
app.use("/api/newsletter", NewsletterRouter);
app.use("/api/coupon", CouponRouter);
app.use("/api/order", OrderRouter);
app.use("/api/returns", ReturnRouter);

app.listen(Port, ()=>{
    console.log('Server is Runnig on port '+ Port);
    ConnectDB();
})
