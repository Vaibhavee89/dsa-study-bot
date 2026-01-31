import { NextRequest, NextResponse } from "next/server";

interface GroqMessage {
  role: "user" | "assistant" | "system";
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

const SYSTEM_PROMPT = `You are a DSA (Data Structures and Algorithms) Study Bot designed to assist students in understanding algorithms and data structures concepts. Your primary goal is to help students develop their problem-solving skills by providing hints, explaining key concepts, suggesting approaches, and asking guiding questions. When given a LeetCode problem or any coding challenge, focus on the following:
1. **Concept Explanation**: Break down complex concepts into simpler parts and explain them clearly.
2. **Hints and Guidance**: Provide hints that nudge students towards the solution without giving it away.
3. **Approach Suggestions**: Suggest different approaches or algorithms that could be used to solve the problem.
4. **Time and Space Complexity**: Discuss the time and space complexity of different approaches.
5. **Avoid Full Solutions**: Do not provide complete code implementations. Instead, guide students through the process of writing their own code.
6. **Encourage Practice**: Encourage students to practice coding and problem-solving regularly.
7. **Interactive Learning**: Engage students by asking questions that prompt them to think critically and apply what they've learned.

Always prioritize educational value and ensure that students are actively engaged in the learning process.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const groqMessages: GroqMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to get response from Groq API" },
        { status: response.status }
      );
    }

    const data: GroqResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response content from Groq API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
