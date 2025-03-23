"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import type { ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

export function Provider(props: ThemeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider forcedTheme="light" {...props} />
    </ChakraProvider>
  );
}

export const DynamicProvider = dynamic(
  () => import("@/components/ui/provider").then((mod) => mod.Provider),
  { ssr: false }
);
