export default function Button({ className = "", ...props }) {
  return (
    <button
      className={`rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 ${className}`}
      {...props}
    />
  );
}
