"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DSATeachingAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your DSA Teaching Assistant. Share a LeetCode problem link and your specific question, and I'll help you understand the approach without giving away the solution.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const hasLeetCodeLink = inputValue
        .toLowerCase()
        .includes("leetcode.com/problems");

      let responseContent;
      if (hasLeetCodeLink) {
        responseContent =
          "I see you've shared a LeetCode problem. What specific part are you struggling with? Would you like help understanding the problem, developing an algorithm, or optimizing your approach?";
      } else if (inputValue.toLowerCase().includes("time complexity")) {
        responseContent =
          "Time complexity is an important consideration. Let's analyze the operations in this algorithm step by step to determine its efficiency...";
      } else {
        responseContent =
          "I'm here to help you understand DSA concepts. Could you share a LeetCode problem link so I can provide more specific guidance?";
      }

      const newAssistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: responseContent,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const formatMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-muted/40 items-center justify-center">
      <div className="bg-primary p-4 text-primary-foreground w-full">
        <h1 className="text-xl font-bold">DSA Teaching Assistant</h1>
        <p className="text-sm opacity-90">
          Get help understanding algorithms without spoilers
        </p>
      </div>

      <ScrollArea className="flex-1 p-4 max-w-7xl">
        <div className="space-y-4 pb-4">
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
                <CardContent className="p-3">
                  <p className="whitespace-pre-wrap">
                    {formatMessageContent(message.content)}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card>
                <CardContent className="p-3">
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
      </ScrollArea>

      <Card className="mx-4 mb-8 p-4 border-none max-w-[80%] w-full mx-auto shadow-xl">
        <CardContent className="p-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Share a LeetCode problem link and your question..."
                className="flex-1"
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
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>
                Include both a LeetCode problem link and your specific question
                for the best guidance
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
