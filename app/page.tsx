import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Cover Letter Generator",
    href: "/cover-letter",
    description: "Generates a professional cover letter based on user profile and job title.",
    model: "gpt-4o",
    cost: "High",
  },
  {
    title: "SQL Explainer",
    href: "/sql-explainer",
    description: "Explains complex SQL queries in simple language.",
    model: "claude-haiku-4-5-20251001",
    cost: "Low",
  },
  {
    title: "Code Reviewer",
    href: "/code-reviewer",
    description: "Reviews code snippets for readability and bugs.",
    model: "gpt-4o-mini",
    cost: "Medium",
  },
  {
    title: "Email Reply Drafter",
    href: "/email-drafter",
    description: "Drafts formal, casual, and firm replies to an email.",
    model: "claude-haiku-4-5-20251001",
    cost: "Medium",
  },
  {
    title: "Restaurant Finder",
    href: "/restaurant-finder",
    description: "Finds real restaurants using web search.",
    model: "claude-sonnet-4-6",
    cost: "Very High",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome to DevKit AI</h1>
        <p className="text-lg text-slate-600">
          A testbed application designed to demonstrate the AI Cost Tracker SDK capabilities. 
          Choose a feature below to generate varied AI usage logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block transition-transform hover:-translate-y-1">
            <Card className="h-full hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Model:</span>
                  <Badge variant="secondary" className="font-mono text-xs">{feature.model}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Cost Profile:</span>
                  <Badge variant={feature.cost.includes("High") ? "destructive" : "default"}>
                    {feature.cost}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
