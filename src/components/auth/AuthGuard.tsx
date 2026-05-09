'use client';

import React from 'react';
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Lock, Sparkles } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  featureName: string;
  description: string;
}

const AuthGuard = ({ children, featureName, description }: AuthGuardProps) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-8 md:p-12 transition-all hover:border-primary/40">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="h-24 w-24 text-primary rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
            <Lock className="h-8 w-8" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <h3 className="text-2xl font-bold tracking-tight">{featureName} is a Pro Feature</h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                Sign In to Unlock <Sparkles className="h-4 w-4" />
              </button>
            </SignInButton>
          </div>
          
          <p className="text-xs text-muted-foreground pt-2">
            Free forever for early adopters. No credit card required.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
