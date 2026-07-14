const ReturnRequest = require("../Models/ReturnRequest");
const Order = require("../Models/Order");

const RETURN_WINDOW_DAYS = Number(process.env.RETURN_WINDOW_DAYS || 7);

function returnDeadline(order) {
  return new Date(new Date(order.deliveredAt || order.updatedAt).getTime() + RETURN_WINDOW_DAYS * 86400000);
}

async function CreateReturnRequest(req, res) {
  try {
    const reason = String(req.body.reason || "").trim();
    if (!reason) return res.status(400).json({ success: false, message: "A reason for the return is required" });
    const order = await Order.findOne({ _id: req.params.orderId, user: req.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.orderStatus !== "delivered" || !order.deliveredAt) {
      return res.status(400).json({ success: false, message: "Only delivered orders can be returned" });
    }
    if (returnDeadline(order) < new Date()) {
      return res.status(400).json({ success: false, message: `The ${RETURN_WINDOW_DAYS}-day return period has ended` });
    }
    const existing = await ReturnRequest.findOne({ order: order._id });
    if (existing) return res.status(409).json({ success: false, message: "A return request already exists for this order", request: existing });
    const request = await ReturnRequest.create({ order: order._id, user: req.id, reason });
    return res.status(201).json({ success: true, message: "Return request submitted", request });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "A return request already exists for this order" });
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function MyReturnRequests(req, res) {
  try {
    const requests = await ReturnRequest.find({ user: req.id }).populate("order").sort({ createdAt: -1 });
    return res.json({ success: true, requests });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
}

async function GetReturnRequests(req, res) {
  try {
    const requests = await ReturnRequest.find().populate("order").populate("user", "name email phone").sort({ createdAt: -1 });
    return res.json({ success: true, requests });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
}

async function UpdateReturnRequest(req, res) {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected', 'picked'].includes(status)) return res.status(400).json({ success: false, message: "Invalid return status" });
    const request = await ReturnRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: "Return request not found" });
    return res.json({ success: true, message: "Return request updated", request });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
}

module.exports = { CreateReturnRequest, MyReturnRequests, GetReturnRequests, UpdateReturnRequest };
