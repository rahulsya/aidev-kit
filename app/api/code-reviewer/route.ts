import { NextResponse } from "next/server";
import OpenAI from "openai";
import { trackedAI } from "@/lib/tracker";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key",
});

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const prompt = `Review the following code snippet for readability, potential bugs, and provide improvement suggestions.
Format your output cleanly using the following sections where applicable:
✅ Good: (things done well)
⚠️ Warning: (potential issues or readability concerns)
❌ Issue: (actual bugs)

Code:
${code}`;

    const response = await trackedAI({
      feature: "code-reviewer",
      userId: "demo-user",
      run: async () => {
        return await openai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const review = response.choices[0]?.message?.content || "No content generated";

    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
