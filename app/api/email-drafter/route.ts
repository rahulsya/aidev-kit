import { NextResponse } from "next/server";
import OpenAI from "openai";
import { trackedAI } from "@/lib/tracker";

const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "mock-key",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const prompt = `Based on the email below, generate 3 different reply options:
1. Formal
2. Casual
3. Firm

Separate each option clearly with a header.
Email received:
${email}`;

    const response = await trackedAI({
      feature: "email-drafter",
      userId: "demo-user",
      run: async () => {
        return await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const drafts =
      response.choices[0]?.message?.content || "No content generated";

    return NextResponse.json({ drafts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
