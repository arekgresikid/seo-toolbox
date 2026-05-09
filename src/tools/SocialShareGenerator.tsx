
import React, { useState } from 'react';
import { Share2, Copy, MessageCircle, Send, Layout, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const SocialShareGenerator = () => {
  const [url, setUrl] = useState('https://example.com');
  const [title, setTitle] = useState('Check this out!');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Share link copied!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Social Share Link Generator</h2>
        <p className="text-muted-foreground">Generate static share links for social media without using heavy JavaScript SDKs.</p>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" /> Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL to Share</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Text / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cool article I found..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
        {[
          { name: 'Facebook', icon: FacebookIcon, color: 'bg-[#1877F2]', link: shareLinks.facebook },
          { name: 'Twitter / X', icon: TwitterIcon, color: 'bg-[#1DA1F2]', link: shareLinks.twitter },
          { name: 'LinkedIn', icon: LinkedinIcon, color: 'bg-[#0A66C2]', link: shareLinks.linkedin },
          { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]', link: shareLinks.whatsapp },
          { name: 'Telegram', icon: Send, color: 'bg-[#0088CC]', link: shareLinks.telegram }, 
        ].map((platform) => (
          <div key={platform.name} className="bg-card p-5 rounded-2xl border shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                  <platform.icon className="h-5 w-5" />
                </div>
                <span className="font-bold">{platform.name}</span>
              </div>
              <a 
                href={platform.link} 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Generated Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={platform.link}
                  className="flex-1 bg-muted/50 rounded-md px-2 py-1.5 text-[10px] font-mono truncate"
                />
                <button 
                  onClick={() => copyLink(platform.link)}
                  className="p-2 hover:bg-muted rounded-md transition-colors shrink-0"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" /> HTML Snippet Example
        </h3>
        <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed">
          <code>{`<a href="${shareLinks.facebook}" target="_blank" rel="noopener noreferrer">\n  Share on Facebook\n</a>`}</code>
        </pre>
      </div>
    </div>
  );
};

export default SocialShareGenerator;
