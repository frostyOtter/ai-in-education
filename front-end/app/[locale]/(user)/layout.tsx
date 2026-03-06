import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FC, PropsWithChildren } from "react";
import AppSidebar from "./components/app-sidebar";
import Header from "./components/header";

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-grow flex flex-col h-screen">
        <Header />
        <main className="mx-auto w-full p-6 flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserLayout;
