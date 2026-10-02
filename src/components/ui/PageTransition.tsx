'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/**
 * PageTransition — wraps every page with a smooth fade+slide enter animation.
 * The `key` prop on the wrapper forces a remount (and re-animation) on route change.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
