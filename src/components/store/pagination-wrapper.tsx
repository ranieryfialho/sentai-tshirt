"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "./pagination";

type PaginationWrapperProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
};

export function PaginationWrapper({ 
  currentPage, 
  totalPages, 
  baseUrl,
  searchParams 
}: PaginationWrapperProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    router.push(`${baseUrl}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}