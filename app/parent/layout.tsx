// Portal ibu bapa — laman awam (tiada login)
export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-lg">M</div>
          <div>
            <div className="font-bold leading-tight">Tadika Mixture</div>
            <div className="text-[11px] text-indigo-100">Portal Ibu Bapa</div>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      <footer className="max-w-2xl mx-auto px-4 py-6 text-center text-[11px] text-slate-400">
        Pautan peribadi & sulit. Jangan kongsi dengan pihak lain.
      </footer>
    </div>
  );
}
