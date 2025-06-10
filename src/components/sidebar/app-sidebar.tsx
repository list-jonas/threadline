"use client";

import { SearchForm } from "@/components/sidebar/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import NavUser from "./nav-user";
import Link from "next/link";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { chats, currentChatId, createNewChat, selectChat, deleteChat } =
    useChatStore();
  const router = useRouter();

  const handleNewChat = () => {
    const newChatId = createNewChat();
    router.push(`/chat/${newChatId}`);
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
    if (currentChatId === chatId) {
      router.push("/chat");
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="font-semibold text-lg">Threadline</div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <Button
              onClick={handleNewChat}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2 text-center">
                  No chats yet. Start a new conversation!
                </div>
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      onClick={() => handleSelectChat(chat.id)}
                      isActive={currentChatId === chat.id}
                      className="group flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                      {/*
                      <Button
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>*/}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
