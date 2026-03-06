"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <SidebarTrigger />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 hover:bg-orange-600"
          >
            9
          </Badge>
        </Button>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-orange-100 text-orange-600">
              C
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Candies</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
