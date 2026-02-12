"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home size={16} />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-white/20" />
            {isLast ? (
              <span className="text-foreground font-medium capitalize">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-foreground transition-colors capitalize"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}