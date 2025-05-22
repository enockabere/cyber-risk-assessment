"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TopbarContextType {
  title: string;
  setTitle: (title: string) => void;
}

const TopbarContext = createContext<TopbarContextType | undefined>(undefined);

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Dashboard");

  return (
    <TopbarContext.Provider value={{ title, setTitle }}>
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbar() {
  const context = useContext(TopbarContext);
  if (!context) {
    throw new Error("useTopbar must be used within a TopbarProvider");
  }
  return context;
}
