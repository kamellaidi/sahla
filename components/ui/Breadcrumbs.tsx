import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Fil d'ariane" className="flex items-center gap-1 text-sm text-[#6B6B7B] mb-4 flex-wrap">
      {crumbs.map((crumb, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight size={14} className="text-[#6B6B7B]/50" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#C17817] transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#1A1A2E] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
