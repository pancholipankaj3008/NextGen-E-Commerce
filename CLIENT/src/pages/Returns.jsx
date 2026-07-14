import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { GetMyReturns } from "../features/return/returnThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

export function Returns() {
  const dispatch = useAppDispatch();
  const { mine, loading, error } = useAppSelector((state) => state.returns);

  useEffect(() => { dispatch(GetMyReturns()); }, [dispatch]);

  return (
    <main className="page"><section className="section"><div className="container">
      <span className="eyebrow">My Returns</span>
      <h1 className="title">Return requests</h1>
      <p className="subtitle">Only delivered orders can be requested for return within 7 days of delivery.</p>
      {error && <p className="subtitle" style={{ color: "#b42318" }}>{error}</p>}
      {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 8, marginTop: 24 }} /> : mine.length === 0 ? (
        <div style={{ marginTop: 24 }}><EmptyState icon={<RotateCcw />} title="No return requests" text="Open a delivered order to request a return." action={<Link className="btn btn-primary" to="/orders">View orders</Link>} /></div>
      ) : (
        <div className="table-wrap" style={{ marginTop: 24 }}><table className="table"><thead><tr><th>Order</th><th>Reason</th><th>Requested</th><th>Status</th><th /></tr></thead><tbody>
          {mine.map((request) => <tr key={request._id}>
            <td>{request.order?.orderNumber || request.order?._id || "-"}</td>
            <td>{request.reason || "-"}</td>
            <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}</td>
            <td><span className="badge">{request.status}</span></td>
            <td>{request.order?._id && <Link className="btn btn-secondary" to={`/orders/${request.order._id}`}>Order details</Link>}</td>
          </tr>)}
        </tbody></table></div>
      )}
    </div></section></main>
  );
}
