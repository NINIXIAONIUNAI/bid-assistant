import { useState } from "react";
import { UploadZone, type UploadedFile } from "./UploadZone";

type SectionItem = {
  id: string;
  title: string;
  status: "未编写" | "编写中" | "已完成";
  current: number;
  target: number;
};

type Chapter = { id: string; title: string; sections: SectionItem[] };

const initial: Chapter[] = [
  {
    id: "c1",
    title: "第一章 项目概述",
    sections: [
      { id: "1.1", title: "1.1 项目背景", status: "已完成", current: 1200, target: 1200 },
      { id: "1.2", title: "1.2 项目目标", status: "编写中", current: 480, target: 1500 },
      { id: "1.3", title: "1.3 建设范围", status: "未编写", current: 0, target: 1000 },
    ],
  },
  {
    id: "c2",
    title: "第二章 技术方案",
    sections: [
      { id: "2.1", title: "2.1 总体架构设计", status: "未编写", current: 0, target: 2500 },
      { id: "2.2", title: "2.2 核心模块设计", status: "未编写", current: 0, target: 3000 },
      { id: "2.3", title: "2.3 数据安全方案", status: "未编写", current: 0, target: 2000 },
      { id: "2.4", title: "2.4 接口设计", status: "未编写", current: 0, target: 1500 },
    ],
  },
  {
    id: "c3",
    title: "第三章 项目实施",
    sections: [
      { id: "3.1", title: "3.1 实施计划", status: "未编写", current: 0, target: 1800 },
      { id: "3.2", title: "3.2 团队组织", status: "未编写", current: 0, target: 1500 },
    ],
  },
];

const completedInitial: Chapter[] = initial.map((c) => ({
  ...c,
  sections: c.sections.map((s) => ({ ...s, status: "已完成" as const, current: s.target })),
}));

const statusStyles: Record<SectionItem["status"], string> = {
  未编写: "bg-[#F2F4F6] text-[#191c1e]/50",
  编写中: "bg-[#D4E3FF] text-[#3B82F6]",
  已完成: "bg-emerald-50 text-emerald-600",
};

export function Step4Content({ onPrev, status = "编写中" }: { onPrev: () => void; status?: "编写中" | "已完成" }) {
  const [mode, setMode] = useState<"outline" | "content">("outline");
  const isDone = status === "已完成";
  const [chapters] = useState<Chapter[]>(isDone ? completedInitial : initial);
  const [activeSection, setActiveSection] = useState<string>(isDone ? "1.1" : "1.2");

  const allSections = chapters.flatMap((c) => c.sections);
  const total = allSections.length;
  const completed = allSections.filter((s) => s.status === "已完成").length;
  const totalChars = allSections.reduce((s, x) => s + x.current, 0);
  const targetChars = allSections.reduce((s, x) => s + x.target, 0);
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#F7F9FC]">
      {/* 顶栏 */}
      <div className="bg-white border-b border-[#ECEEF1] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px] text-[#191c1e]/60">
              arrow_back
            </span>
          </button>
          <span className="material-symbols-outlined text-[#3B82F6]">
            description
          </span>
          <div>
            <div className="text-sm font-bold">XX市政务云平台建设项目投标书</div>
            <div className="text-xs text-[#191c1e]/50">草稿已保存 · 2 分钟前</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={
              "text-xs font-bold px-2.5 py-1 rounded-full " +
              (isDone ? "bg-emerald-50 text-emerald-600" : "bg-[#D4E3FF] text-[#3B82F6]")
            }
          >
            {status}
          </span>
          <button className="px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">download</span>
            导出标书
          </button>
        </div>
      </div>

      {/* 第二栏 */}
      <div className="bg-white border-b border-[#ECEEF1] px-6 py-3 flex items-center justify-between">
        <div className="flex gap-1 bg-[#F2F4F6] rounded-xl p-1">
          {[
            { k: "outline", label: "目录模式", icon: "list" },
            { k: "content", label: "正文模式", icon: "edit_document" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setMode(t.k as typeof mode)}
              className={
                "px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all " +
                (mode === t.k
                  ? "bg-white text-[#3B82F6] shadow-sm"
                  : "text-[#191c1e]/60 hover:text-[#191c1e]")
              }
            >
              <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold">
          <Stat label="总章节" value={total.toString()} />
          <Stat label="已完成" value={`${completed} / ${total}`} />
          <Stat label="实际字数" value={totalChars.toLocaleString()} />
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="text-xs text-[#191c1e]/60">进度</div>
            <div className="flex-1 h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B82F6] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs font-bold text-[#3B82F6] w-9 text-right">
              {progress}%
            </div>
          </div>
          <div className="text-xs text-[#191c1e]/50">
            目标 {targetChars.toLocaleString()} 字
          </div>
        </div>
      </div>

      {/* 主体 */}
      {mode === "outline" ? (
        <OutlineMode chapters={chapters} />
      ) : (
        <ContentMode
          chapters={chapters}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] text-[#191c1e]/50 uppercase tracking-wider font-bold">
        {label}
      </span>
      <span className="text-sm font-bold text-[#191c1e]">{value}</span>
    </div>
  );
}

function OutlineMode({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="flex-1 overflow-auto px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        {chapters.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-3 bg-[#F7F9FC] border-b border-[#ECEEF1] font-bold text-[#191c1e]">
              {c.title}
            </div>
            <div className="divide-y divide-[#F2F4F6]">
              {c.sections.map((s) => (
                <div
                  key={s.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-[#F7F9FC]/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#191c1e]">
                      {s.title}
                    </div>
                  </div>
                  <span
                    className={
                      "text-xs font-bold px-2.5 py-1 rounded-full " +
                      statusStyles[s.status]
                    }
                  >
                    {s.status}
                  </span>
                  <div className="text-xs text-[#191c1e]/60 w-24 text-right tabular-nums">
                    {s.current} / {s.target} 字
                  </div>
                  <button className="text-xs font-semibold text-[#3B82F6] hover:bg-[#D4E3FF]/50 px-2 py-1 rounded-md">
                    调整字数
                  </button>
                  {s.status === "未编写" && (
                    <button className="text-xs font-bold text-white bg-[#3B82F6] hover:bg-[#3F6DF0] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">
                        edit
                      </span>
                      编写本章
                    </button>
                  )}
                  {s.status === "编写中" && (
                    <button className="text-xs font-bold text-[#3B82F6] border border-[#3B82F6] hover:bg-[#D4E3FF]/40 px-3 py-1.5 rounded-lg">
                      继续
                    </button>
                  )}
                  {s.status === "已完成" && (
                    <button className="text-xs font-semibold text-[#191c1e]/60 hover:bg-[#F2F4F6] px-3 py-1.5 rounded-lg">
                      重写
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentMode({
  chapters,
  activeSection,
  onSelect,
}: {
  chapters: Chapter[];
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  const [assistantFiles, setAssistantFiles] = useState<UploadedFile[]>([]);
  const current = chapters
    .flatMap((c) => c.sections)
    .find((s) => s.id === activeSection);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* 左 20%：目录 */}
      <aside className="w-[20%] min-w-[220px] bg-white border-r border-[#ECEEF1] overflow-auto p-3">
        {chapters.map((c) => (
          <div key={c.id} className="mb-3">
            <div className="text-xs font-bold text-[#191c1e]/50 px-2 py-1.5 uppercase tracking-wider">
              {c.title}
            </div>
            {c.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all " +
                  (activeSection === s.id
                    ? "bg-[#D4E3FF] text-[#3B82F6] font-semibold"
                    : "text-[#191c1e]/70 hover:bg-[#F2F4F6]")
                }
              >
                <span
                  className={
                    "w-1.5 h-1.5 rounded-full " +
                    (s.status === "已完成"
                      ? "bg-emerald-500"
                      : s.status === "编写中"
                      ? "bg-[#3B82F6]"
                      : "bg-[#191c1e]/20")
                  }
                />
                <span className="flex-1 truncate">{s.title}</span>
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* 中 60%：编辑器 */}
      <div className="flex-1 overflow-auto bg-[#F7F9FC]">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-white rounded-3xl shadow-sm p-10 min-h-[600px]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-extrabold">{current?.title}</h2>
              <span
                className={
                  "text-xs font-bold px-2.5 py-1 rounded-full " +
                  (current ? statusStyles[current.status] : "")
                }
              >
                {current?.status}
              </span>
            </div>
            <div className="text-xs text-[#191c1e]/50 mb-6">
              {current?.current} / {current?.target} 字 · 最后保存 1 分钟前
            </div>
            {current?.status === "编写中" && (
              <div className="mb-4 px-4 py-3 bg-[#EEF4FF] rounded-xl flex items-center gap-3">
                <span className="w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-[#3B82F6]">
                  正在编写第 1.2 节...预计 30 秒
                </span>
                <div className="flex-1" />
                <button className="text-xs font-semibold text-[#3B82F6] hover:bg-white px-2 py-1 rounded">
                  暂停
                </button>
              </div>
            )}
            <div
              contentEditable
              suppressContentEditableWarning
              className="prose prose-sm max-w-none text-sm leading-relaxed text-[#191c1e]/85 outline-none min-h-[400px]"
            >
              <p>
                本项目旨在为 XX 市建设统一的政务云平台，整合现有分散的信息化资源，
                提供 IaaS、PaaS、SaaS 三层服务能力，支撑全市各委办局信息系统的迁移、
                改造与新建需求。
              </p>
              <p>
                通过云平台建设，将显著提升政务信息系统的资源利用率、运维效率与
                安全防护能力，为数字政府建设奠定坚实的基础设施底座。
              </p>
              <p>
                <em className="text-[#3B82F6]/70">[ AI 正在续写...]</em>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 右 20%：AI 助手 */}
      <aside className="w-[20%] min-w-[260px] bg-white border-l border-[#ECEEF1] overflow-auto p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">
              auto_awesome
            </span>
          </div>
          <div>
            <div className="text-sm font-bold">AI 写作助手</div>
            <div className="text-[10px] text-[#191c1e]/50">选中文本后使用</div>
          </div>
        </div>

        <AIGroup title="智能改写">
          <AIBtn icon="expand_content" label="扩写" />
          <AIBtn icon="compress" label="精简" />
          <AIBtn icon="autorenew" label="重写" />
          <AIBtn icon="arrow_forward" label="继续编写" />
        </AIGroup>

        <AIGroup title="智能生成">
          <AIBtn icon="lightbulb" label="插入案例" />
          <AIBtn icon="account_tree" label="生成流程图" />
          <AIBtn icon="table_chart" label="生成表格" />
        </AIGroup>

        <AIGroup title="图片">
          <AIBtn icon="search" label="搜索图片" />
          <AIBtn icon="upload" label="上传本地" />
        </AIGroup>

        <div className="mt-5">
          <div className="text-[10px] font-bold text-[#191c1e]/40 uppercase tracking-wider mb-2 px-1">
            上传文件
          </div>
          <div className="rounded-2xl border border-[#ECEEF1] p-3">
            <UploadZone
              files={assistantFiles}
              onChange={setAssistantFiles}
              hint="补充参考资料"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function AIGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[10px] font-bold text-[#191c1e]/40 uppercase tracking-wider mb-2 px-1">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function AIBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#F7F9FC] hover:bg-[#D4E3FF]/50 hover:text-[#3B82F6] text-[#191c1e]/70 transition-all">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}
