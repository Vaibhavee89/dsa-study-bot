"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Groq API types
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
  const [apiKey, setApiKey] = useState(() => {
    // Try to get API key from localStorage during initialization
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("groqApiKey") ||
        process.env.NEXT_PUBLIC_GROQ_API_KEY ||
        ""
      );
    }
    return process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

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

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey && typeof window !== "undefined") {
      localStorage.setItem("groqApiKey", apiKey);
    }
  }, [apiKey]);

  const callGroqAPI = async (userMessages: GroqMessage[]) => {
    try {
      // Define the system message to instruct the model
      const systemMessage = {
        role: "system",
        content:
          "You are a DSA (Data Structures and Algorithms) Teaching Assistant. Your goal is to help students understand algorithms and data structures concepts without giving away complete solutions to problems. When given a LeetCode problem, provide hints, explain key concepts, suggest approaches, and ask guiding questions, but avoid providing full implementations. Focus on teaching the underlying principles and helping students develop their problem-solving skills.",
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
            model: "llama3-70b-8192", // You can use other Groq models like "mixtral-8x7b-32768" as needed
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

    // Check if API key is set
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    // Transform messages for Groq API
    const groqMessages: GroqMessage[] = messages
      .filter((msg) => msg.id !== 1) // Skip the initial greeting
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Add the new user message
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

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowApiKeyInput(false);
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

      {showApiKeyInput ? (
        <Card className="m-4 p-4 max-w-md">
          <CardContent>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <h2 className="text-lg font-medium">Enter Groq API Key</h2>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally in your browser and is not sent
                to any server besides Groq.
              </p>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApiKeyInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!apiKey.trim().startsWith("sk-")}
                >
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4 max-w-7xl w-full">
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
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>
                      Include both a LeetCode problem link and your specific
                      question for the best guidance
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setShowApiKeyInput(true)}
                  >
                    {apiKey ? "Change API Key" : "Set API Key"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
