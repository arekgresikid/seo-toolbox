import { 
  FileCode, 
  Map, 
  ShieldCheck, 
  Tag, 
  Code2, 
  Languages, 
  Smartphone, 
  Zap, 
  FileJson,
  Link2,
  Repeat,
  BarChart2,
  Package,
  Share2,
  Image as ImageIcon,
  Bot,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolType } from '@/types';

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

const tools = [
  { id: 'meta-tag', name: 'Meta Tag Generator', icon: Tag },
  { id: 'sitemap', name: 'Sitemap Generator', icon: Map },
  { id: 'robots', name: 'Robots.txt Tool', icon: ShieldCheck },
  { id: 'google-tag', name: 'Google Tag & GA', icon: FileCode },
  { id: 'schema', name: 'Schema Markup', icon: Code2 },
  { id: 'hreflang', name: 'Hreflang & Canonical', icon: Languages },
  { id: 'mobile-friendly', name: 'Mobile Friendly', icon: Smartphone },
  { id: 'pagespeed', name: 'PageSpeed Insights', icon: Zap },
  { id: 'structured-data-tester', name: 'Schema Tester', icon: FileJson },
  { id: 'broken-link', name: 'Broken Link Checker', icon: Link2 },
  { id: 'redirect', name: 'Redirect Tracer', icon: Repeat },
  { id: 'keyword-density', name: 'Keyword Density', icon: BarChart2 },
  { id: 'pwa-gen', name: 'PWA Manifest', icon: Package },
  { id: 'social-share', name: 'Social Share Links', icon: Share2 },
  { id: 'image-seo', name: 'Image SEO', icon: ImageIcon },
  { id: 'geo-optimizer', name: 'GEO Optimizer', icon: Bot },
  { id: 'view-source', name: 'View Source', icon: Code },
];

const Sidebar = ({ activeTool, setActiveTool }: SidebarProps) => {
  return (
    <nav className="w-64 border-r bg-muted/30 p-4 hidden md:block overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as ToolType)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              activeTool === tool.id ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <tool.icon className="h-4 w-4" />
            {tool.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
