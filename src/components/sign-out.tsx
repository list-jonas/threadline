"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function SignOut() {
  const { signOut } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingButton
      variant="destructive"
      onClick={() => {
        setIsLoading(true);
        void signOut();
      }}
      isLoading={isLoading}
      className="w-full"
    >
      <LogOut />
      Log out
    </LoadingButton>
  );
}
