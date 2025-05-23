"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Breadcrumb = { label: string; href: string };

interface BreadcrumbContextType {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (items: Breadcrumb[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
}
