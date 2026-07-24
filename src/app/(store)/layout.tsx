import React from 'react';
import Announcements from '@/components/store/announcements';
import Navbar from '@/components/store/navbar';
import Footer from '@/components/store/Footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Announcements />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}