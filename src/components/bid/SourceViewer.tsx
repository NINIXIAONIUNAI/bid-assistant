export function SourceViewer({
  fileName,
  page,
  hintTitle,
  index = 0,
  total = 1,
  onPrevSource,
  onNextSource,
  onClose,
}: {
  fileName: string;
  page: number;
  hintTitle: string;
  index?: number;
  total?: number;
  onPrevSource?: () => void;
  onNextSource?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onClose}
          className="text-xs font-semibold text-[#191c1e]/60 hover:text-[#3B82F6] flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F2F4F6]"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          返回上传区
        </button>
        <div className="text-xs text-[#191c1e]/60 font-semibold">
          第 {index + 1} 处 · {hintTitle}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-[#EEF4FF] rounded-xl text-xs">
        <span className="material-symbols-outlined text-[#3B82F6] text-[14px]">picture_as_pdf</span>
        <span className="font-semibold text-[#191c1e] truncate flex-1">{fileName}</span>
      </div>
      <div className="flex-1 bg-[#F7F9FC] rounded-2xl border border-[#ECEEF1] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-[#ECEEF1] px-4 py-2 flex items-center justify-between text-xs text-[#191c1e]/60">
          <span />
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevSource}
              disabled={!onPrevSource || total <= 1}
              className="w-6 h-6 rounded-md hover:bg-[#F2F4F6] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              title="上一处"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="font-semibold">第 {index + 1} 处 / 共 {total} 处</span>
            <button
              onClick={onNextSource}
              disabled={!onNextSource || total <= 1}
              className="w-6 h-6 rounded-md hover:bg-[#F2F4F6] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              title="下一处"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white shadow-sm rounded-md mx-auto max-w-[480px] aspect-[1/1.414] p-8 relative">
            <div className="text-xs text-center text-[#191c1e]/40 mb-4">
              — 招标文件 第 {page} 页 —
            </div>
            <h4 className="text-sm font-bold text-[#191c1e] mb-3">{hintTitle}</h4>
            <div className="space-y-2 text-[11px] text-[#191c1e]/60 leading-relaxed">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    "h-2 rounded " +
                    (i === 5 || i === 6 ? "bg-yellow-200" : "bg-[#ECEEF1]")
                  }
                  style={{ width: `${60 + ((i * 17) % 40)}%` }}
                />
              ))}
            </div>
            <div className="absolute bottom-3 right-4 text-[10px] text-[#191c1e]/30">
              page {page}
            </div>
          </div>
          <p className="text-center text-[11px] text-[#191c1e]/40 mt-4">
            黄色高亮为本字段对应原文位置（演示）
          </p>
        </div>
      </div>
    </div>
  );
}
