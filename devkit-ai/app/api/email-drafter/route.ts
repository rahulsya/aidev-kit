import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { trackedAI } from "@/lib/tracker";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "mock-key",
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
        return await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const drafts = response.content[0]?.type === 'text' ? response.content[0].text : "No content generated";

    return NextResponse.json({ drafts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
