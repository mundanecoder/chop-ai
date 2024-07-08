import { ReactNode } from "react";
import { Toaster } from "../../@/components/ui/toaster";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-[(100vw-10px)] h-screen bg-bggrad sm:p-4 bg-cover bg-no-repeat bg-center gap-2  dark:bg-black flex bg-chopbgblack flex-col backdrop-blur-2xl items-center overflow-x-hidden justify-center relative  overflow-hidden  ">
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
