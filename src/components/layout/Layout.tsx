import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar className="hidden border-r bg-muted/40 md:block" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}