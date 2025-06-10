"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <Card className="w-full max-w-xs">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with you Github account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <LoadingButton
                onClick={() => {
                  setIsLoading(true);
                  // I know this returns a Promise, but don't want to handle it
                  void signIn("github", {
                    redirectTo: "/chat",
                  });
                }}
                className="w-full font-semibold"
                isLoading={isLoading}
              >
                <Github className="mr-2" />
                Login with Github
              </LoadingButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
