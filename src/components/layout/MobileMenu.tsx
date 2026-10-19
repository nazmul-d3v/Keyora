'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Keyboard,
  Trophy,
  History,
  LayoutDashboard,
  Info,
  Settings,
  User,
  LogIn,
  LogOut,
  X,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  if (!isOpen) return null;

  const links = [
    { href: '/', label: 'Speed Test', icon: Keyboard },
    { href: '/practice', label: 'Practice Mode', icon: Target },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/history', label: 'History', icon: History },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/about', label: 'About Keyora', icon: Info },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'KY';

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <span className="font-bold text-lg text-white tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              MENU
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Info Pill if Signed In */}
          {user && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 p-0.5 shrink-0 shadow-sm overflow-hidden">
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
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  {user.name || 'Typist'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  {user.email || ''}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-sky-400' : 'text-slate-400')} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Theme and Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Theme</span>
            <ThemeToggle />
          </div>

          {user ? (
            <div className="space-y-2">
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <User className="w-4 h-4 text-sky-400" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  onClose();
                  signOut({ callbackUrl: '/' });
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
