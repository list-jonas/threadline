import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModelForm from "./model-form";

const ModelCard = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model</CardTitle>
      </CardHeader>
      <CardContent>
        <ModelForm />
      </CardContent>
    </Card>
  );
};

export default ModelCard;
