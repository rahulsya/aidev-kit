import { NextResponse } from "next/server";
import OpenAI from "openai";
import { trackedAI } from "@/lib/tracker";

const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "mock-key",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const prompt = `Tolong jelaskan SQL query berikut dalam bahasa Indonesia yang mudah dipahami.
Berikan juga 1-2 saran optimasi jika ada.
Query:
${query}`;

    const response = await trackedAI({
      feature: "sql-explainer",
      userId: "demo-user",
      run: async () => {
        return await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          max_tokens: 400,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const explanation =
      response.choices[0]?.message?.content || "No content generated";

    return NextResponse.json({ explanation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
