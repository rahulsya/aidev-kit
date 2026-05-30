import { NextResponse } from "next/server";
import OpenAI from "openai";
import { trackedAI } from "@/lib/tracker";

const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "mock-key",
  baseURL: "https://api.groq.com/openai/v1",
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
        return await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        });
      },
    });

    const recommendations =
      response.choices[0]?.message?.content || "No content generated";

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
