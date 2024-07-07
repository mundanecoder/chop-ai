import React, { useRef, useEffect, useState } from "react";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import logo from "/Logo.svg";
import chopgpt from "/chatimg1.svg";
import { chatMessage, IMessageObject } from "../../App";
import { Skeleton } from "../../../../../@/components/ui/skeleton";

interface IMessageArray {
  chat: chatMessage[];
  currentChatId: string | null;
  isTyping: boolean;
  handleIsTying: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBox: React.FC<IMessageArray> = ({
  chat,
  currentChatId,
  isTyping,
  handleIsTying,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [, setLastUserMessage] = useState<string | null>(null);
  const [, setIsTypewriterTyping] = useState(false); // State to track if Typewriter is typing

  const typewritingref = useRef<TypewriterClass | null>(null); // Ref to hold Typewriter instance

  const scrollChatToBottom = () => {
    if (messageContainerRef.current && shouldAutoScroll) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    handleStopTypewriter(); // Initial check on component mount
  }, [isTyping]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chat, shouldAutoScroll]);

  const handleStopTypewriter = () => {
    if (!isTyping && typewritingref.current) {
      typewritingref.current.stop();
      setIsTypewriterTyping(false);
    }
  };

  const processMessage = (message: string) => {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/### (.*?)/g, "<h3>$1</h3>")
      .replace(/\n/g, "<br>")
      .replace(/  /g, "&nbsp;&nbsp;");
  };

  const currentChatSession = chat.find(
    (session) => session.id === currentChatId
  );

  useEffect(() => {
    if (currentChatSession) {
      const lastUserMsg = currentChatSession.chat
        .slice()
        .reverse()
        .find((msg) => msg.type === "text" && msg.name === "user");

      if (lastUserMsg) {
        setLastUserMessage(lastUserMsg.message);
      }
    }
  }, [currentChatSession]);

  useEffect(() => {
    const handleScroll = () => {
      if (messageContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messageContainerRef.current;
        setShowScrollButton(scrollTop + clientHeight < scrollHeight);
      }
    };

    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Check initial scroll position on component mount
      setShowScrollButton(
        container.scrollHeight > container.clientHeight &&
          container.scrollTop < container.scrollHeight - container.clientHeight
      );
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chat]);

  const shouldDisplayOptimisticResponse = () => {
    if (!currentChatSession) return false;
    const messages = currentChatSession.chat;
    if (messages.length < 1) return false;
    const lastMessage = messages[messages.length - 1];
    const secondLastMessage =
      messages.length > 1 ? messages[messages.length - 2] : null;

    return (
      lastMessage.type === "text" &&
      lastMessage.name === "user" &&
      (!secondLastMessage ||
        secondLastMessage.type !== "text" ||
        secondLastMessage.name !== "chopai")
    );
  };

  const handleScrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="h-[76%] relative">
      <div
        className="h-full overflow-hidden overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
        ref={messageContainerRef}
      >
        {currentChatSession ? (
          <>
            {currentChatSession.chat.map(
              (message: IMessageObject, index: number) => {
                if (message.type === "text" && message.name === "chopai") {
                  return (
                    <div key={index} className="flex justify-start mb-2">
                      <div className="bg-chopbgblack p-4 rounded-xl text-white/90 max-w-[90%] flex flex-col w-[50vw] gap-2 items-start text-sm">
                        <div className="bg-chopbgblack rounded-xl gap-2 w-full flex p-2">
                          <img
                            src={logo}
                            alt="Chop Logo"
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
                          />
                          Chop
                        </div>
                        <div className="max-w-[90%] overflow-auto lg:pl-12">
                          <div>
                            <Typewriter
                              onInit={(typewriter) => {
                                typewritingref.current = typewriter;
                                typewriter
                                  .typeString(processMessage(message.message))
                                  .pauseFor(500)
                                  .callFunction(() => {
                                    setIsTypewriterTyping(true);
                                    handleIsTying(false);
                                  })
                                  .start();
                              }}
                              options={{
                                loop: false,
                                delay: 10,
                                cursor: "",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (message.type === "text" && message.name === "user") {
                  return (
                    <div key={index} className="flex justify-end mb-2">
                      <div className="bg-chopbgblack p-4 rounded-xl text-white/90 max-w-[90%] flex flex-col w-[50vw] gap-2 items-start text-sm">
                        <div className="bg-chopbgblack rounded-xl gap-4 w-full flex p-2">
                          <img
                            src={chopgpt}
                            alt="User Logo"
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
                          />
                          User
                        </div>
                        <p
                          className="max-w-[80%] whitespace-pre-wrap lg:pl-12"
                          dangerouslySetInnerHTML={{
                            __html: processMessage(message.message),
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              }
            )}
            {shouldDisplayOptimisticResponse() && (
              <div className="flex justify-start mb-2">
                <div className="bg-chopbgblack p-4 rounded-xl text-white/90 max-w-[90%] flex flex-col w-5/6 items-start text-sm">
                  <div className="bg-chopbgblack rounded-xl gap-4 w-full flex p-2">
                    <img
                      src={logo}
                      alt="Chop Logo"
                      className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
                    />
                    Chop
                  </div>
                  <div className="max-w-[80%] overflow-auto pl-12">
                    <div className="w-[30vw] p-2">
                      <Skeleton className="h-10 bg-chop3gray rounded-xl animate-pulse" />
                      <Skeleton className="h-10 bg-chop3gray rounded-xl animate-pulse mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-white/70">Start conversation with Chop</p>
          </div>
        )}
      </div>

      {showScrollButton && (
        <div
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={handleScrollToBottom}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white/60 hover:text-white animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
