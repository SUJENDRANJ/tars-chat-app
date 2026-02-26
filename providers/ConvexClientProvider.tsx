"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import LogoLoader from "@/components/shared/LogoLoader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <AuthLoading>
        <LogoLoader />
      </AuthLoading>
      {children}
    </ConvexProviderWithClerk>
  );
}
