"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Mostra apenas 5 páginas por vez
  const visiblePages = pages.filter(page => {
    return page === 1 || 
           page === totalPages || 
           (page >= currentPage - 1 && page <= currentPage + 1);
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-white/10"
      >
        <ChevronLeft size={16} />
      </Button>

      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="text-muted-foreground px-2">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page)}
              className={cn(
                "border-white/10 min-w-[40px]",
                currentPage === page && "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              )}
            >
              {page}
            </Button>
          </div>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-white/10"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}