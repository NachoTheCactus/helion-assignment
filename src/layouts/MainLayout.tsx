import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">Helion CMS</Link>
          <nav className="space-x-6">
            <Link to="/offers" className="hover:underline">Offers</Link>
            <Link to="/contracts" className="hover:underline">Contracts</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <Outlet />
      </main>
      
      <footer className="bg-muted py-4">
        <div className="container mx-auto text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Helion Contract Management System
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;