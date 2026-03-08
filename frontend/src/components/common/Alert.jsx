export default function Alert({ children, type = "info" }) {
  const styles = {
    info: "bg-blue-50 text-blue-700",
    error: "bg-red-50 text-red-700",
    success: "bg-emerald-50 text-emerald-700"
  };
  return <div className={`rounded-md p-3 text-sm ${styles[type]}`}>{children}</div>;
}
