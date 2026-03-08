export default function AppShell({ sidebar, children }) {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border bg-white p-4">{sidebar}</aside>
      <main className="rounded-xl border bg-white p-4">{children}</main>
    </div>
  );
}
