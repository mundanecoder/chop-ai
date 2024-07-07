import { ReactNode } from "react";
import { Toaster } from "../../@/components/ui/toaster";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-[(100vh-10px)] sm:p-4 gap-2 dark:bg-black flex bg-chopbgblack flex-col backdrop-blur-2xl items-center overflow-x-hidden h-[100vh] justify-center relative  ">
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
