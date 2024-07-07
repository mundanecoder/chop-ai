import { MessageCircleX } from "lucide-react";
import chopgpt from "/chatimg1.svg";

interface IProps {
  clearChat: () => void;
}

const ChatTopBar = ({ clearChat }: IProps) => {
  return (
    <div className="h-[8%] flex gap-4 items-center w-full rounded-t-xl border-b-4 justify-between px-[2%] border-chop3gray">
      <div className="flex items-center text-md">
        <p className="text-white/85 lg:text-lg font-semibold flex items-baseline gap-2 hover:text-white/95">
          <img
            src={chopgpt}
            alt="logo"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
          />
          Tax
          <span className="hidden lg:block text-chopLighttext text-xs sm:text-sm font-semibold  hover:text-white/25">
            Chop AI
          </span>
        </p>
      </div>
      <span
        className="text-white/50 lg:text-sm gap-2 flex cursor-pointer bg-chop3gray/80 hover:bg-chop3gray p-2 rounded-xl "
        onClick={clearChat}
      >
        <MessageCircleX size={20} className="hover:text-white/70" />
        <span className="hidden lg:block ">Clear chat</span>
      </span>
    </div>
  );
};

export default ChatTopBar;
