import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { trackedAI } from "@/lib/tracker";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "mock-key",
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
        return await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 400,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const explanation = response.content[0]?.type === 'text' ? response.content[0].text : "No content generated";

    return NextResponse.json({ explanation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
