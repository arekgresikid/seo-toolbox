import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  featureName: string;
  description: string;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  // Autentikasi dinonaktifkan sesuai permintaan pengguna.
  // Semua fitur sekarang dapat diakses secara bebas.
  return <>{children}</>;
};

export default AuthGuard;
