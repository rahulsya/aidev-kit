"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SqlExplainerPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/sql-explainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.explanation);
    } catch (err: any) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>SQL Explainer</CardTitle>
          <CardDescription>Paste your SQL query and get a simple explanation with optimization tips.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SQL Query</label>
              <Textarea
                placeholder="SELECT * FROM users JOIN orders ON users.id = orders.user_id;"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Explaining..." : "Explain Query"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          ) : result ? (
            <div className="whitespace-pre-wrap text-sm text-slate-700">{result}</div>
          ) : (
            <p className="text-sm text-slate-500 italic">Your explanation will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
