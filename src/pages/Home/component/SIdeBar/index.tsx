import { chatMessage } from "../../App";
import logo from "/Logo.svg";

import { dummyQuestions } from "../ChatBox";
import { templateQuestion } from "../../../../recoil/atom";
import { useRecoilState } from "recoil";
import { companyNames } from "../DrawerComponent";

interface IMessageArray {
  chat: chatMessage[];
}

const SideBar = ({ chat }: IMessageArray) => {
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
  };

  return (
    <div className="hidden lg:w-[20%] rounded-xl lg:flex flex-col">
      <div className="h-[8%] flex justify-start pl-2 gap-4 items-center w-full rounded-t-xl">
        <img src={logo} alt="logo" className="lg:w-[10%] lg:h-[100%] h-6" />
        <span className="text-white/80 text-xl font-semibold">ChopTax</span>
      </div>

      <div className="h-[90%] bg-chopbg/2 w-full rounded-xl p-[5%]">
        <div className="h-[4%] mb-4 flex text-xs justify-center items-center w-full rounded-xl ">
          <button className="px-4 py-2 text-xs rounded-l-xl shadow-md text-white/70 bg-chop3gray/50">
            Tax Memo
          </button>
          <button className="px-4 py-2 text-xs text-white/70 rounded-r-xl bg-chop3gray">
            Chat
          </button>
        </div>
        <div className="flex flex-col gap-[10%] h-[14%]">
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
        </div>

        <div className="h-[4%] mb-4 flex text-xs justify-center items-center w-full rounded-xl bg-chop3gray/60">
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

        <div className="h-[4%] mb-4 flex text-xs justify-center items-center w-full rounded-xl bg-chop3gray/60">
          <p className="text-center text-white/70">Chats</p>
        </div>

        <div className="h-[40%] flex flex-col gap-4">
          <select
            className="w-full rounded-xl bg-chop3gray py-2 text-sm px-4 text-white/70"
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
            <div className="h-fit bottom-14 absolute flex justify-start px-2 py-2 gap-4 items-center w-[21.5%] rounded-xl bg-chop3gray/50">
              <div className="flex flex-col">
                <span className="text-white/70 text-[10px] text-wrap">
                  Hi, you are in beta version of chop ai, many features are in
                  development mode and will be available soon, we appreciate
                  your feedback Info@chopchopfinance.com.
                </span>
                <span className="text-white/70 text-xs text-wrap my-1">
                  For details visit :
                  <a
                    href="https://www.chopchopfinance.com/"
                    className="text-white/80 underline text-[14px] p-2"
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
  );
};

export default SideBar;
