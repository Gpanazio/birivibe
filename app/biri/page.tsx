'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

interface OutputItem {
  type: 'response' | 'error';
  content: unknown;
}

export default function NeuralTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      setOutput((prev) => [...prev, { type: "response", content: data }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput((prev) => [...prev, { type: "error", content: errorMessage }]);
    } finally {
      setIsSending(false);
      setInput("");
    }
  };

  return (
    <div className="h-screen w-full bg-black text-lime-400 font-mono overflow-hidden flex flex-col">
      {/* Header with Navigation */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-lime-400/20">
        <Link href="/" className="p-2 -ml-2 hover:bg-lime-400/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold">🧠 Daily Dump</h1>
          <p className="text-[10px] text-lime-400/50">BiriVibe Neural Terminal v1.0</p>
        </div>
        <Link href="/" className="p-2 hover:bg-lime-400/10 rounded-full transition-colors">
          <Home className="w-5 h-5" />
        </Link>
      </header>
      <div className="p-4 h-full flex flex-col">
        {/* Terminal Header */}
        <div className="text-xs mb-2 opacity-50">BiriVibe Neural Terminal v1.0</div>

        {/* Output Area with Scanlines */}
        <div className="flex-grow overflow-y-auto relative">
          {output.map((item, index) => (
            <div key={index} className={`mb-4 p-2 bg-black/50 rounded ${item.type === "error" ? "border border-red-500" : ""}`}>
              <span className="text-xs text-gray-400">[RESPONSE]</span>
              <pre className="whitespace-pre-wrap">{JSON.stringify(item.content, null, 2)}</pre>
            </div>
          ))}
        </div>

        {/* Input Area with Glow Effect */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your Daily Dump here..."
            className="flex-grow bg-black/30 border border-lime-400 rounded px-3 py-2 text-white focus:outline-none focus:border-lime-500"
          />
          <button
            type="submit"
            disabled={isSending}
            className={`px-4 py-2 rounded ${isSending ? "bg-gray-600" : "bg-lime-400 hover:bg-lime-500"} transition-colors`}
          >
            {isSending ? "Processing..." : "Send"}
          </button>
        </form>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="scanlines" patternUnits="userSpaceOnUse" width="2" height="2">
                <rect width="2" height="1" fill="rgba(38, 38, 38, 0.5)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#scanlines)" />
          </svg>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-lime-400/5 to-transparent opacity-20 blur-sm" />
        </div>
      </div>
    </div>
  );
}