import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw, FileImage, Image as ImageIcon } from 'lucide-react';
import { supabaseAdmin as supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploader({ value, onChange, label, className = '' }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setSaving(true);
    try {
      // 1. Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 2. Upload file to Supabase storage 'media' bucket
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        // If 'media' bucket doesn't exist or RLS is blocked, fallback to Base64 Data URL
        console.warn('Storage bucket upload failed, using Data URL fallback:', uploadError);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreview(base64String);
          onChange(base64String);
        };
        reader.readAsDataURL(file);
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        setPreview(publicUrl);
        onChange(publicUrl);

        // Optional: Save to media_library table
        await supabase.from('media_library').insert({
          name: file.name,
          url: publicUrl,
          folder: 'Uploads',
          size: file.size,
          mime_type: file.type
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClipboardPaste = (e: ClipboardEvent) => {
    if (e.clipboardData && e.dataTransfer?.files[0]) {
       handleFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handleClipboardPaste as any);
    return () => {
      window.removeEventListener('paste', handleClipboardPaste as any);
    };
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block">{label}</label>}
      
      <div 
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-[16/9] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
          dragActive 
            ? 'border-accent-500 bg-accent-500/5' 
            : preview 
              ? 'border-secondary-200 dark:border-secondary-800 bg-secondary-50/50 dark:bg-secondary-900/50' 
              : 'border-secondary-300 dark:border-secondary-700 hover:border-accent-500 dark:hover:border-accent-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden" 
          accept="image/*"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-accent-500 animate-spin" />
            <span className="text-xs font-semibold text-secondary-500">Uploading to Secure Storage...</span>
          </div>
        ) : preview ? (
          <div className="absolute inset-0 w-full h-full p-2 group">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-all gap-2">
              <Button size="sm" variant="secondary" className="flex items-center gap-1.5" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                <RefreshCw className="w-4 h-4" /> Replace
              </Button>
              <Button size="sm" variant="danger" className="flex items-center gap-1.5" onClick={(e) => { e.stopPropagation(); onChange(''); setPreview(''); }}>
                <X className="w-4 h-4" /> Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-900 dark:text-white">Drag & drop or Click to Upload</p>
              <p className="text-[10px] text-secondary-400 mt-0.5">Supports PNG, JPG, WebP, SVG. Clipboard paste works too.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
