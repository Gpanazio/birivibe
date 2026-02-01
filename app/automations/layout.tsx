import { db } from '@/lib/db';

export default async function AutomationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-bold">BiriVibe - Automações</h2>
          <a
            href="/automations/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Nova Automação
          </a>
        </div>
      </nav>
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}