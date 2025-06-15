
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormWrapperProps {
  children: React.ReactNode;
}

export const AuthFormWrapper = ({ children }: AuthFormWrapperProps) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-200 via-white to-emerald-100">
    <div className="w-full max-w-md space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-emerald-700 mb-2 tracking-tight drop-shadow-sm">
          NutriSync
        </h2>
        <p className="mt-4 text-gray-700">
          Entre para acelerar sua vida saudável
        </p>
      </div>
      <Card className="shadow-xl rounded-2xl border border-emerald-100 bg-white/50">
        {children}
      </Card>
    </div>
    <div className="mt-auto py-4 px-4 text-center">
      <p className="text-sm text-gray-600">
        Sistema desenvolvido pela{" "}
        <span className="font-semibold text-gray-900">
          Brainstorm Agência de Marketing
        </span>
        {" "}- Contato: (32) 9 9166-5327
      </p>
    </div>
  </div>
);
