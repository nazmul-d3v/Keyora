'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Keyboard,
  Trophy,
  History,
  LayoutDashboard,
  Settings,
  User,
  Menu,
  Target,
  Sparkles,
  LogOut,
  ChevronDown,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileMenu from './MobileMenu';
import AvatarPickerModal from '@/components/profile/AvatarPickerModal';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status, update } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleAvatarChange = async (newImage: string | null) => {
    try {
      if (update) {
        await update({ image: newImage });
      }
    } catch {
      // ignore
    }
  };

  const navLinks = [
    { href: '/', label: 'Test', icon: Keyboard },
    { href: '/practice', label: 'Practice', icon: Target },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/history', label: 'History', icon: History },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = session?.user;
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'KY';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-500/40 flex items-center justify-center p-2 shadow-lg shadow-sky-500/10 group-hover:border-sky-400 group-hover:shadow-sky-500/20 transition-all">
                <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                  <path d="M12 8 V32" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <path d="M28 10 L16 20 L29 30" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="28" cy="10" r="2.5" fill="#38bdf8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 font-mono">
                  KEY<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">ORA</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider -mt-1 hidden sm:inline">
                  SPEED & PRECISION
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-sky-400' : 'text-slate-400')} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:block" />

            <Link
              href="/settings"
              className={cn(
                'p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/80',
                pathname === '/settings' && 'text-sky-400 bg-sky-500/10 border-sky-500/30'
              )}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Account / Sign In Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-xl bg-slate-800 animate-pulse" />
            ) : user ? (
              /* Logged In User Pill with Name + Email */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 text-left transition-all cursor-pointer shadow-md shadow-black/20 group"
                >
                  {/* Avatar badge */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 p-0.5 shadow-sm shrink-0 overflow-hidden">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name || 'User avatar'}
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-white text-xs font-mono">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Account Name & Email */}
                  <div className="hidden lg:flex flex-col pr-1">
                    <span className="text-xs font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors leading-tight">
                      {user.name || 'Typist'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono leading-tight">
                      {user.email || ''}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
                    {/* Header in dropdown for smaller screens */}
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name || 'Typist'}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <User className="w-4 h-4 text-sky-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                      <span>Dashboard & Stats</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setAvatarModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-sky-400 hover:text-sky-300 hover:bg-slate-800 transition-all cursor-pointer text-left"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </button>

                    <div className="border-t border-slate-800/80 my-1" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Signed Out State -> Link to Login */
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <AvatarPickerModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentImage={user?.image}
        onSelectImage={handleAvatarChange}
      />
    </>
  );
}

export default Navbar;
