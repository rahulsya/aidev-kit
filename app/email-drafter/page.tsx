"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function EmailDrafterPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/email-drafter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.drafts);
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
          <CardTitle>Email Reply Drafter</CardTitle>
          <CardDescription>Paste the email you received to generate 3 reply options (Formal, Casual, Firm).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Received Email</label>
              <Textarea
                placeholder="Dear John, could you please send the report by tomorrow?"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-h-[250px] text-sm"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Drafting..." : "Draft Replies"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Drafted Replies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full mt-4"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          ) : result ? (
            <div className="whitespace-pre-wrap text-sm text-slate-700">{result}</div>
          ) : (
            <p className="text-sm text-slate-500 italic">Your drafted replies will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
