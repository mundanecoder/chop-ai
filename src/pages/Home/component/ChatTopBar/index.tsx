import { MessageCircleX } from "lucide-react";

interface IProps {
  clearChat: () => void;
}

const ChatTopBar = ({ clearChat }: IProps) => {
  return (
    <div className="h-[8%] flex gap-4 items-center w-full rounded-t-xl border-b-2 justify-between px-[2%] border-chop3gray">
      <div className="flex items-center text-md">
        <p className="text-white/80 lg:text-lg font-semibold flex items-baseline  ">
          Chop
          <span className="hidden lg:block text-md sm:text-md font-semibold ">
            Tax
          </span>
        </p>
      </div>
      {/* <span
        className="text-white/50 lg:text-sm gap-2 flex cursor-pointer bg-chop3gray/80 hover:bg-chop3gray p-2 rounded-xl "
        onClick={clearChat}
      >
        <MessageCircleX size={20} className="hover:text-white/70" />
        <span className="hidden lg:block ">Clear chat</span>
      </span> */}
    </div>
  );
};

export default ChatTopBar;
