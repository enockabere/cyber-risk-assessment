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

  // Auto-hide loader on route change complete
  useEffect(() => {
    setIsLoading(false); // Hide loader when pathname changes
  }, [pathname]);

  return (
    <PageLoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
    </PageLoaderContext.Provider>
  );
}

export const usePageLoader = () => useContext(PageLoaderContext);
