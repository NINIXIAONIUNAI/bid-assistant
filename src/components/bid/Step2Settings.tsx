import { useRef, useState } from "react";

const bidTypes = [
  { key: "service", label: "服务类", icon: "support_agent" },
  { key: "goods", label: "物资类", icon: "inventory_2" },
  { key: "project", label: "工程类", icon: "engineering" },
  { key: "other", label: "其他", icon: "category" },
];

const chartOptions = ["无表格", "少量表格", "适量表格", "大量表格"];
const imageOptions = ["无图片", "少量图片", "适量图片", "大量图片"];

export function Step2Settings({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("service");
  const [pages, setPages] = useState(80);
  const [chart, setChart] = useState("适量表格");
  const [image, setImage] = useState("少量图片");
  const [showError, setShowError] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const canNext = name.trim().length > 0;

  return (
    <div className="max-w-5xl mx-auto px-8 pb-12 space-y-6">
      {/* 基础信息 */}
      <Section title="基础信息" icon="edit_note">
        <Field label="标书名称" required>
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：XX市政务云平台建设项目投标书"
            className={
              "w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-all " +
              (showError && !name
                ? "border-[#FF4D4F]"
                : "border-[#ECEEF1] focus:border-[#3B82F6]")
            }
          />
        </Field>

        <Field label="标书类型" required>
          <div className="grid grid-cols-4 gap-3">
            {bidTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all " +
                  (type === t.key
                    ? "border-[#3B82F6] bg-[#D4E3FF]/30"
                    : "border-[#ECEEF1] hover:border-[#3B82F6]/40")
                }
              >
                <span
                  className={
                    "material-symbols-outlined text-[24px] " +
                    (type === t.key ? "text-[#3B82F6]" : "text-[#191c1e]/60")
                  }
                >
                  {t.icon}
                </span>
                <span
                  className={
                    "text-sm font-semibold " +
                    (type === t.key ? "text-[#3B82F6]" : "text-[#191c1e]/70")
                  }
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="标书页数" hint="标书页数仅作为AI生成参考依据，实际页数可能因内容调整产生变化">
          <PageSlider value={pages} onChange={setPages} />
        </Field>
      </Section>

      {/* 图表设置 */}
      <Section title="图表与配图" icon="palette">
        <p className="text-xs text-[#191c1e]/60 -mt-2 mb-2">系统将根据设置自动插入对应图表及示意图。</p>
        <Field label="表格密度">
          <RadioGroup value={chart} onChange={setChart} options={chartOptions} />
        </Field>
        <Field label="智能配图">
          <RadioGroup value={image} onChange={setImage} options={imageOptions} />
        </Field>
      </Section>

      {/* 底部操作 */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-3 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-white flex items-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          上一步
        </button>
        <button
          onClick={() => {
            if (!canNext) {
              setShowError(true);
                nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                nameRef.current?.focus();
              return;
            }
            onNext();
          }}
          className="px-8 py-3 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
        >
          下一步：投标资料配置
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function PageSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const min = 20;
  const max = 1000;
  const pct = ((value - min) / (max - min)) * 100;
  const presets = [40, 80, 120, 200, 500, 1000];
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1 h-10 flex items-center">
          <div className="absolute inset-x-0 h-2 rounded-full bg-[#F2F4F6]" />
          <div
            className="absolute h-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6FA8FF]"
            style={{ width: `${pct}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(+e.target.value)}
            className="absolute inset-x-0 w-full h-10 appearance-none bg-transparent cursor-pointer page-slider"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-[#ECEEF1] bg-white overflow-hidden">
          <button
            onClick={() => onChange(Math.max(min, value - 10))}
            className="w-9 h-10 text-[#191c1e]/60 hover:bg-[#F7F9FC] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <div className="w-16 text-center font-bold text-sm text-[#3B82F6]">
            {value}<span className="text-xs text-[#191c1e]/50 ml-0.5">页</span>
          </div>
          <button
            onClick={() => onChange(Math.min(max, value + 10))}
            className="w-9 h-10 text-[#191c1e]/60 hover:bg-[#F7F9FC] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={
              "px-3 py-1 rounded-full text-xs font-semibold border transition-all " +
              (value === p
                ? "border-[#3B82F6] bg-[#D4E3FF] text-[#3B82F6]"
                : "border-[#ECEEF1] text-[#191c1e]/60 hover:border-[#3B82F6]/40")
            }
          >
            {p} 页
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-[11px] text-[#191c1e]/40">
          <span>{min}</span>
          <span>—</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  required,
  children,
}: {
  title: string;
  icon: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">
            {icon}
          </span>
        </div>
        <h3 className="text-lg font-bold">
          {title}
          {required && <span className="text-[#FF4D4F] ml-1">*</span>}
        </h3>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-[#191c1e]">
          {label}
          {required && <span className="text-[#FF4D4F] ml-1">*</span>}
        </label>
        {hint && <span className="text-xs text-[#191c1e]/50">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={
            "py-2.5 rounded-xl text-sm font-semibold border transition-all " +
            (value === o
              ? "border-[#3B82F6] bg-[#D4E3FF]/40 text-[#3B82F6]"
              : "border-[#ECEEF1] text-[#191c1e]/70 hover:border-[#3B82F6]/40")
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}
