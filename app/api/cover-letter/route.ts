import { NextResponse } from "next/server";
import OpenAI from "openai";
import { trackedAI } from "@/lib/tracker";

const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "mock-key",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { name, jobTitle, experience } = await req.json();

    const prompt = `Write a professional cover letter (~400 words) for ${name} applying for the position of ${jobTitle}.
Use the following experience points:
${experience}`;

    const response = await trackedAI({
      feature: "cover-letter-generator",
      userId: "demo-user",
      run: async () => {
        return await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const coverLetter =
      response.choices[0]?.message?.content || "No content generated";

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
