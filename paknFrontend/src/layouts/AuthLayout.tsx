import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        src="/images/background_login.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}