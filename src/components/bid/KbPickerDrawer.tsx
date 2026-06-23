import { useState } from "react";

export type KbPickerItem = { id: string; title: string; subtitle?: string; tag?: string };
export type KbPickerGroup = { key: string; label: string; items: KbPickerItem[] };

export function KbPickerDrawer({
  open,
  title,
  items,
  groups,
  multi = true,
  initialSelected = [],
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  items: KbPickerItem[];
  groups?: KbPickerGroup[];
  multi?: boolean;
  initialSelected?: string[];
  onClose: () => void;
  onConfirm: (selected: KbPickerItem[]) => void;
}) {
  const [sel, setSel] = useState<Set<string>>(new Set(initialSelected));
  const [q, setQ] = useState("");
  const [activeGroup, setActiveGroup] = useState(groups?.[0]?.key ?? "");

  if (!open) return null;

  const sourceItems = groups?.find((g) => g.key === activeGroup)?.items ?? items;
  const allItems = groups ? groups.flatMap((g) => g.items) : items;
  const selectedItems = allItems.filter((it) => sel.has(it.id));
  const filtered = sourceItems.filter(
    (it) => !q || it.title.includes(q) || (it.subtitle ?? "").includes(q),
  );

  const toggle = (id: string) => {
    const next = new Set(sel);
    if (multi) {
      next.has(id) ? next.delete(id) : next.add(id);
    } else {
      next.clear();
      next.add(id);
    }
    setSel(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="px-6 py-4 border-b border-[#ECEEF1] flex items-center justify-between">
          <h3 className="text-base font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="px-6 py-3 border-b border-[#ECEEF1]">
          {groups && groups.length > 0 && (
            <div className="flex gap-1 bg-[#F2F4F6] rounded-xl p-1 mb-3 overflow-x-auto">
              {groups.map((g) => (
                <button
                  key={g.key}
                  onClick={() => setActiveGroup(g.key)}
                  className={
                    "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all " +
                    (activeGroup === g.key
                      ? "bg-white text-[#3B82F6] shadow-sm"
                      : "text-[#191c1e]/60 hover:text-[#191c1e]")
                  }
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#191c1e]/40 text-[18px]">
              search
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#ECEEF1] bg-[#F7F9FC] text-sm focus:outline-none focus:border-[#3B82F6] focus:bg-white"
            />
          </div>
          <p className="text-[11px] text-[#191c1e]/50 mt-2">
            {multi ? "支持多选，建议选择与本项目类型一致的内容" : "请选择一项"}
          </p>
          {selectedItems.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedItems.map((it) => (
                <span key={it.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#D4E3FF] text-[#3B82F6] text-[11px] font-bold">
                  {it.title}
                  <button onClick={() => setSel((s) => {
                    const n = new Set(s);
                    n.delete(it.id);
                    return n;
                  })}>
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto px-6 py-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-[#191c1e]/50 py-12">无匹配资料</div>
          ) : (
            filtered.map((it) => {
              const on = sel.has(it.id);
              return (
                <button
                  key={it.id}
                  onClick={() => toggle(it.id)}
                  className={
                    "w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-start gap-2.5 " +
                    (on
                      ? "border-[#3B82F6] bg-[#D4E3FF]/40"
                      : "border-[#ECEEF1] hover:border-[#3B82F6]/40")
                  }
                >
                  <span
                    className={
                      "material-symbols-outlined text-[16px] mt-0.5 " +
                      (on ? "text-[#3B82F6]" : "text-[#191c1e]/30")
                    }
                  >
                    {on ? "check_box" : "check_box_outline_blank"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#191c1e]">{it.title}</div>
                    {it.subtitle && (
                      <div className="text-xs text-[#191c1e]/60 mt-0.5">{it.subtitle}</div>
                    )}
                  </div>
                  {it.tag && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2F4F6] text-[#191c1e]/60 whitespace-nowrap">
                      {it.tag}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
        <div className="px-6 py-4 border-t border-[#ECEEF1] flex items-center justify-between gap-3">
          <span className="text-xs text-[#191c1e]/60">已选 {sel.size} 项</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC]"
            >
              取消
            </button>
            <button
              onClick={() => onConfirm(allItems.filter((it) => sel.has(it.id)))}
              className="px-5 py-2 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0]"
            >
              确认引用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
