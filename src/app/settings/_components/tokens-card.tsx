import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TokensForm from "./tokens-form";

const TokensCard = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <TokensForm />
      </CardContent>
    </Card>
  );
};

export default TokensCard;
