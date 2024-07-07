import { chatMessage } from "../../App";
import logo from "/Logo.svg";
import chopgpt from "/chatimg1.svg";

import { Search } from "lucide-react";

interface IMessageArray {
  chat: chatMessage[];
}

const SideBar = ({ chat }: IMessageArray) => {
  console.log(chat);
  return (
    <div className="hidden lg:w-[25%] rounded-xl lg:flex flex-col">
      <div className="h-[8%] flex justify-start pl-2 gap-4 items-center w-full rounded-t-xl">
        <img src={logo} alt="logo" className="lg:w-[10%] lg:h-[100%] h-6" />
        <span className="text-white/95 text-xl font-semibold">Chop AI</span>
      </div>

      <div className="h-[90%] bg-chopbg w-full rounded-xl p-[5%]">
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
                    {session.chat[0].message.slice(0, 50)}
                  </span>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
