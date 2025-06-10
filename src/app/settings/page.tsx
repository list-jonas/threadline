import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import AccountCard from "./_components/account-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/animated-tabs";
import TokensCard from "./_components/tokens-card";
import ModelCard from "./_components/model-card";

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4">
      <header className="flex flex-row mt-8 justify-between">
        <Button asChild variant="ghost">
          <Link href="/chat">
            <ChevronLeft /> Back to chat
          </Link>
        </Button>
        <ThemeToggle />
      </header>
      <div className="grid lg:grid-cols-3 mt-8 gap-4">
        <AccountCard />
        <Tabs defaultValue="tokens" className="col-span-2 w-full">
          <TabsList className="w-full">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="option3">Option 3</TabsTrigger>
            <TabsTrigger value="option4">Option 4</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens">
            <TokensCard />
          </TabsContent>
          <TabsContent value="model">
            <ModelCard />
          </TabsContent>
          <TabsContent value="option3"></TabsContent>
          <TabsContent value="option4"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
