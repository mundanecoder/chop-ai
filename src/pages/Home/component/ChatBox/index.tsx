import { User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import { Skeleton } from "../../../../../@/components/ui/skeleton";
import { templateQuestion } from "../../../../recoil/atom";
import { chatMessage, IMessageObject } from "../../App";
import logo from "/Logo.svg";

interface IMessageArray {
  chat: chatMessage[];
  currentChatId: string | null;
  isTyping: boolean;
  handleIsTying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const dummyQuestions = [
  {
    id: "1",
    question:
      "Do I need to file an income tax return if my income is below the taxable limit?",
  },
  {
    id: "2",
    question: "Is health insurance a tax deductible expense?",
  },
  {
    id: "3",
    question:
      "My daughter was born yesterday. Am I eligible for any tax deductions? ",
  },
  {
    id: "4",
    question: "My 12 year son made INR 1 lacs, how is liable to pay tax?",
  },
];

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
  const [, setIsTypewriterTyping] = useState(false);
  const [, setQuestion] = useRecoilState(templateQuestion);

  const typewritingref = useRef<TypewriterClass | null>(null);

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
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/### (.*?)/g, "<h3>$1</h3>") // Headings
      .replace(/## (.*?)/g, "<h2>$1</h2>") // Headings level 2
      .replace(/# (.*?)/g, "<h1>$1</h1>") // Headings level 1
      .replace(/\n/g, "<br>") // Newlines
      .replace(/  /g, "&nbsp;&nbsp;") // Double spaces for indents
      .replace(/`([^`]*)`/g, "<code>$1</code>") // Inline code
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // Links
      .replace(/\\\[([^\\\[]*?)\\\]/g, "<math>$1</math>"); // Math expressions
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

    // Find the last message index sent by the user
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === "text" && messages[i].name === "user") {
        lastUserMessageIndex = i;
        break;
      }
    }

    // If no user message found, return false
    if (lastUserMessageIndex === -1) return false;

    // Check if the last user message is not immediately followed by a chopai message
    if (
      lastUserMessageIndex < messages.length - 1 &&
      messages[lastUserMessageIndex + 1].type !== "text" &&
      messages[lastUserMessageIndex + 1].name !== "chopai"
    ) {
      return true; // Display optimistic response
    }

    // Also display optimistic response if the last user message is the last in the chat
    if (lastUserMessageIndex === messages.length - 1) {
      return true;
    }

    return false;
  };

  const handleScrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  return (
    <div
      className="h-[76%] relative"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div
        className="h-[64vh] overflow-hidden overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
        ref={messageContainerRef}
      >
        {currentChatSession ? (
          <>
            {currentChatSession.chat.map(
              (message: IMessageObject, index: number) => {
                if (message.type === "text" && message.name === "chopai") {
                  return (
                    <div key={index} className="flex justify-center mb-3">
                      <div className="bg-chopbgblack p-4 rounded-xl text-white/90 max-w-[90%]  flex w-[90vw] lg:w-[60vw] items-start text-sm">
                        <div className="bg-chopbgblack rounded-xl gap-2 w-fit flex p-2 ">
                          <img
                            src={logo}
                            alt="Chop Logo"
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
                          />
                        </div>
                        <div className="max-w-[90%] overflow-auto pt-2 ">
                          <div className="">
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
                    <div key={index} className="flex justify-center mb-3">
                      <div className="bg-chopbgblack p-4 rounded-xl text-white/90 max-w-[90%]  flex w-[90vw] lg:w-[60vw] items-start text-sm">
                        <div className="bg-chopbgblack rounded-xl gap-4 w-fit flex p-2">
                          {/* <img
                            src={chopgpt}
                            alt="User Logo"
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
                          /> */}
                          <User size={20} className="text-white" />
                        </div>
                        <p
                          className="max-w-[80%] whitespace-pre-wrap  pt-2 "
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
            {!shouldDisplayOptimisticResponse() && (
              <div className="flex justify-center mb-2 ">
                <div className="bg-chopbgblack p-4 rounded-xl text-white/90 max-w-[90%] flex  w-[80vw] items-start text-sm">
                  <div className="bg-chopbgblack rounded-xl gap-4 w-fit flex p-2">
                    <img
                      src={logo}
                      alt="Chop Logo"
                      className="w-6 h-6 lg:w-8 lg:h-8 rounded-t-xl"
                    />
                  </div>
                  <div className="max-w-[80%] overflow-auto pl-2  overflow-x-hidden">
                    <div className="w-[40vw] lg:w-[60vw] p-2 overflow-x-hidden">
                      <Skeleton className=" h-2 lg:h-4 w-3/4 bg-chop3gray rounded-xl animate-pulse" />
                      <Skeleton className="  h-2 lg:h-4  w-2/4 bg-chop3gray rounded-xl animate-pulse mt-1" />
                      <Skeleton className=" h-2 lg:h-4  w-4/6 bg-chop3gray rounded-xl animate-pulse mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-start items-center h-full">
            <p className="text-white/70 mb-4 text-xl font-bold">Examples</p>

            <div className="grid grid-cols-2 gap-4 max-h-[30vh]  text-xs w-full lg:w-fit h-fit lg:h-[16vh] ">
              {dummyQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="py-4 lg:py-2 px-4 bg-chop3gray/80 hover:bg-chop3gray w-[40vw] lg:w-[20vw] rounded-xl flex items-center text-white/80 text-xs lg:text-sm max-h-[14vh] h-full "
                >
                  <p className=" " onClick={() => setQuestion(item.question)}>
                    <span className="font-bold ">Question :</span>{" "}
                    {item.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showScrollButton && (
        <div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer"
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
