import React, { useEffect, useState } from "react";
import { Ban, Send } from "lucide-react";
import ChatBox from "./component/ChatBox";
import ChatTopBar from "./component/ChatTopBar";
import SideBar from "./component/SIdeBar";
import SmallScreenTopBar from "./component/TopBarSmallScreen";
import { chopGPT } from "../../api/chopgpt";
import { useToast } from "../../../@/components/ui/use-toast";
import { dummyQuestions } from "./component/ChatBox";

type chatUse = "chopai" | "user";

export interface IMessageObject {
  id: string;
  name: chatUse;
  type: "text" | "image";
  message: string;
  time?: string;
}

export interface chatMessage {
  id: string;
  chat: IMessageObject[];
}

export function App() {
  const [open, setOpen] = useState(true);
  const [istyping, setIstyping] = useState(false); // Initial state for typing status
  const [chats, setChats] = useState<chatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const { toast } = useToast(); // Initialize useToast hook

  useEffect(() => {
    if (answer) {
      const newMessage: IMessageObject = {
        id: Date.now().toString(),
        name: "chopai",
        type: "text",
        message: answer || "typing",
        time: new Date().toLocaleDateString("de-DE"),
      };
      saveMessage(newMessage);
      setAnswer("");
    }
  }, [answer]);

  async function getChopGPT(query: string) {
    const response = await chopGPT(query);
    setAnswer(response ? response.result : "typing");
  }

  function handleSubmitForm(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    e.preventDefault();

    if (input.trim() !== "") {
      const newMessage: IMessageObject = {
        id: Date.now().toString(),
        name: "user",
        type: "text",
        message: input,
        time: new Date().toLocaleDateString("de-DE"),
      };
      saveMessage(newMessage);
      getChopGPT(input);
      setIstyping(true); // Set typing state to true when user sends a message
      setInput("");
    }
  }

  function saveMessage(data: IMessageObject) {
    setChats((prevChats) => {
      const updatedChats = [...prevChats];
      if (
        !currentChatId ||
        updatedChats.length === 0 ||
        updatedChats[updatedChats.length - 1].chat.length === 0
      ) {
        const newChatId = String(updatedChats.length + 1);
        setCurrentChatId(newChatId);
        updatedChats.push({
          id: newChatId,
          chat: [data],
        });
      } else {
        const currentChat = updatedChats.find(
          (chat) => chat.id === currentChatId
        );
        if (currentChat) {
          currentChat.chat.push(data);
        }
      }
      return updatedChats;
    });
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Set typing state to true when input changes
    setInput(e.target.value);

    setTimeout(() => {
      // setIstyping(false); // Set typing state to false after 1 second delay
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitForm(e);
    }

    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      setInput((prevInput) => prevInput + "\n");
    }
  };

  // Function to clear chat messages
  const clearChat = () => {
    if (currentChatId) {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat.id === currentChatId ? { ...chat, chat: [] } : chat
        );
        setIstyping(false);
        return updatedChats;
      });
    }
  };

  // Function to handle stop generating button click
  const handleStopGenerating = () => {
    setIstyping(false); // Set typing state to false when stop generating is clicked
  };

  return (
    <>
      <div className="w-[96vw] h-[100vh] flex flex-col lg:flex lg:flex-row lg:gap-[3%] justify-center relative md:h-[100vh] lg:h-[97vh] p-[10px] lg:p-[20px] bg-transparent">
        <SideBar chat={chats} />
        <SmallScreenTopBar open={open} setOpen={setOpen} chat={chats} />
        <div
          className="w-[100%] h-[90%] lg:h-[98%] lg:block lg:w-[75%] mt-10 lg:mt-0 bg-chopbg/2 rounded-xl"
          onClick={() => setOpen(true)}
        >
          <ChatTopBar clearChat={clearChat} />
          <div className="h-[90%] bg-chopbg/2 w-full rounded-xl p-[3%] flex flex-col justify-between">
            <ChatBox
              chat={chats}
              currentChatId={currentChatId}
              isTyping={istyping} // Pass istyping state to ChatBox component
              handleIsTying={setIstyping} // Pass setIstyping function to ChatBox component
            />
            {/* <div
              className="h-[5%] self-center px-2 bg-chop3gray rounded-xl flex justify-center gap-2 items-center hover:bg-chop3gray"
              onClick={handleStopGenerating} // Handle stop generating button click
            >
              <Ban size={20} className="text-white/50 text-sm p-1" />
              <span className="shadow-md text-[10px] text-sm p-1 text-white/30 hover:text-white/50">
                Stop generating
              </span>
            </div> */}
            <div className="h-[10%] flex justify-center items-start relative">
              {/* <form
                onSubmit={handleSubmitForm}
                className={`flex h-[80%] hover:border-2 ${
                  istyping ? "border-4" : ""
                } active:border-2 border-chop3gray rounded-xl w-[90%] lg:w-[80%] items-center justify-center bg-chopbgblack/70 hover:bg-chopbgblack`}
              >
                <textarea
                  className="w-[80%] bg-transparent text-[10px] lg:text-sm h-[70%] resize-none outline-none text-white/95 text-sm p-2 rounded-xl whitespace-pre-wrap mb-4 sm:mb-0"
                  placeholder="Let the magic happen, Ask a question"
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scrollbarWidth: "none",
                    overflowY: "hidden",
                    overflowX: "hidden",
                    lineHeight: "1.5",
                    paddingTop: "calc((70% - 1.5em) / 2)",
                  }}
                />
                <button
                  type={istyping ? "button" : "submit"}
                  className="bg-chop3gray/50 hover:bg-chop3gray lg:p-2 rounded-xl"
                  onClick={() =>
                    istyping
                      ? toast({
                          className: "bg-red-800/40 rounded-xlw-full  h-fit",
                          variant: "destructive",
                          title: "chop is engaged",
                          description:
                            "use stop generating button and try again",
                        })
                      : null
                  }
                >
                  <Send
                    size={16}
                    className="text-white/80 hover:text-white text-sm"
                  />
                </button>
                <button
                  type={istyping ? "button" : "submit"}
                  className="bg-chop3gray/50 hover:bg-chop3gray lg:p-2 rounded-xl ml-2"
                  onClick={handleStopGenerating} // Handle stop generating button click
                >
                  <Ban
                    size={20}
                    className="text-white/50 text-sm hover:text-white/95"
                  />
                </button>
              </form> */}
              <form
                onSubmit={handleSubmitForm}
                className={`flex h-[80%] border-2 hover:border-4 ${
                  istyping ? "border-4" : ""
                } active:border-2 border-chop3gray rounded-xl w-[90%] lg:w-[80%] items-center justify-center bg-chopbgblack/70 hover:bg-chopbgblack`}
              >
                <div className="flex w-[80%] h-[70%] items-center justify-center relative">
                  <textarea
                    className="w-full bg-transparent text-[10px] lg:text-sm h-full resize-none outline-none text-white/95 text-sm p-2 rounded-xl whitespace-pre-wrap mb-4 sm:mb-0 shadow-lg"
                    placeholder="Let the magic happen, Ask a question"
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scrollbarWidth: "none",
                      overflowY: "hidden",
                      overflowX: "hidden",
                      lineHeight: "1.5",
                    }}
                  />
                </div>
                <button
                  type={istyping ? "button" : "submit"}
                  className="bg-chop3gray/50 hover:bg-chop3gray lg:p-2 rounded-xl"
                  onClick={() =>
                    istyping
                      ? toast({
                          className: "bg-red-800/40 rounded-xl w-full h-fit",
                          variant: "destructive",
                          title: "chop is engaged",
                          description:
                            "use stop generating button and try again",
                        })
                      : null
                  }
                >
                  <Send
                    size={16}
                    className="text-white/80 hover:text-white text-sm"
                  />
                </button>
                <button
                  type={istyping ? "button" : "submit"}
                  className="bg-chop3gray/50 hover:bg-chop3gray lg:p-2 rounded-xl ml-2"
                  onClick={handleStopGenerating} // Handle stop generating button click
                >
                  <Ban
                    size={20}
                    className="text-white/50 text-sm hover:text-white/95"
                  />
                </button>
              </form>
              {/* <button className="absolute right-[3%] bottom-2 lg:bottom-8 lg:right-2 bg-chop3gray/70 hover:bg-chop3gray/90 text-white/50 hover:text-white p-2 rounded-full">
                <Plus size={18} />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
