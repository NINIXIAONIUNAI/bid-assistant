import { useEffect, useState } from "react";

export type ParseStep = { key: string; label: string };

export function ParsingProgress({
  steps,
  stepMs = 380,
  onDone,
}: {
  steps: ParseStep[];
  stepMs?: number;
  onDone?: () => void;
}) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    setDone(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setDone(i);
      if (i >= steps.length) {
        clearInterval(t);
        onDone?.();
      }
    }, stepMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-[#F7F9FC] rounded-2xl p-6 min-h-96">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[#3B82F6] text-[18px] animate-spin">
          progress_activity
        </span>
        <span className="text-sm font-bold text-[#191c1e]">AI 正在解析招标文件…</span>
      </div>
      <div className="space-y-2.5">
        {steps.map((s, i) => {
          const isDone = i < done;
          const isCur = i === done;
          return (
            <div key={s.key} className="flex items-center gap-2.5 text-sm">
              {isDone ? (
                <span className="material-symbols-outlined text-emerald-500 text-[16px]">
                  check_circle
                </span>
              ) : isCur ? (
                <span className="w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-[#ECEEF1]" />
              )}
              <span
                className={
                  isDone
                    ? "text-[#191c1e]/60 line-through"
                    : isCur
                    ? "text-[#191c1e] font-semibold"
                    : "text-[#191c1e]/40"
                }
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
