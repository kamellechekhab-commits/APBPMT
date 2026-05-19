import Builder from '@/components/Builder';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white border-b flex justify-between items-center">
        <span className="font-bold text-xl tracking-tight">DZ PC Builder</span>
        <div className="space-x-4 text-sm">
          <button>EN</button>
          <button>FR</button>
          <button>AR</button>
        </div>
      </nav>
      <Builder />
    </main>
  );
}
