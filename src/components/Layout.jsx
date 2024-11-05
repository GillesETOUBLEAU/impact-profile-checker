import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Impact Profile Checker</h1>
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="hover:underline">
                Home
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          © 2024 Impact Profile Checker
        </div>
      </footer>
    </div>
  );
};

export default Layout;