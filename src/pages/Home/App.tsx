import { Ban, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { chopGPT } from "../../api/chopgpt";
import ChatBox from "./component/ChatBox";
import ChatTopBar from "./component/ChatTopBar";
import SideBar from "./component/SIdeBar";
import SmallScreenTopBar from "./component/TopBarSmallScreen";
import { templateQuestion } from "../../recoil/atom";
import { useRecoilState, useRecoilValue } from "recoil";

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
  const [istyping, setIstyping] = useState(false);
  const [chats, setChats] = useState<chatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const selectedQuestion = useRecoilValue(templateQuestion);
  const [, setQuestion] = useRecoilState(templateQuestion);

  const [showToast, setToast] = useState(false);

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

  useEffect(() => {
    if (selectedQuestion) {
      CallTemplateQuestion();
    }
  }, [selectedQuestion]);

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

  function CallTemplateQuestion() {
    if (selectedQuestion) {
      const newMessage: IMessageObject = {
        id: Date.now().toString(),
        name: "user",
        type: "text",
        message: selectedQuestion,
        time: new Date().toLocaleDateString("de-DE"),
      };
      saveMessage(newMessage);
      getChopGPT(selectedQuestion);
      setIstyping(true); // Set typing state to true when user sends a message
      setInput("");
      setQuestion("");
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

  function hanldeShowtoast() {
    console.log("hit");

    if (istyping) {
      setToast(true);
      setTimeout(() => setToast(false), 5000);
    }
  }

  const handleStopGenerating = () => {
    setIstyping(false);

    // setTimeout(() => , 300);
  };

  return (
    <>
      <div className="w-[96vw] h-[100vh] flex flex-col lg:flex lg:flex-row lg:gap-[3%] justify-center relative md:h-[100vh] lg:h-[97vh] p-[10px] lg:p-[20px] bg-transparent">
        <SideBar chat={chats} />
        <SmallScreenTopBar open={open} setOpen={setOpen} chat={chats} />
        {showToast && istyping && (
          <div className="h-fit p-4 max-h-[4vh] bg-red-800/20 shadow-lg absolute  flex flex-col justify-center text-white/70 text-sm top-[0%] right-10 rounded-xl">
            <p>chop is engaged</p>

            <p>press stop generating and try again</p>
          </div>
        )}
        {/* <div className="h-4vh p-2 max-h-[4vh] bg-red-800/30 shadow-lg absolute  text-white/70 text-sm top-[0%] right-10 rounded-xl">
          <p>"chop is not engaged, you can ask a question</p>
        </div> */}

        <div
          className="w-[100%] h-[90%] lg:h-[98%] lg:block lg:w-[75%] mt-10 lg:mt-0 bg-chopbg/2 rounded-xl "
          onClick={() => setOpen(true)}
        >
          <ChatTopBar />
          <div className="h-[90%] bg-chopbg/2 w-full rounded-xl p-[3%] flex flex-col justify-between">
            <ChatBox
              chat={chats}
              currentChatId={currentChatId}
              isTyping={istyping} // Pass istyping state to ChatBox component
              handleIsTying={setIstyping} // Pass setIstyping function to ChatBox component
            />
            <div className="h-[10%] flex justify-center items-start relative ">
              <form
                onSubmit={handleSubmitForm}
                className={`flex h-[80%] border-2 hover:border-4 ${
                  istyping ? "border-4" : ""
                } active:border-2 border-chop3gray rounded-xl w-[90%] py-6 lg:w-[80%] items-center justify-center bg-chopbgblack/70 hover:bg-chopbgblack`}
              >
                <div className="flex w-[80%] h-[70%] items-center justify-center relative">
                  <textarea
                    className="w-full min-h-8 bg-transparent text-[10px] lg:text-sm h-full resize-none outline-none text-white/95 text-sm p-2 rounded-xl whitespace-pre-wrap mb-4 sm:mb-0 shadow-lg"
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
                  onClick={() => {
                    hanldeShowtoast();
                  }}
                >
                  <Send
                    size={16}
                    className="text-white/80 hover:text-white text-sm"
                  />
                </button>
                <button
                  className="bg-chop3gray/50 hover:bg-chop3gray lg:p-2 rounded-xl ml-2"
                  onClick={() => {
                    handleStopGenerating();
                  }}
                >
                  <Ban
                    size={20}
                    className="text-white/50 text-sm hover:text-white/95"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
