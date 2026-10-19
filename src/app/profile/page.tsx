'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  User,
  Settings,
  Trophy,
  Calendar,
  Keyboard,
  Sparkles,
  Edit3,
  Check,
  Mail,
  Camera,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import AvatarPickerModal from '@/components/profile/AvatarPickerModal';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('CyberTypist');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [bio, setBio] = useState('Competitive speed typist & mechanical keyboard enthusiast. Chasing 160 WPM.');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
      if (session.user.image) setImage(session.user.image);
    }
  }, [session]);

  const handleAvatarChange = async (newImage: string | null) => {
    setImage(newImage);

    try {
      // Update active NextAuth session with the short URL
      if (update) {
        await update({ image: newImage });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      const safeImage = typeof image === 'string' && image.length < 500 ? image : null;
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image: safeImage }),
      });

      if (update) {
        await update({ name, image: safeImage });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  const initials = name ? name.slice(0, 2).toUpperCase() : 'KY';

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-5">
            {/* Clickable Profile Photo with Camera Badge */}
            <div className="relative group cursor-pointer" onClick={() => setAvatarModalOpen(true)}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-sky-500/20 shrink-0 overflow-hidden">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover rounded-[14px] transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-extrabold text-2xl font-mono">
                    {initials}
                  </div>
                )}
              </div>

              {/* Hover Camera Overlay Badge */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                <Camera className="w-5 h-5 mb-0.5 text-sky-400" />
                <span>Change</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold">
                  PRO TYPIST
                </span>
              </div>

              {email && (
                <div className="flex items-center gap-1.5 text-xs text-sky-400/90 font-mono mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{email}</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1.5 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Member since Oct 2026
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Rank #4 Global
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAvatarModalOpen(true)}
              leftIcon={<Camera className="w-4 h-4" />}
            >
              Change Photo
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              {isEditing ? 'Cancel' : 'Edit Bio'}
            </Button>
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Settings className="w-4 h-4" />}
              >
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Typist Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">{bio}</p>
              {savedSuccess && (
                <span className="inline-block mt-2 text-xs text-emerald-400">
                  ✓ Profile & photo updated successfully
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hardware Rig Card */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-md mb-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-sky-400" />
          <span>Typing Arsenal & Setup</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Keyboard</span>
            <span className="text-white font-semibold text-sm mt-0.5 block">Keychron Q1 Pro (75%)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Switches</span>
            <span className="text-white font-semibold text-sm mt-0.5 block">Gateron Baby Kangaroo (Tactile)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Layout</span>
            <span className="text-white font-semibold text-sm mt-0.5 block">ANSI QWERTY</span>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentImage={image}
        onSelectImage={handleAvatarChange}
      />
    </div>
  );
}
