import { CircleX } from "lucide-react";
import React from "react";
import { chatMessage } from "../../App";
import logo from "/Logo.svg";
import { dummyQuestions } from "../ChatBox";
import { templateQuestion } from "../../../../recoil/atom";
import { useRecoilState } from "recoil";

interface IDrawerProps {
  open: boolean;
  handleDrawer: () => void;
  chat: chatMessage[];
}

export const companyNames = [
  { id: 1, name: "Innovative Solutions Pvt. Ltd." },
  { id: 2, name: "TechSavvy Enterprises Pvt. Ltd." },
  { id: 3, name: "Green Future Ventures Pvt. Ltd." },
  { id: 4, name: "UrbanNest Builders Pvt. Ltd." },
  { id: 5, name: "BlueSky Logistics Pvt. Ltd." },
];

const DrawerComponent: React.FC<IDrawerProps> = ({
  open,
  handleDrawer,
  chat,
}) => {
  const [question, setQuestion] = useRecoilState(templateQuestion);

  const filteredChat = chat.filter((session) => {
    if (session.chat.length > 0) {
      const message = session.chat[0].message;
      return !dummyQuestions.some((question) =>
        message.includes(question.question)
      );
    }
    return false;
  });

  const handleExampleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestion(event.target.value);
  };

  const handleChatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    filteredChat.find((session) => session.id === event.target.value);
    // Do something with the selected chat (e.g., displaying it in the chat window)
  };

  return (
    <div className="absolute block lg:hidden top-0 left-0 h-full w-full text-white z-50">
      {open ? null : (
        <div className="block text-white bg-chopbgblack h-[93.5vh] mt-3 w-[80vw] z-50 relative">
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
                <div className="h-[4%] mb-4 flex text-xs justify-center items-center w-full rounded-xl ">
                  <button className="px-4 py-2 text-xs rounded-l-xl shadow-md text-white/70 bg-chop3gray/50">
                    Tax Memo
                  </button>
                  <button className="px-4 py-2 text-xs text-white/70 rounded-r-xl bg-chop3gray">
                    Chat
                  </button>
                </div>
                <div className="flex flex-col gap-[10%] h-[14%] mb-2">
                  <select
                    className="w-full rounded-xl bg-chop3gray py-2 text-sm px-4 text-white/70"
                    // onChange={handleExampleChange}
                    value={question} // Ensure the selected value matches the current question
                  >
                    {question === "" && (
                      <option value="" disabled>
                        Select Clients
                      </option>
                    )}
                    {companyNames.map((client) => (
                      <option key={client.id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {/* <div className="h-[6vh] flex justify-start pl-4 gap-2 items-center w-full rounded-xl bg-chop3gray">
                    <Search size={20} className="text-white/70" />
                    <input
                      type="text"
                      className="outline-none h-full w-full bg-transparent text-sm text-white/90 rounded-xl"
                      placeholder="Search"
                    />
                  </div> */}
                </div>

                <div className="h-[4%] py-4 mb-4 flex text-sm justify-center items-center w-full rounded-xl bg-chop3gray/60">
                  <p className="text-center text-white/70">Try Examples</p>
                </div>
                <div className="h-fit flex flex-col gap-4 mb-4">
                  <select
                    className="w-full rounded-xl bg-chop3gray py-2 text-sm px-4 text-white/70"
                    onChange={handleExampleChange}
                    value={question} // Ensure the selected value matches the current question
                  >
                    {question === "" && (
                      <option value="" disabled>
                        Select question
                      </option>
                    )}
                    {dummyQuestions.map((question) => (
                      <option key={question.id} value={question.question}>
                        {question.question}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="h-[4%] py-4  mb-4 flex text-sm justify-center items-center w-full rounded-xl bg-chop3gray/60">
                  <p className="text-center text-white/70">Chat Hisory</p>
                </div>

                <div className="h-[40%] flex flex-col gap-4">
                  <select
                    className="w-full rounded-xl bg-chop3gray/80 py-2 px-4 text-white/70"
                    onChange={handleChatChange}
                  >
                    {filteredChat.length > 0 ? (
                      filteredChat.map((session) => (
                        <option
                          className="bg-chopbgblack"
                          key={session.id}
                          value={session.id}
                        >
                          {session.chat[0].message.slice(0, 50)}
                        </option>
                      ))
                    ) : (
                      <option className="bg-chopbgblack" value="">
                        No chat history
                      </option>
                    )}
                  </select>

                  <div>
                    <div className="h-fit bottom-10 absolute flex justify-start px-4 py-4 gap-4 items-center w-[82.5%] rounded-xl bg-chop3gray/50">
                      <div className="flex flex-col">
                        <span className="text-white/70 text-xs text-wrap">
                          Hi, you are in beta version of Chop AI, many features
                          are in development mode and will be available soon, we
                          appreciate your feedback Info@chopchopfinance.com
                        </span>
                        <span className="text-white/70 text-xs text-wrap my-1">
                          For details visit:
                          <a
                            href="https://www.chopchopfinance.com/"
                            className="text-white/80 underline text-sm p-2"
                            target="_blank"
                            rel="noreferrer"
                          >
                            chopchopfinance
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
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
