"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { StudySidebar } from "@/components/sidebar";
import { UserMenu } from "@/components/auth";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

  const callChatAPI = async (userMessages: ChatMessage[]) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: userMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      return data.content;
    } catch (error) {
      console.error("Error calling chat API:", error);
      return "I encountered an error while processing your request. Please try again later.";
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

    const chatMessages: ChatMessage[] = messages
      .filter((msg) => msg.id !== 1)
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    chatMessages.push({
      role: "user",
      content: newUserMessage.content,
    });

    try {
      const aiResponse = await callChatAPI(chatMessages);

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

  const handleRefresh = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "Hello! I'm your DSA Study Bot. Share a LeetCode problem link and your specific question, and I'll help you understand the approach without giving away the solution.",
      },
    ]);
    setInputValue("");
    setIsConversationStarted(false);
    setIsAnimating(false);
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

      <ScrollArea
        className={`flex-1 w-full ${isConversationStarted ? "pt-20" : ""}`}
      >
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <UserMenu />
          <ThemeToggle />
        </div>
        <StudySidebar onSelectProblem={(problem) => setInputValue(problem)} />
        <div className="min-h-screen p-4 w-full flex md:items-center md:justify-center bg-background antialiased relative overflow-hidden">
          <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
            <h1 className="text-3xl md:text-5xl lg:text-7xl mb-2 font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-600 bg-opacity-50">
              DSA Study Bot
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto text-center text-muted-foreground">
              Get help understanding algorithms{" "}
              <span className="underline">without</span> spoiling solutions
            </h2>
            {!isConversationStarted ? (
              <div
                className={`flex flex-col flex-1 items-center justify-center p-4 ${
                  isAnimating ? "animate-welcome-fade-out" : ""
                }`}
              >
                <div className="w-full max-w-2xl mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setInputValue(
                          "I'm stuck on LeetCode #121 (Best Time to Buy and Sell Stock). Can you help me understand what patterns I should look for?",
                        )
                      }
                    >
                      <CardContent className="p-0">
                        <h3 className="font-medium mb-2">
                          Problem Understanding
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          &ldquo;I&apos;m stuck on LeetCode #121 (Best Time to
                          Buy and Sell Stock). Can you help me understand what
                          patterns I should look for?&rdquo;
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setInputValue(
                          "Can you explain how the sliding window technique works? I'm trying to solve LeetCode #3.",
                        )
                      }
                    >
                      <CardContent className="p-0">
                        <h3 className="font-medium mb-2">
                          Concept Clarification
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          &ldquo;Can you explain how the sliding window
                          technique works? I&apos;m trying to solve LeetCode
                          #3.&rdquo;
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setInputValue(
                          "For LeetCode #200 (Number of Islands), I'm thinking of using DFS. Is this a good approach?",
                        )
                      }
                    >
                      <CardContent className="p-0">
                        <h3 className="font-medium mb-2">
                          Approach Validation
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          &ldquo;For LeetCode #200 (Number of Islands), I&apos;m
                          thinking of using DFS. Is this a good approach?&rdquo;
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setInputValue(
                          "What's the time complexity of using a HashMap for LeetCode #1 (Two Sum)? Can it be improved?",
                        )
                      }
                    >
                      <CardContent className="p-0">
                        <h3 className="font-medium mb-2">
                          Time Complexity Help
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          &ldquo;What&apos;s the time complexity of using a
                          HashMap for LeetCode #1 (Two Sum)? Can it be
                          improved?&rdquo;
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
                        className="flex-1 p-4 h-36 text-base shadow-lg pr-12 border-black/[0.3]"
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
                                <p className="mb-4">{children}</p>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-6 mb-4 space-y-1">
                                  {children}
                                </ol>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-4 ml-4">
                                  {children}
                                </ul>
                              ),
                              code: ({ className, children }) => {
                                const match = /language-(\w+)/.exec(
                                  className || "",
                                );
                                const isCodeBlock = Boolean(match);

                                return isCodeBlock ? (
                                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                                    <code
                                      className={`${match ? `language-${match[1]}` : ""} text-sm font-mono`}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </code>
                                  </pre>
                                ) : (
                                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                );
                              },
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
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isLoading}
                          >
                            <RefreshCw className="h-4 w-4" />
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
