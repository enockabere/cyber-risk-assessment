"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const PageLoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
});

export function PageLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  useEffect(() => {
    setIsLoading(false); 
  }, [pathname]);

  return (
    <PageLoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
    </PageLoaderContext.Provider>
  );
}

export const usePageLoader = () => useContext(PageLoaderContext);
