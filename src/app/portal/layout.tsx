export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
