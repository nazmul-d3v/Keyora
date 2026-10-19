'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'interactive' | 'glass';
}

export function Card({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl border transition-all duration-300';

  const variants = {
    default: 'bg-slate-900/70 border-slate-800/80 backdrop-blur-md text-slate-100 shadow-xl',
    glass: 'bg-slate-900/40 border-slate-700/40 backdrop-blur-xl text-slate-100 shadow-2xl shadow-black/40',
    glow: 'bg-slate-900/80 border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.12)] backdrop-blur-md text-slate-100',
    interactive:
      'bg-slate-900/60 border-slate-800/80 hover:border-sky-500/50 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-sky-500/10 cursor-pointer backdrop-blur-md text-slate-100',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-3 flex flex-col space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-bold tracking-tight text-white flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0 flex items-center', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
