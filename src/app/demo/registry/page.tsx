"use client";
import React from "react";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { baseSepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { RegistryContextProvider } from "@/context/RegistryContextProvider";
import { Toaster } from "@/components/ui/sonner";
import Registry from "@/components/RegistryComponents/Registry";
import { ConstantsUtil } from "@/utils/ConstantsUtil";

const queryClient = new QueryClient();

const networks = [baseSepolia] as [AppKitNetwork, ...AppKitNetwork[]];

const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks,
  projectId: ConstantsUtil.ProjectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: baseSepolia,
  projectId: ConstantsUtil.ProjectId,
  features: {
    analytics: true,
  },
  themeMode: "light",
  termsConditionsUrl: "https://reown.com/terms-of-service",
  privacyPolicyUrl: "https://reown.com/privacy-policy",
});

export default function RegistryPage() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RegistryContextProvider>
          <Registry />
          <Toaster expand={true} />
        </RegistryContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
