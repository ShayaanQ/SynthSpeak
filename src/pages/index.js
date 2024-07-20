import { useState, useRef, useEffect } from "react";
import Head from 'next/head';
import { Inter } from 'next/font/google';
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const latestMessageRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }]);
    sendMessage(inputValue);
    setInputValue('');
  };

  const sendMessage = (message) => {
    const url = '/api/chat';
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": message }]
    };

    setIsLoading(true);

    axios.post(url, data).then((response) => {
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.choices[0].message.content }]);
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      // Scroll to bottom when chatLog updates
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  useEffect(() => {
    if (latestMessageRef.current) {
      // Scroll to the latest message
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isLoading]); // Trigger when chatLog or isLoading changes

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-500 to-red-500">
      <div className="w-full max-w-[700px] h-full flex flex-col bg-black text-white overflow-hidden m-auto mt-4 mb-4">
        <Head>
          <title>SynthSpeak</title>
          <meta name="description" content="Chat with ChatGPT" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1 className="bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
          SynthSpeak
        </h1>

        <div className="flex-grow flex flex-col p-6 overflow-auto" ref={chatContainerRef}>
          <div className="flex flex-col space-y-4">
            {chatLog.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
                ref={index === chatLog.length - 1 ? latestMessageRef : null} // Set ref to the last message
              >
                <div className={`${message.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-red-500 text-white' : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'} rounded-lg p-4 max-w-sm`}>
                  {message.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-black flex items-center space-x-2 border-none">
          <input
            type="text"
            className="flex-grow px-4 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none border-none"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-red-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 border-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
