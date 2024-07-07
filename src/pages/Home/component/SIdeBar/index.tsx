import { User } from "lucide-react";
import { chatMessage } from "../../App";
import logo from "/Logo.svg";

import { Search } from "lucide-react";

interface IMessageArray {
  chat: chatMessage[];
}

const SideBar = ({ chat }: IMessageArray) => {
  // console.log(chat);
  return (
    <div className="hidden lg:w-[20%] rounded-xl lg:flex flex-col">
      <div className="h-[8%] flex justify-start pl-2 gap-4 items-center w-full rounded-t-xl">
        <img src={logo} alt="logo" className="lg:w-[10%] lg:h-[100%] h-6" />
        <span className="text-white/80 text-xl font-semibold">ChopTax</span>
      </div>

      <div className="h-[90%] bg-chopbg/2 w-full rounded-xl p-[5%]">
        <div className="flex flex-col gap-[10%] h-[14%]">
          <div className="h-[6vh] flex justify-start pl-4 gap-2 items-center w-full rounded-xl bg-chop3gray/30">
            <Search size={20} className="text-white/70" />
            <input
              type="text"
              className="outline-none h-full w-full bg-transparent text-sm text-white/90 rounded-xl"
              placeholder="Search"
            />
          </div>
          {/* <div className="h-[30%] flex  text-sm gap-4 justify-center items-center w-full rounded-xl bg-chop3gray">
            <p className="text-center text-white/70">Clear Chat</p>
          </div> */}
        </div>
        <div className="h-[5%] mb-4 flex  text-sm  justify-center items-center w-full rounded-xl bg-chop3gray/30">
          <p className="text-center text-white/70">Chats</p>
        </div>

        <div className="h-[70%] flex flex-col gap-4">
          {chat.map((session) =>
            session.chat.length > 0 ? (
              <div
                key={session.id}
                className="h-[10%] flex justify-start pl-4 gap-1 items-center w-full rounded-xl bg-chop3gray/30"
              >
                {/* <img
                  src={chopgpt}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                /> */}
                <User size={16} className="text-white ml-2" />
                <div className="flex flex-col pl-2">
                  <span className="text-white/70 text-xs">
                    {session.chat[0].message.slice(0, 50)}
                  </span>
                </div>
              </div>
            ) : null
          )}

          <div>
            <div className="h-fit  bottom-14 absolute flex justify-start px-2 py-2 gap-4 items-center w-[21.5%] rounded-xl bg-chop3gray/50">
              {/* <img
                src={chopgpt}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              /> */}
              <div className="flex flex-col">
                <span className="text-white/70 text-[10px] text-wrap">
                  {" "}
                  Hi, you are in beta verion of chop ai , many features are in
                  development mode and will be available soon, we appreciate
                  your feedback help@chop.com
                </span>
                <span className="text-white/70 text-xs text-wrap my-1">
                  for details visit :
                  <a
                    href="https://www.chopchopfinance.com/"
                    className="text-white/80 underline text-[14px] p-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    chopchopfinance
                  </a>
                </span>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
