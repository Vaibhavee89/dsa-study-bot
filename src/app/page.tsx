"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface GroqMessage {
  role: "user" | "assistant";
  content: string;
}

interface GroqResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

export default function Page() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your DSA Study Bot. Share a LeetCode problem link and your specific question, and I'll help you understand the approach without giving away the solution.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isConversationStarted) {
      inputRef.current?.focus();
    } else {
      textareaRef.current?.focus();
    }
  }, [isConversationStarted]);

  const callGroqAPI = async (userMessages: GroqMessage[]) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

      const systemMessage = {
        role: "system",
        content:
          "You are a DSA (Data Structures and Algorithms) Study Bot. Your goal is to help students understand algorithms and data structures concepts without giving away complete solutions to problems. When given a LeetCode problem, provide hints, explain key concepts, suggest approaches, and ask guiding questions, but avoid providing full implementations. Focus on teaching the underlying principles and helping students develop their problem-solving skills.",
      };

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [systemMessage, ...userMessages],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to get response from Groq API",
        );
      }

      const data: GroqResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling Groq API:", error);
      return "I encountered an error while processing your request. Please check your API key or try again later.";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    if (!isConversationStarted) {
      setIsAnimating(true);
      setIsConversationStarted(true);

      setTimeout(() => {
        setIsAnimating(false);
        submitMessage();
      }, 600);
    } else {
      submitMessage();
    }
  };

  const submitMessage = async () => {
    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    const groqMessages: GroqMessage[] = messages
      .filter((msg) => msg.id !== 1)
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    groqMessages.push({
      role: "user",
      content: newUserMessage.content,
    });

    try {
      const aiResponse = await callGroqAPI(groqMessages);

      const newAssistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("Error handling submission:", error);

      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please check your API key or try again later.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-screen transition-all duration-600 ease-in-out ${
        isAnimating ? "animate-container-shift" : ""
      }`}
    >
      <style jsx global>{`
        @keyframes container-shift {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-10vh);
          }
        }

        @keyframes welcome-fade-out {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @keyframes input-to-bottom {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(calc(70vh));
          }
        }

        @keyframes content-fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-container-shift {
          animation: container-shift 600ms forwards ease-in-out;
        }

        .animate-welcome-fade-out {
          animation: welcome-fade-out 400ms forwards ease-in-out;
        }

        .animate-input-to-bottom {
          animation: input-to-bottom 600ms forwards ease-in-out;
        }

        .animate-content-fade-in {
          animation: content-fade-in 400ms 200ms forwards ease-in-out;
        }
      `}</style>

      <ScrollArea className="flex-1 w-full pt-20">
        <div className="min-h-screen p-4 w-full flex md:items-center md:justify-center bg-white antialiased relative overflow-hidden">
          <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
            <h1 className="text-3xl md:text-5xl lg:text-7xl mb-2 font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-600 bg-opacity-50">
              DSA Study Bot
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto text-center text-muted-foreground mb-12">
              Get help understanding algorithms{" "}
              <span className="underline">without</span> spoiling solutions
            </h2>
            {!isConversationStarted ? (
              <div
                className={`flex flex-col flex-1 items-center justify-center p-4 ${
                  isAnimating ? "animate-welcome-fade-out" : ""
                }`}
              >
                <div
                  className={`w-full max-w-2xl ${
                    isAnimating ? "animate-input-to-bottom" : ""
                  }`}
                >
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLTextAreaElement>,
                        ) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const form = e.currentTarget.form;
                            if (form) form.requestSubmit();
                          }
                        }}
                        placeholder="How can study bot help you today on your DSA journey?"
                        className="flex-1 p-4 h-36 text-base shadow-md pr-12"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        size="icon"
                        className="absolute right-2 bottom-2 h-8 w-8 shadow-md"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div
                className={`flex flex-col flex-1 ${
                  isAnimating
                    ? "opacity-0"
                    : "animate-content-fade-in opacity-0"
                }`}
              >
                <div className="max-w-3xl mx-auto space-y-4 pb-20">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <Card
                        className={`max-w-[80%] border-none shadow-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card"
                        }`}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="whitespace-pre-wrap text-sm sm:text-base">
                                  {children}
                                </p>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </CardContent>
                      </Card>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                            <div
                              className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm pb-4 pt-2">
                  <Card className="mx-auto p-2 border-none max-w-3xl shadow-xl">
                    <CardContent className="p-2">
                      <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            className="flex-1 text-sm sm:text-base"
                            disabled={isLoading}
                          />
                          <Button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            size="icon"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
