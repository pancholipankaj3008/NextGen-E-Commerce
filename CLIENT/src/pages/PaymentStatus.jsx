import { Check, Clock, X } from "lucide-react";
import { useParams, Link } from "react-router-dom";

export function PaymentStatus() {
  const { status } = useParams();
  const map = { success: [Check, "Payment successful"], failed: [X, "Payment failed"], pending: [Clock, "Payment pending"] };
  const [Icon, title] = map[status] || map.pending;
  return <main className="page"><div className="container section"><div className="empty-state"><div className="empty-mark"><Icon /></div><h1 className="title">{title}</h1><p className="subtitle" style={{ margin: "12px auto 20px" }}>Your order payment state has been recorded.</p><Link className="btn btn-primary" to="/orders">View Orders</Link></div></div></main>;
}
