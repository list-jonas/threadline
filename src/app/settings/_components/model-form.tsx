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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  defaultModel: z.string().optional(),
  systemPrompt: z.string().optional(),
});

export default function ModelForm() {
  const saveUserSettings = useMutation(
    api.mutations.userSettings.saveUserSettings
  );
  const userSettings = useQuery(api.queries.userSettings.getUserSettings);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultModel: "",
      systemPrompt: "",
    },
  });

  // Update form when user settings are loaded
  React.useEffect(() => {
    if (userSettings) {
      form.reset({
        defaultModel: userSettings.defaultModel || "",
        systemPrompt: userSettings.systemPrompt || "",
      });
    }
  }, [userSettings, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await saveUserSettings({
        defaultModel: values.defaultModel,
        systemPrompt: values.systemPrompt,
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
          name="defaultModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a default model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="openai/gpt-4o-mini">
                    GPT-4o Mini
                  </SelectItem>
                  <SelectItem value="anthropic/claude-3.5-sonnet">
                    Claude 3.5 Sonnet
                  </SelectItem>
                  <SelectItem value="anthropic/claude-3-haiku">
                    Claude 3 Haiku
                  </SelectItem>
                  <SelectItem value="google/gemini-pro-1.5">
                    Gemini Pro 1.5
                  </SelectItem>
                  <SelectItem value="meta-llama/llama-3.1-8b-instruct">
                    Llama 3.1 8B
                  </SelectItem>
                  <SelectItem value="meta-llama/llama-3.1-70b-instruct">
                    Llama 3.1 70B
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose your preferred AI model for new conversations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are a helpful AI assistant..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Define the AI's behavior and personality. This will be used as
                the system message for all conversations.
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
