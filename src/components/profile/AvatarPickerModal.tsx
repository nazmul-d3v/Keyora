'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Trash2, Check, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string | null;
  onSelectImage: (newImage: string | null) => void;
}

const PRESET_AVATARS = [
  { id: '1', path: '/images/avatar-1.svg', name: 'Cyber Neon' },
  { id: '2', path: '/images/avatar-2.svg', name: 'Vampiric Hex' },
  { id: '3', path: '/images/avatar-3.svg', name: 'Matrix Emerald' },
  { id: '4', path: '/images/avatar-4.svg', name: 'Amber Sunset' },
  { id: '5', path: '/images/avatar-5.svg', name: 'Vaporwave Rose' },
  { id: '6', path: '/images/avatar-6.svg', name: 'Teal Bot' },
  { id: '7', path: '/images/avatar-7.svg', name: 'Indigo Phantom' },
  { id: '8', path: '/images/avatar-8.svg', name: 'Mech Switch' },
];

export function AvatarPickerModal({
  isOpen,
  onClose,
  currentImage,
  onSelectImage,
}: AvatarPickerModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep selectedImage in sync when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage || null);
      setUploadError(null);
    }
  }, [isOpen, currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Resize image to max 400x400 using Canvas for optimal storage performance
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSelectedImage(compressedDataUrl);
        } else {
          setSelectedImage(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      setSelectedImage(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setUploadError(null);

      // If user cleared photo
      if (!selectedImage) {
        await fetch('/api/users/avatar', { method: 'DELETE' });
        onSelectImage(null);
        onClose();
        return;
      }

      // If it hasn't changed from currentImage and is already a static path or url, just close
      if (selectedImage === currentImage && !selectedImage.startsWith('data:image/')) {
        onClose();
        return;
      }

      // Send to server to write to disk / update db
      const res = await fetch('/api/users/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save avatar');
      }

      onSelectImage(data.url);
      onClose();
    } catch (err: unknown) {
      setUploadError((err as Error).message || 'Failed to apply photo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsSubmitting(true);
      setUploadError(null);
      await fetch('/api/users/avatar', { method: 'DELETE' });
      setSelectedImage(null);
      onSelectImage(null);
      onClose();
    } catch (err: unknown) {
      setUploadError((err as Error).message || 'Failed to remove avatar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Profile Photo"
      description="Upload your personal photo or select a high-precision cyber avatar"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Current Preview */}
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-0.5 shadow-xl shrink-0 overflow-hidden">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedImage}
                alt="Selected avatar"
                className="w-full h-full object-cover rounded-[14px]"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-white text-xl font-mono">
                KY
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white">Live Avatar Preview</h4>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {selectedImage ? 'Custom avatar ready to apply' : 'Default initials avatar'}
            </p>
            {selectedImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 mt-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove custom photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cyber Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>

        {/* Tab 1: Upload from device */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/70 group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white">
                Click to browse or drop your image here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports PNG, JPG, WebP, SVG, GIF (Up to 5MB)
              </p>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 font-medium">{uploadError}</p>
            )}
          </div>
        )}

        {/* Tab 2: Cyber Preset Avatars */}
        {activeTab === 'presets' && (
          <div>
            <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = selectedImage === avatar.path;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedImage(avatar.path)}
                    className={`p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-500 ring-2 ring-sky-500/40 shadow-lg shadow-sky-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatar.path}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full">
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Custom URL */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400">
              Web Image URL (GitHub, Discord, Unsplash)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <Button variant="secondary" size="sm" onClick={handleApplyUrl}>
                Preview
              </Button>
            </div>
          </div>
        )}

        {/* Upload/General Error Banner */}
        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {uploadError}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply Photo
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AvatarPickerModal;
