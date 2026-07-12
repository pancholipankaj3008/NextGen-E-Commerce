const express = require("express");

const {

    PlaceOrder,

    MyOrders,

    GetOrder,

    CancelOrder,

    GetAllOrders,

    UpdateOrderStatus

} = require("../Controllers/OrderController");

const { Auth } = require("../Middlewares/Auth");

const OrderRouter = express.Router();

OrderRouter.post(
    "/place-order",
    Auth("user"),
    PlaceOrder
);

OrderRouter.get(
    "/my-orders",
    Auth("user"),
    MyOrders
);

OrderRouter.get(
    "/order/:id",
    Auth("user", "admin"),
    GetOrder
);

OrderRouter.put(
    "/cancel-order/:id",
    Auth("user"),
    CancelOrder
);

OrderRouter.get(
    "/all-orders",
    Auth("admin", "order manager"),
    GetAllOrders
);

OrderRouter.put(
    "/update-status/:id",
    Auth("admin", "order manager"),
    UpdateOrderStatus
);

module.exports = OrderRouter;