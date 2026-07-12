export default function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-mark">{icon}</div>
      <h2 className="title" style={{ fontSize: 32 }}>{title}</h2>
      {text && <p className="subtitle" style={{ margin: "12px auto 22px" }}>{text}</p>}
      {action}
    </div>
  );
}
