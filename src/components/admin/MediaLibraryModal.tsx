import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import MediaLibrary, { MediaAsset } from '../../pages/admin/MediaLibrary';

export function MediaLibraryModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (url: string) => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md overflow-y-auto p-4">
      <Card className="max-w-6xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-secondary-200 dark:border-secondary-800">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-secondary-500 hover:text-primary-900 dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-4">
          <h2 className="text-xl font-serif font-bold text-primary-900 dark:text-white">Choose Asset from Media Library</h2>
          <p className="text-xs text-secondary-500">Pick an existing asset or upload a new one to populate your CMS configuration instantly.</p>
        </div>

        <MediaLibrary 
          closeOnSelect={true} 
          onSelect={(asset: MediaAsset) => {
            onSelect(asset.url);
            onClose();
          }} 
        />
      </Card>
    </div>
  );
}
