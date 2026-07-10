import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Filter, Search, Trash2, Download, FileImage } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

interface MediaItem {
  id: string; name: string; url: string; category: string; size: string;
}

const mediaItems: MediaItem[] = [
  { id: '1', name: 'hero-banking.jpg', url: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Hero', size: '1.2 MB' },
  { id: '2', name: 'team-meeting.jpg', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Team', size: '845 KB' },
  { id: '3', name: 'credit-card.jpg', url: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Products', size: '620 KB' },
  { id: '4', name: 'office-building.jpg', url: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Corporate', size: '1.5 MB' },
  { id: '5', name: 'customer-portrait.jpg', url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'People', size: '430 KB' },
  { id: '6', name: 'finance-charts.jpg', url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Hero', size: '980 KB' },
  { id: '7', name: 'business-suit.jpg', url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'People', size: '310 KB' },
  { id: '8', name: 'modern-office.jpg', url: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Corporate', size: '720 KB' },
];

const categories = ['All', 'Hero', 'Team', 'Products', 'Corporate', 'People'];

export function AdminMediaPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mediaItems.filter((m) => {
    const matchCat = category === 'All' || m.category === category;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <Image className="w-7 h-7 text-accent-500" />
          <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Media Library</h1>
        </div>
        <p className="text-secondary-500 dark:text-secondary-400">Upload and manage website images and assets.</p>
      </motion.div>

      {/* Upload Area */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card className="p-0">
          <div className="border-2 border-dashed border-secondary-300 dark:border-secondary-700 rounded-2xl p-8 text-center hover:border-accent-400 transition-colors cursor-pointer group">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7 text-accent-500" />
            </div>
            <p className="font-semibold text-primary-900 dark:text-white mb-1">Drag and drop files here</p>
            <p className="text-sm text-secondary-400 mb-4">or click to browse — PNG, JPG, SVG up to 5MB</p>
            <Button size="sm" variant="primary"><Upload className="w-4 h-4" /> Choose Files</Button>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input type="text" placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-premium pl-11" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-5 h-5 text-secondary-400 shrink-0" />
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-primary-800 text-white' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Card hover className="overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="p-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm" title="Download"><Download className="w-4 h-4" /></button>
                  <button className="p-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Badge variant="primary" className="absolute top-2 left-2 text-[10px]">{m.category}</Badge>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-primary-900 dark:text-white truncate">{m.name}</p>
                <p className="text-xs text-secondary-400 mt-0.5">{m.size}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* File List */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileImage className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-primary-900 dark:text-white">Recent Uploads</h3>
          </div>
          <div className="space-y-2">
            {filtered.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                <img src={m.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 dark:text-white truncate">{m.name}</p>
                  <p className="text-xs text-secondary-400">{m.category} • {m.size}</p>
                </div>
                <button className="p-2 rounded-lg text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
