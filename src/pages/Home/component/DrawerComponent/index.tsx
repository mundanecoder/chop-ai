import React from "react";
import { CircleX, Search } from "lucide-react";
import logo from "/Logo.svg";
import chopgpt from "/chatimg1.svg";
import { chatMessage } from "../../App";

interface IDrawerProps {
  open: boolean;
  handleDrawer: () => void;
  chat: chatMessage[];
}

const DrawerComponent: React.FC<IDrawerProps> = ({
  open,
  handleDrawer,
  chat,
}) => {
  console.log(`Drawer`, open);

  return (
    <div className="absolute block lg:hidden top-0 left-0 h-full w-full text-white z-50">
      {open ? null : (
        <div className="block text-white bg-chopbgblack h-[93.5vh] mt-3 w-[80vw] z-50">
          <div className="w-[97%] border-b-2 border-chop3gray p-1">
            <CircleX size={24} onClick={handleDrawer} />
          </div>
          <div className="flex flex-1 h-[90vh] bg-chopbgblack">
            <div className="block h-[90%] w-[95%] rounded-xl lg:flex flex-col">
              <div className="h-[8vh] flex justify-center gap-4 items-center w-full rounded-t-xl">
                <img
                  src={logo}
                  alt="logo"
                  className="lg:w-[10%] lg:h-[100%] h-10"
                />
                <span className="text-white/95 text-xl font-semibold">
                  Chop AI
                </span>
              </div>
              <div className="h-[98%] bg-chopbg w-full rounded-xl p-[5%]">
                <div className="flex flex-col gap-[10%] h-[25%]">
                  <div className="h-[30%] flex justify-start pl-4 gap-2 items-center w-full rounded-xl bg-chop3gray">
                    <Search size={20} className="text-white/70" />
                    <input
                      type="text"
                      className="outline-none h-full w-full bg-transparent text-sm text-white/90 rounded-xl"
                      placeholder="Search"
                    />
                  </div>
                  <div className="h-[30%] flex  text-sm gap-4 justify-center items-center w-full rounded-xl bg-chop3gray">
                    <p className="text-center text-white/70">Clear Chat</p>
                  </div>
                </div>
                <div className="h-[70%] flex flex-col gap-4">
                  {chat.map((session) =>
                    session.chat.length > 0 ? (
                      <div
                        key={session.id}
                        className="h-[10%] flex justify-start pl-2 gap-4 items-center w-full rounded-xl bg-chop3gray"
                      >
                        <img
                          src={chopgpt}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-white/70 text-xs">
                            {session.chat[0].message.slice(0, 20)}...
                          </span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawerComponent;
