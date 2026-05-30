import { NextResponse } from "next/server";
import OpenAI from "openai";
import { trackedAI } from "@/lib/tracker";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key",
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
        return await openai.chat.completions.create({
          model: "gpt-4o",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const coverLetter = response.choices[0]?.message?.content || "No content generated";

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
