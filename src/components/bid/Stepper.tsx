const steps = [
  { key: 1, label: "招标文件解读" },
  { key: 2, label: "标书基础设置" },
  { key: 3, label: "投标资料配置" },
  { key: 4, label: "编写目录" },
  { key: 5, label: "编写正文" },
];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {steps.map((s, i) => {
        const done = current > s.key;
        const active = current === s.key;
        return (
          <div key={s.key} className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all " +
                  (done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30"
                    : "bg-[#F2F4F6] text-[#191c1e]/40")
                }
              >
                {done ? (
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                ) : (
                  s.key
                )}
              </div>
              <span
                className={
                  "text-sm font-semibold transition-colors " +
                  (active
                    ? "text-[#191c1e]"
                    : done
                    ? "text-emerald-600"
                    : "text-[#191c1e]/40")
                }
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={
                  "w-12 h-0.5 rounded-full transition-colors " +
                  (done ? "bg-emerald-500" : "bg-[#ECEEF1]")
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
