import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabaseAdmin as supabase } from '../../lib/supabase';
import { 
  FolderPlus, Search, Filter, Image as ImageIcon, 
  Trash2, Upload, Grid, List, Check, Folder, ChevronRight, X, Sparkles 
} from 'lucide-react';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  folder: string;
  size: number;
  mime_type: string;
  created_at: string;
}

const DEFAULT_ASSETS = [
  {
    name: "Evercrest Logo Light",
    url: "https://images.unsplash.com/photo-1542222024-c39e2281f121?auto=format&fit=crop&w=150&h=150&q=80",
    folder: "Logos",
    size: 24500,
    mime_type: "image/png"
  },
  {
    name: "Evercrest Logo Dark",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
    folder: "Logos",
    size: 26100,
    mime_type: "image/png"
  },
  {
    name: "Corporate Hero Banner",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600&q=80",
    folder: "Banners",
    size: 421000,
    mime_type: "image/jpeg"
  },
  {
    name: "Elite Credit Card",
    url: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=500&h=300&q=80",
    folder: "Products",
    size: 112000,
    mime_type: "image/jpeg"
  },
  {
    name: "Private Wealth Advisory",
    url: "https://images.unsplash.com/photo-1579532561814-a44ee6e540b9?auto=format&fit=crop&w=800&h=500&q=80",
    folder: "Banners",
    size: 280000,
    mime_type: "image/jpeg"
  }
];

export default function MediaLibrary({ onSelect, closeOnSelect }: { onSelect?: (asset: MediaAsset) => void; closeOnSelect?: boolean }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<string[]>(['General', 'Logos', 'Banners', 'Products']);
  const [currentFolder, setCurrentFolder] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // New Folder Dialog
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderDialog, setShowFolderDialog] = useState(false);

  // Upload Simulation / Custom Uploads
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setAssets(data);
      // Extract unique folders
      const uniqueFolders = Array.from(new Set(data.map((item: any) => item.folder || 'General')));
      setFolders(['General', ...uniqueFolders.filter(f => f !== 'General')]);
    } else {
      // Seed default assets
      const { error: seedError } = await supabase
        .from('media_library')
        .insert(DEFAULT_ASSETS);
      
      if (!seedError) {
        const { data: seededData } = await supabase
          .from('media_library')
          .select('*');
        if (seededData) setAssets(seededData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    if (!folders.includes(newFolderName)) {
      setFolders([...folders, newFolderName]);
    }
    setNewFolderName('');
    setShowFolderDialog(false);
  };

  const handleUploadSimulate = async () => {
    if (!uploadUrl.trim() || !uploadName.trim()) return;
    const { error } = await supabase
      .from('media_library')
      .insert([{
        name: uploadName,
        url: uploadUrl,
        folder: currentFolder === 'All' ? 'General' : currentFolder,
        size: Math.floor(Math.random() * 200000) + 15000,
        mime_type: 'image/jpeg'
      }]);

    if (!error) {
      setUploadUrl('');
      setUploadName('');
      setShowUploadDialog(false);
      fetchAssets();
    } else {
      alert(error.message);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset from the Media Library?')) {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);
      if (!error) {
        if (selectedAsset?.id === id) setSelectedAsset(null);
        fetchAssets();
      }
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesFolder = currentFolder === 'All' || asset.folder === currentFolder;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Media Library</h1>
          <p className="text-secondary-500 dark:text-secondary-400">Manage, organize, and preview dynamic website media resources securely.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowFolderDialog(true)} className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4" /> New Folder
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowUploadDialog(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Asset
          </Button>
        </div>
      </div>

      {/* Navigation & Search toolbar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setCurrentFolder('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              currentFolder === 'All' 
                ? 'bg-primary-900 text-white dark:bg-white dark:text-primary-900' 
                : 'bg-secondary-50 hover:bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300'
            }`}
          >
            All Media
          </button>
          {folders.map(folder => (
            <button 
              key={folder}
              onClick={() => setCurrentFolder(folder)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                currentFolder === folder 
                  ? 'bg-primary-900 text-white dark:bg-white dark:text-primary-900' 
                  : 'bg-secondary-50 hover:bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-secondary-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="input-premium pl-9"
            />
          </div>
          <div className="flex items-center border border-secondary-200 dark:border-secondary-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-secondary-100 dark:bg-secondary-800 text-primary-900 dark:text-white' : 'text-secondary-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-secondary-100 dark:bg-secondary-800 text-primary-900 dark:text-white' : 'text-secondary-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Main Panel grid & Info Side preview */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {loading ? (
            <div className="py-20 text-center text-secondary-500">Retrieving secure media indexes from database...</div>
          ) : filteredAssets.length === 0 ? (
            <Card className="p-12 text-center text-secondary-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-secondary-300" />
              <p className="font-serif text-lg font-semibold mb-1">No media files found</p>
              <p className="text-sm text-secondary-500">Upload or simulate a library asset inside folder "{currentFolder}" to begin.</p>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAssets.map(asset => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <Card 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-2 cursor-pointer transition-all hover:scale-[1.02] border relative ${
                      isSelected 
                        ? 'border-accent-500 ring-2 ring-accent-500/10' 
                        : 'border-secondary-200 dark:border-secondary-800'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center mb-2">
                      <img src={asset.url} alt={asset.name} className="object-cover w-full h-full" />
                    </div>
                    <p className="text-xs font-semibold truncate text-primary-900 dark:text-white mb-0.5">{asset.name}</p>
                    <p className="text-[10px] text-secondary-500 capitalize">{asset.folder}</p>
                    {isSelected && (
                      <span className="absolute top-4 right-4 bg-accent-500 text-white rounded-full p-1 shadow-md">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-900 text-secondary-500 font-medium">
                    <th className="p-3">Asset</th>
                    <th className="p-3">Folder</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                  {filteredAssets.map(asset => (
                    <tr 
                      key={asset.id} 
                      onClick={() => setSelectedAsset(asset)}
                      className={`cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-900/50 ${
                        selectedAsset?.id === asset.id ? 'bg-accent-50 dark:bg-accent-500/5' : ''
                      }`}
                    >
                      <td className="p-3 flex items-center gap-3">
                        <img src={asset.url} alt={asset.name} className="w-8 h-8 rounded object-cover" />
                        <span className="font-semibold text-primary-900 dark:text-white truncate max-w-[200px]">{asset.name}</span>
                      </td>
                      <td className="p-3 text-secondary-600 dark:text-secondary-400">{asset.folder}</td>
                      <td className="p-3 text-secondary-500 text-xs">{(asset.size / 1024).toFixed(1)} KB</td>
                      <td className="p-3 text-secondary-500 text-xs">{asset.mime_type}</td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset.id); }}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Selected preview sidebar */}
        <div className="w-full lg:w-72 flex-none">
          <Card className="p-4 sticky top-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-500">Asset Details</h3>
            {selectedAsset ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                  <img src={selectedAsset.url} alt={selectedAsset.name} className="object-contain max-h-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-primary-900 dark:text-white truncate">{selectedAsset.name}</h4>
                  <p className="text-xs text-secondary-500 truncate">{selectedAsset.url}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-secondary-500 bg-secondary-50 dark:bg-secondary-900 p-2.5 rounded-lg border border-secondary-200 dark:border-secondary-800">
                  <div>Folder: <strong className="text-primary-900 dark:text-white block">{selectedAsset.folder}</strong></div>
                  <div>Size: <strong className="text-primary-900 dark:text-white block">{(selectedAsset.size / 1024).toFixed(1)} KB</strong></div>
                  <div className="col-span-2 mt-1">Mime-Type: <strong className="text-primary-900 dark:text-white block">{selectedAsset.mime_type}</strong></div>
                </div>
                {onSelect && (
                  <Button 
                    variant="accent" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      onSelect(selectedAsset);
                    }}
                  >
                    <Check className="w-4 h-4" /> Confirm Selection
                  </Button>
                )}
                <Button 
                  variant="danger" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleDeleteAsset(selectedAsset.id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete Asset
                </Button>
              </div>
            ) : (
              <div className="py-12 text-center text-secondary-400 text-xs">
                Select any media asset from the grid to view properties or execute picker selection.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* New Folder Modal */}
      {showFolderDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="p-6 max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Create New Folder</h3>
              <button onClick={() => setShowFolderDialog(false)}><X className="w-5 h-5 text-secondary-400" /></button>
            </div>
            <input 
              type="text" 
              placeholder="e.g. Statements, Avatars..." 
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className="input-premium"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowFolderDialog(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateFolder}>Create Folder</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Upload/Simulate Modal */}
      {showUploadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="p-6 max-w-md w-full mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Upload Media Asset</h3>
              <button onClick={() => setShowUploadDialog(false)}><X className="w-5 h-5 text-secondary-400" /></button>
            </div>
            <p className="text-xs text-secondary-500">Provide an image URL or mock reference to index it securely in your dynamic Media Library.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Asset Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Autumn Promotions Banner" 
                  value={uploadName}
                  onChange={e => setUploadName(e.target.value)}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Asset URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://images.unsplash.com/photo-..." 
                  value={uploadUrl}
                  onChange={e => setUploadUrl(e.target.value)}
                  className="input-premium"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleUploadSimulate}>Upload to {currentFolder === 'All' ? 'General' : currentFolder}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
