import React from 'react';
import { Outlet } from 'react-router-dom';
import { Waves } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center mb-4">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}