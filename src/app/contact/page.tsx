'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { Mail, Send, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Tools
          </Link>

          <div className="flex items-center gap-4 border-b pb-6">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Contact Us</h1>
              <p className="text-muted-foreground">Have a question or suggestion? Reach out to us.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                <h3 className="font-bold flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Feedback</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are constantly improving SEO Toolbox Pro. If you find a bug or have a feature request, we'd love to hear from you.
                </p>
                <div className="pt-4 flex flex-col gap-2">
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Email</div>
                  <a href="mailto:support@seotoolboxpro.com" className="text-primary font-bold hover:underline">support@seotoolboxpro.com</a>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Social Media</h3>
                <p className="text-sm text-muted-foreground">Follow us for SEO tips and tool updates.</p>
                <div className="flex gap-4">
                   <Link href="#" className="h-10 w-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">T</Link>
                   <Link href="#" className="h-10 w-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">F</Link>
                   <Link href="#" className="h-10 w-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">L</Link>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-3xl border shadow-lg space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input type="text" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea rows={4} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help?"></textarea>
                </div>
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
