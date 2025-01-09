"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import image from "../../public/image.png";
import image1 from "../../public/image copy.png";
import image2 from "../../public/image copy 3.png";
import image3 from "../../public/image copy 4.png";
import image4 from "../../public/image copy 5.png";
import Scrollbar from "react-scrollbars-custom";
import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import MarkdownRenderer from "./component/Markdown";
export default function Page() {
  const scrollbarRef = useRef(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [renderedMsg, setRenderedMsg] = useState<string[]>([]);
  const scrollChatToBottom = () => {
    if (scrollbarRef.current) {
      (scrollbarRef.current as any).scrollToBottom();
    }
  };
  const handleSetmsg = async (user_input: string) => {
    setMessages([...messages, user_input]);

    const res = await fetch(`http://113.56.219.163:5006/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input }),
    });
    if (!res.body) {
      console.error("Response body is null");
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
          let cachePoll =''
      let pre= ''
    while (true) {
      let tempMsgs: string[] = [];
      const { done, value } = await reader.read();
      if (done) break;

      // 解码接收到的字节流
      buffer += decoder.decode(value, { stream: true });

      // 按行分割，处理每一行
      const lines = buffer.split("\n\n\n");
      // 保留最后一个未完成的行片段
      // buffer = lines.pop() || "";
        setRenderedMsg(lines); // 流式更新
    }

    // 如果buffer中有内容，推送最后剩下的部分
    // if (buffer) {
    //   tempMsgs.push(buffer);
    //   setRenderedMsg((prevMsgs) => [...prevMsgs, buffer]);
    // }

    // 滚动到页面底部
    scrollChatToBottom();
  };

const handleRefresh =  () => {
    setMessages([]);
    setRenderedMsg([]);
}
  return (
    <div className="h-full w-full  text-white flex">
      <div className="w-20 h-screen bg-black ">
        <Image
          src={image}
          alt=""
          width={30}
          height={30}
          className="mx-auto  pt-5 pb-5 m-2"
        ></Image>
        <div className="text-center text-white bg-green-500 p-4 cursor-pointer">
          app
        </div>
      </div>
      <div className="flex-1 h-screen bg-gradient-to-br from-[#3e6d80] via-[#000] to-black flex flex-col">
        <header className="h-20 border-b border-slate-500 flex justify-between items-center p-2">
          <div className="flex items-center pl-5">
            <Image
              src={image1}
              alt=""
              width={30}
              height={30}
              className="align-middle mr-2"
            ></Image>
            <span className="text-bold">作战计划生成应用</span>
          </div>
          <div>
            <Button type="primary" className="mr-4 !bg-green-500 text-white" onClick={() => {handleRefresh()}}>
              新建会话
            </Button>
          </div>
        </header>
        <main className="flex-1 flex flex-row justify-center items-center ">
          <div className="flex-1 h-full p-3 flex flex-col">
            <Scrollbar ref={scrollbarRef}>
              <div
                className="text-center text-white  p-4 cursor-pointer"
                onClick={scrollChatToBottom}
              >
                <div className="flex items-center">
                  <Image src={image1} alt="" width={40}></Image>
                  <span className="ml-8 p-2 pr-3 pl-3 !border-white border-spacing-1 bg-[#151515] text-white-200 rounded-lg text-start">
                    您好，我是作战计划智能体，我能够为您生成仿真系统作战指令!
                    已经获取到当前态势信息，请您下达任务!
                  </span>
                </div>
                {messages.map((msg, index) => (
                  <div className="flex items-center mt-3" key={index}>
                    <Image src={image4} alt="" width={40}></Image>
                    <span className="ml-8 p-2 pr-3 pl-3 border-white-200 flex-1   text-white-200 rounded-lg text-start">
                      {msg}
                    </span>
                  </div>
                ))}
                {
                  renderedMsg.length>0?
                     <div className="flex items-start mt-3">
                <Image
                    src={image1}
                    alt=""
                    width={40}
                    className="flex-shrink-0"
                  ></Image>
                  <div className="flex flex-col">
                    {renderedMsg.map((msg, index) => (
                    // <span key={index} className="ml-8 mb-2 p-2 pr-3 !border-white border-spacing-1 border-1 bg-[#151515] text-white-200 rounded-lg text-start">
                    //   {msg}
                    // </span>
                    <MarkdownRenderer key={index} content={msg} />

                    ))}
                  </div>
                </div> :null
                  
                }
                {/* <div className="flex items-start mt-3">
                <Image
                    src={image1}
                    alt=""
                    width={40}
                    className="flex-shrink-0"
                  ></Image>
                  <div className="flex flex-col">
                    <span className="ml-8 mb-2 p-2 pr-3 !border-white border-spacing-1 border-1 bg-[#151515] text-white-200 rounded-lg text-start">
                      您好，我是作战计划智能体，我能够为您生成仿真系统作战指令!
                      已经获取到当前态势信息，请您下达任务!
                    </span>
                  </div>
                </div> */}
              </div>
            </Scrollbar>
            <div className="h-20  w-full flex items-center p-2 border-spacing-1 relative ">
              <TextArea
                className="border-none !bg-transparent w-full !text-white  !h-11 !rounded-3xl !p-2 !pl-6 !pr-10 !focus:outline-none border-s-white !overflow-y-hidden"
                placeholder={"请输入问题..."}
                autoSize={{ minRows: 1}}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onPressEnter={() => {
                  handleSetmsg(currentMessage);
                  
                  setCurrentMessage("");
                }}
              />
              <Button
                className="!p-1 !absolute !right-3 "
                type="text"
                onClick={() => {
                  handleSetmsg(currentMessage);
                 
                  setCurrentMessage("");
                }}
              >
                <Image src={image3} alt="" width={35}></Image>
              </Button>
            </div>
          </div>
          <div className="w-2/5 p-2">
            <Image
              src={image2}
              alt=""
              width={490}
              height={490}
              className=" rounded-lg object-cover"
            ></Image>
          </div>
        </main>
      </div>
    </div>
  );
}






