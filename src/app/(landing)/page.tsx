import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div>
      <h1>Landing Page</h1>

      <Button asChild>
        <Link href="/auth/signin">
          <LogInIcon className="mr-2" /> SignIn
        </Link>
      </Button>
    </div>
  );
};

export default LandingPage;
