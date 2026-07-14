const Newsletter = require("../Models/Newsletter");



async function SubscribeNewsletter(req, res) {

    try {
        let { email } = req.body;
        email = email.toLowerCase();

        let existingSubscriber = await Newsletter.findOne({ email });

        if (existingSubscriber) {

            return res.json({ success: false, message: "Email already subscribed" });

        }

        let newSubscriber = new Newsletter({ email });

        await newSubscriber.save();

        res.json({ success: true, message: "Subscribed successfully", subscriber: newSubscriber });

    } catch (error) {

        res.json({ success: false, message: error.message });

    }
}



async function GetAllSubscribers(req, res) {

    try {

        let subscribers = await Newsletter.find().sort({ createdAt: -1 });

        res.json({ success: true, totalSubscribers: subscribers.length, subscribers });

    } catch (error) {

        res.json({ success: false, message: error.message });

    }
}



async function DeleteSubscriber(req, res) {

    try {

        let { id } = req.params;

        let subscriber = await Newsletter.findById(id);

        if (!subscriber) {
            return res.json({ success: false, message: "Subscriber not found" });
        }

        await Newsletter.findByIdAndDelete(id);

        res.json({ success: true, message: "Subscriber deleted successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

async function UnsubscribeNewsletter(req, res) {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });
        const subscriber = await Newsletter.findOneAndDelete({ email });
        if (!subscriber) return res.status(404).json({ success: false, message: "Email is not subscribed" });
        return res.json({ success: true, message: "Unsubscribed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { SubscribeNewsletter, UnsubscribeNewsletter, GetAllSubscribers, DeleteSubscriber };
