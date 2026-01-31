"use client";

import { useState, useEffect, useRef } from "react";

export default function BiriPage() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to process");
      
      setLogs(prev => [...prev, { 
        input, 
        result: data.logs, 
        commentary: data.commentary,
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setInput("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 flex flex-col selection:bg-purple-500 selection:text-white">
      <header className="mb-6 border-b border-zinc-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-purple-500 italic">
            BIRIVIBE<span className="text-zinc-500">.OS</span>
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Neural Interface // Core: Gemini-2.5-Flash-Lite // Session: Active
          </p>
        </div>
        <div className="text-[10px] text-zinc-600">
          STATION: MACBOOK_M4_GABRIEL
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-auto space-y-6 mb-4 scrollbar-hide">
        {logs.length === 0 && (
          <div className="text-zinc-700 text-sm animate-pulse">
            [SYS] WAITING FOR DAILY DUMP...
            <br/>
            {"> TRY: \"WORKOUT DONE, READ 20 PAGES, TOOK MEDS.\""}
          </div>
        )}
        
        {logs.map((log, i) => (
          <div key={i} className="space-y-2 group">
            <div className="flex items-center text-xs text-zinc-600">
              <span className="mr-2">[{log.timestamp}]</span>
              <div className="h-[1px] flex-1 bg-zinc-900 group-hover:bg-zinc-800 transition-colors"></div>
            </div>
            
            <div className="flex items-start">
              <span className="text-purple-500 mr-3 shrink-0">GABRIEL:</span>
              <span className="text-zinc-300">{log.input}</span>
            </div>

            <div className="pl-6 space-y-1">
              {log.result.length > 0 ? (
                log.result.map((r: any, j: number) => (
                  <div key={j} className="text-cyan-500 flex items-center text-sm">
                    <span className="mr-2">●</span>
                    <span>LOGGED: {r.name}</span>
                    <span className="ml-auto text-[10px] text-zinc-700">COUNT: {r.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-yellow-600 text-sm italic">[!] NO HABITS RECOGNIZED</div>
              )}
            </div>

            {log.commentary && (
              <div className="pl-6 text-purple-400 text-sm italic font-medium">
                <span className="mr-2 text-zinc-700">DOUGLAS:</span>
                {`"${log.commentary}"`}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="text-purple-500 animate-pulse text-xs tracking-widest uppercase">
            [PROC] DOUGLAS IS THINKING...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-xs border border-red-900/50 bg-red-900/10 p-2 uppercase tracking-tighter">
            [FAULT] {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto border-t border-zinc-800 pt-4 z-10">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-bold select-none pointer-events-none">
          &gt;
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-24 py-4 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-zinc-800"
          placeholder="ENTER DAILY LOG..."
          disabled={loading}
          autoFocus
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-bold tracking-tighter uppercase pointer-events-none">
          {loading ? "BUSY" : "READY_FOR_INPUT"}
        </div>
      </form>
    </div>
  );
}
