export default function ManagementPage() {
  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <iframe
        src="/management/index.html"
        title="Nishop management"
        className="h-full w-full border-0"
      />
    </main>
  );
}
