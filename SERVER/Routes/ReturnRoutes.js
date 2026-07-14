const express = require("express");
const { Auth } = require("../Middlewares/Auth");
const { CreateReturnRequest, MyReturnRequests, GetReturnRequests, UpdateReturnRequest } = require("../Controllers/ReturnController");
const router = express.Router();
router.get("/my-returns", Auth("user"), MyReturnRequests);
router.post("/:orderId", Auth("user"), CreateReturnRequest);
router.get("/", Auth("admin", "order manager"), GetReturnRequests);
router.put("/:id", Auth("admin", "order manager"), UpdateReturnRequest);
module.exports = router;
