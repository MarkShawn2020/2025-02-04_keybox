'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: '/protected/variables', label: '变量管理' },
    { href: '/protected/projects', label: '项目管理' },
  ];

  return (
    <>
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive 
                ? 'text-foreground font-semibold' 
                : 'text-muted-foreground'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
