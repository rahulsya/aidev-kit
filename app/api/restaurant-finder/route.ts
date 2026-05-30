import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { trackedAI } from "@/lib/tracker";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "mock-key",
});

export async function POST(req: Request) {
  try {
    const { preferences } = await req.json();

    const prompt = `Browse the web to find 3-5 real restaurant recommendations based on the following location and preferences.
For each recommendation provide:
- Name
- Short description
- Estimated price
- Link to Google Maps or website

Preferences:
${preferences}`;

    const response = await trackedAI({
      feature: "restaurant-finder",
      userId: "demo-user",
      run: async () => {
        return await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }] as any,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const recommendations = response.content[0]?.type === 'text' ? response.content[0].text : "No content generated";

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
