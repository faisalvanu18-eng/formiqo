export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {intro && <p className="mt-2 text-slate-600">{intro}</p>}
      </header>
      <div className="prose-content mt-8 max-w-3xl space-y-6 text-slate-700">
        {children}
      </div>
    </div>
  );
}
