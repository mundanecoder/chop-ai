import { Menu } from "lucide-react";
import logo from "/Logo.svg";
import DrawerComponent from "../DrawerComponent";
import { chatMessage } from "../../App";

interface ISmallScreenTopBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chat: chatMessage[];
}

const SmallScreenTopBar: React.FC<ISmallScreenTopBarProps> = ({
  open,
  setOpen,
  chat,
}) => {
  function handleDrawer() {
    setOpen((prev) => !prev);
  }
  return (
    <div className="h-[6%] w-[95%] lg:hidden flex items-center absolute top-4">
      {open ? (
        <div className="block text-white">
          <Menu size={24} onClick={handleDrawer} />
        </div>
      ) : (
        <DrawerComponent open={open} handleDrawer={handleDrawer} chat={chat} />
      )}

      <div className="h-[8%] flex justify-center  gap-4 items-center w-full text-lg rounded-t-xl">
        <img
          src={logo}
          alt="logo"
          className="w-8 h-8 lg:w-12 lg:h-12 rounded-t-xl"
        />
        <span className="text-white/85 text-lg font-semibold">ChopTax</span>
      </div>
    </div>
  );
};

export default SmallScreenTopBar;
