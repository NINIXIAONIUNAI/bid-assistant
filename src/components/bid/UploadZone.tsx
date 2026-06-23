import { useRef, useState } from "react";

export type UploadedFile = { name: string; size: string; status: "解析中" | "已完成" | "失败" };

export function UploadZone({
  files,
  onChange,
  hint = "支持 PDF / Word / Excel / 图片，单个 ≤ 50MB",
  multiple = true,
  onPreview,
  accept,
}: {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  hint?: string;
  multiple?: boolean;
  onPreview?: (file: UploadedFile) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles: UploadedFile[] = Array.from(list).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
      status: "解析中",
    }));
    const merged = multiple ? [...files, ...newFiles] : newFiles;
    onChange(merged);
    // Mock parsing completion
    setTimeout(() => {
      onChange(
        merged.map((f) =>
          newFiles.find((nf) => nf.name === f.name) ? { ...f, status: "已完成" } : f
        )
      );
    }, 1500);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all " +
          (dragging
            ? "border-[#3B82F6] bg-[#D4E3FF]/40"
            : "border-[#D4DCE6] bg-[#F7F9FC] hover:bg-[#EEF4FF] hover:border-[#3B82F6]/50")
        }
      >
        <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-[#3B82F6] text-[28px]">
            cloud_upload
          </span>
        </div>
        <div className="text-sm font-semibold text-[#191c1e]">
          点击或拖拽文件到此处上传
        </div>
        <div className="text-xs text-[#191c1e]/50 mt-1">{hint}</div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              onClick={() => onPreview?.(f)}
              className="flex items-center gap-3 bg-white border border-[#ECEEF1] rounded-xl px-4 py-3"
            >
              <span className="material-symbols-outlined text-[#3B82F6] text-[22px]">
                description
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#191c1e] truncate">
                  {f.name}
                </div>
                <div className="text-xs text-[#191c1e]/50">{f.size}</div>
              </div>
              {f.status === "解析中" && (
                <span className="flex items-center gap-1.5 text-xs text-[#3B82F6] font-semibold">
                  <span className="w-3 h-3 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                  正在解析...
                </span>
              )}
              {f.status === "已完成" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  已完成
                </span>
              )}
              {f.status === "失败" && (
                <span className="text-xs text-[#FF4D4F] font-semibold">
                  解析失败
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(files.filter((_, idx) => idx !== i));
                }}
                className="w-7 h-7 rounded-lg text-[#191c1e]/40 hover:bg-red-50 hover:text-[#FF4D4F] flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
