"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordField } from "@/components/ui/password-input";
import Link from "next/link";

const formSchema = z.object({
  openRouterApiKey: z.string().optional(),
});

export default function TokensForm() {
  const saveUserSettings = useMutation(
    api.mutations.userSettings.saveUserSettings
  );
  const userSettings = useQuery(api.queries.userSettings.getUserSettings);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openRouterApiKey: "",
    },
  });

  // Update form when user settings are loaded
  React.useEffect(() => {
    if (userSettings) {
      form.reset({
        openRouterApiKey: userSettings.openRouterApiKey || "",
      });
    }
  }, [userSettings, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await saveUserSettings({
        openRouterApiKey: values.openRouterApiKey,
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to save settings. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="openRouterApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenRouter API Key</FormLabel>
              <FormControl>
                <PasswordField placeholder="Enter your key" {...field} />
              </FormControl>
              <FormDescription>
                Get your key{" "}
                <Link
                  target="_blank"
                  href="https://openrouter.ai/settings/keys"
                  className="underline"
                >
                  here
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
}
