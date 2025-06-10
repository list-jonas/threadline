import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut } from "@/components/sign-out";

const AccountCard = async () => {
  const user = await fetchQuery(
    api.users.currentUser,
    {},
    { token: await convexAuthNextjsToken() }
  );

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center space-y-2">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={user?.image} alt="Profile picture" />
          <AvatarFallback className="text-lg">
            {user?.name?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold">{user?.name}</h3>
        <span className="text-muted-foreground">{user?.email}</span>
        <SignOut />
      </CardContent>
    </Card>
  );
};

export default AccountCard;
