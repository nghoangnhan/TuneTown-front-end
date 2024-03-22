import PropTypes from "prop-types";

const MessageSection = ({ chatContent }) => {
  console.log("Chat Content:", chatContent);
  return (
    <div className="flex flex-col min-h-screen h-screen overflow-auto xl:w-full bg-orange-300 py-20">
      {chatContent.map((chat, index) => (
        <div
          key={index}
          className={`${
            chat.own == true ? "items-end" : "items-start"
          } flex flex-col m-2 gap-2`}
        >
          <div>
            <div className="flex flex-row items-end">
              <div className="w-10">
                <img
                  src={
                    chat.avatar
                      ? chat.avatar
                      : "https://via.placeholder.com/150"
                  }
                  alt="user"
                  className="rounded-full"
                />
              </div>
              <div className="w-fit mx-2">
                <h3 className="text-gray-500">
                  {chat.name ? chat.name : "Unknown"}
                </h3>
                <p className="text-base border rounded-md bg-slate-200 p-1">
                  {chat.message}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">{chat.time}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

MessageSection.propTypes = {
  chatContent: PropTypes.array,
};

export default MessageSection;
