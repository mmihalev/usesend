"use client";

import { createContext, useContext } from "react";

type BrandingContextValue = {
  appName: string;
  docsUrl: string;
};

const BrandingContext = createContext<BrandingContextValue>({
  appName: "useSend",
  docsUrl: "https://docs.usesend.com",
});

export function BrandingProvider({
  value,
  children,
}: {
  value: BrandingContextValue;
  children: React.ReactNode;
}) {
  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
