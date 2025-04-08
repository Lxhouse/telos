'use client';

import Image from "next/image";

import { AppProvider } from './context/AppContext';
import AppLayout from './components/AppLayout';

export default function Home() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
