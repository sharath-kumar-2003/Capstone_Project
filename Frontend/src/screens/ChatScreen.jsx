import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import Loading from "./Loading";

function ChatScreen() {
  const { rideId, userType } = useParams();
  const navigation = useNavigate();
  const scrollableDivRef = useRef(null);

  const { socket } = useContext(SocketDataContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [socketID, setSocketID] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("userData"))?.data?._id || null;

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/chat-details/${rideId}`
      );

      //  Protecting unauthorised users to read the chats
      if (currentUser !== response.data.user._id && currentUser !== response.data.captain._id) {
        Console.log("You are not authorized to view this chat.");
        navigation(-1);
        return;
      }
      setMessages(response.data.messages);

      socket.emit("join-room", rideId);
      if (userType == "user") {
        setUserData(response.data.captain);
      }
      if (userType == "captain") {
        setUserData(response.data.user);
      }
      const socketIds = {
        user: response.data.user.socketId,
        captain: response.data.captain.socketId,
      };
      setSocketID(socketIds);
    } catch (error) {
      Console.log("No such ride exists.");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    socket.emit("message", { rideId: rideId, msg: message, userType: userType, time });
    setMessages((prev) => [...prev, { msg: message, by: userType, time }]);

    setMessage("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userData) {
      scrollToBottom();
    }
  }, [userData]);

  useEffect(() => {
    setTimeout(() => {

      getUserDetails();
    }, 3000);

    socket.on("receiveMessage", ({ msg, by, time }) => {
      setMessages((prev) => [...prev, { msg, by, time }]);
    });


    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  if (userData) {
    return (
      <div className="flex flex-col h-dvh bg-[#0A0A0A] text-white animate-fadeIn">
        {/* header */}
        <div className="flex h-fit items-center p-4 bg-[#111111] border-b border-[#2A2A2A] gap-3">
          <ArrowLeft
            strokeWidth={2}
            className="cursor-pointer text-[#8A8A8A] hover:text-white transition-colors duration-200"
            onClick={() => navigation(-1)}
          />
          <div className="select-none rounded-full w-9 h-9 bg-[#252525] border border-[#2A2A2A] flex items-center justify-center">
            <h1 className="text-sm font-semibold text-white">
              {userData?.fullname?.firstname[0]}
              {userData?.fullname?.lastname[0]}
            </h1>
          </div>

          <div>
            <h1 className="text-base font-semibold text-white leading-tight">
              {userData?.fullname?.firstname} {userData?.fullname?.lastname}
            </h1>
          </div>
        </div>
        
        {/* Messages Body */}
        <div className="overflow-y-auto flex-1 bg-[#0A0A0A] p-4" ref={scrollableDivRef}>
          <div className="flex flex-col justify-end w-full gap-2">
            {messages.length > 0 &&
              messages.map((message, i) => {
                const isMe = message.by == userType;
                return (
                  <span
                    key={i}
                    className={`${isMe
                      ? "ml-auto rounded-br-none bg-white text-[#0A0A0A]"
                      : "mr-auto rounded-bl-none bg-[#171717] border border-[#2A2A2A] text-white"
                      } rounded-2xl px-4 pt-2.5 pb-2.5 text-sm max-w-64 leading-normal animate-scaleIn`}
                  >
                    <div className="break-words">{message.msg}</div>
                    <div className={`text-[9px] font-normal text-right mt-1.5 opacity-60 ${isMe ? "text-[#303030]" : "text-[#8A8A8A]"}`}>
                      {message.time}
                    </div>
                  </span>
                );
              })}
          </div>
        </div>

        {/* Message Input form */}
        <form
          className="flex items-center p-4 h-fit gap-2 border-t border-[#2A2A2A] bg-[#111111]"
          onSubmit={sendMessage}
        >
          <input
            placeholder="Enter message..."
            className="w-full bg-[#171717] border border-[#2A2A2A] text-white placeholder:text-[#5E5E5E] outline-none rounded-xl px-4 py-3 text-sm focus:border-white transition-colors duration-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
          <button className="cursor-pointer px-4 bg-white hover:bg-[#E5E5E5] text-[#0A0A0A] h-full aspect-square rounded-xl flex items-center justify-center transition-colors duration-200">
            <Send size={16} />
          </button>
        </form>
      </div>
    )
  } else {
    return <Loading />;
  }
}

export default ChatScreen;
