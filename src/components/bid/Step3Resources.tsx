import { useRef, useState } from "react";
import { UploadZone, type UploadedFile } from "./UploadZone";
import { KbPickerDrawer, type KbPickerGroup, type KbPickerItem } from "./KbPickerDrawer";
import {
  mockCerts,
  mockStaff,
  mockCases,
  mockFinancials,
  mockTemplates,
  mockHistory,
  mockCompany,
} from "@/lib/mockKb";

type BidType = "service" | "goods" | "project" | "other";

const schemeTemplateLabel: { title: string; upload: string; required: string } = {
  title: "方案模板",
  upload: "选择知识库内容或上传方案模板文件",
  required: "请补充方案模板",
};

type SelItem = {
  id: string;
  title: string;
  subtitle?: string;
  source?: "kb" | "upload" | "history";
};

export function Step3Resources({
  onPrev,
  onNext,
}: {
  bidType?: BidType;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [company, setCompany] = useState("");
  const [business, setBusiness] = useState("");
  const [introText, setIntroText] = useState("");
  const [companySource, setCompanySource] = useState<SelItem | null>(null);
  const [certs, setCerts] = useState<SelItem[]>([]);
  const [staff, setStaff] = useState<SelItem[]>([]);
  const [cases, setCases] = useState<SelItem[]>([]);
  const [financials, setFinancials] = useState<SelItem[]>([]);
  const [templates, setTemplates] = useState<SelItem[]>([]);
  const [respFiles, setRespFiles] = useState<UploadedFile[]>([]);
  const [showError, setShowError] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const [picker, setPicker] = useState<null | {
    kind: "company" | "certs" | "staff" | "cases" | "financials" | "template";
  }>(null);
  const [historyPicker, setHistoryPicker] = useState(false);
  const [uploadModal, setUploadModal] = useState<null | {
    kind: "company" | "certs" | "staff" | "cases" | "financials" | "template" | "resp";
    title: string;
  }>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);
  const [syncKb, setSyncKb] = useState(true);
  const companyRef = useRef<HTMLInputElement>(null);
  const respRef = useRef<HTMLDivElement>(null);

  const respFilled = respFiles.some((f) => f.status === "已完成");
  const schemeTemplateFilled = templates.length > 0 || respFilled;
  const canNext = company.trim().length > 0 && schemeTemplateFilled;
  const fillCompanyInfo = (source: SelItem) => {
    setCompany(mockCompany.name);
    setBusiness(mockCompany.business);
    setIntroText(mockCompany.intro);
    setCompanySource(source);
  };
  const templateGroups: KbPickerGroup[] = [
    {
      key: "quality",
      label: "质量管理方案",
      items: mockTemplates.map((t, i) => ({
        id: `quality-${t.id}`,
        title: t.name.replace("方案", "质量管理方案"),
        subtitle: `${t.scene} · 更新于 ${t.updated}`,
        tag: i === 0 ? "推荐" : undefined,
      })),
    },
    {
      key: "implementation",
      label: "实施方案",
      items: mockTemplates.map((t) => ({
        id: `implementation-${t.id}`,
        title: t.name.replace("方案", "实施方案"),
        subtitle: `${t.scene} · 更新于 ${t.updated}`,
      })),
    },
    {
      key: "safety",
      label: "安全管理方案",
      items: mockTemplates.map((t) => ({
        id: `safety-${t.id}`,
        title: t.name.replace("方案", "安全管理方案"),
        subtitle: `${t.scene} · 更新于 ${t.updated}`,
      })),
    },
    {
      key: "emergency",
      label: "应急预案",
      items: mockTemplates.map((t) => ({
        id: `emergency-${t.id}`,
        title: t.name.replace("方案", "应急预案"),
        subtitle: `${t.scene} · 更新于 ${t.updated}`,
      })),
    },
  ];
  const openUpload = (kind: NonNullable<typeof uploadModal>["kind"], title: string) => {
    setUploadFiles([]);
    setSyncKb(true);
    setUploadModal({ kind, title });
  };
  const confirmUpload = () => {
    if (!uploadModal) return;
    const completed = uploadFiles.filter((f) => f.status === "已完成");
    if (completed.length === 0) return;
    const added = completed.map((f, i) => ({
      id: `${uploadModal.kind}-${Date.now()}-${i}`,
      title: f.name,
      subtitle: syncKb ? "已同步保存至知识库" : "仅用于本次标书",
      source: "upload" as const,
    }));
    if (uploadModal.kind === "company" && added[0]) {
      fillCompanyInfo({
        ...added[0],
        title: `已解析：${added[0].title}`,
      });
    }
    if (uploadModal.kind === "certs") setCerts((s) => [...s, ...added]);
    if (uploadModal.kind === "staff") setStaff((s) => [...s, ...added]);
    if (uploadModal.kind === "cases") setCases((s) => [...s, ...added]);
    if (uploadModal.kind === "financials") setFinancials((s) => [...s, ...added]);
    if (uploadModal.kind === "template") setTemplates((s) => [...s, ...added]);
    if (uploadModal.kind === "resp") setRespFiles((s) => [...s, ...completed]);
    setUploadModal(null);
  };

  const pickerConfig: Record<
    NonNullable<typeof picker>["kind"],
    {
      title: string;
      multi: boolean;
      items: KbPickerItem[];
      onConfirm: (sel: KbPickerItem[]) => void;
      initial: string[];
    }
  > = {
    company: {
      title: "从知识库选择企业信息",
      multi: false,
      items: [
        {
          id: "company-1",
          title: mockCompany.name,
          subtitle: `${mockCompany.uscc} · ${mockCompany.business}`,
        },
      ],
      onConfirm: (sel) => {
        if (sel[0]) fillCompanyInfo({ ...sel[0], source: "kb" });
        setPicker(null);
      },
      initial: companySource ? [companySource.id] : [],
    },
    certs: {
      title: "从知识库选择资质证书",
      multi: true,
      items: mockCerts.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: `编号 ${c.code} · ${c.expiry}`,
      })),
      onConfirm: (sel) => {
        setCerts(sel.map((s) => ({ id: s.id, title: s.title })));
        setPicker(null);
      },
      initial: certs.map((c) => c.id),
    },
    staff: {
      title: "从知识库选择人员",
      multi: true,
      items: mockStaff.map((s) => ({
        id: s.id,
        title: `${s.name}（${s.role}）`,
        subtitle: `${s.years} 年经验 · ${s.certs.length} 本证书`,
      })),
      onConfirm: (sel) => {
        setStaff(sel.map((s) => ({ id: s.id, title: s.title })));
        setPicker(null);
      },
      initial: staff.map((s) => s.id),
    },
    cases: {
      title: "从知识库选择类似业绩（建议选择与本项目类型一致的业绩）",
      multi: true,
      items: mockCases.map((k) => ({
        id: k.id,
        title: k.name,
        subtitle: `${k.type} · ${k.amount} · ${k.date}`,
        tag: k.type,
      })),
      onConfirm: (sel) => {
        setCases(sel.map((s) => ({ id: s.id, title: s.title })));
        setPicker(null);
      },
      initial: cases.map((c) => c.id),
    },
    financials: {
      title: "从知识库选择财务状况",
      multi: true,
      items: mockFinancials.map((f) => ({
        id: f.id,
        title: f.name,
        subtitle: `${f.period} · 营收 ${f.revenue} · 净利润 ${f.netProfit}`,
      })),
      onConfirm: (sel) => {
        setFinancials(sel.map((s) => ({ id: s.id, title: s.title })));
        setPicker(null);
      },
      initial: financials.map((f) => f.id),
    },
    template: {
      title: "从知识库选择方案模板",
      multi: true,
      items: templateGroups.flatMap((g) => g.items),
      onConfirm: (sel) => {
        setTemplates(sel.map((s) => ({ id: s.id, title: s.title, source: "kb" })));
        setPicker(null);
      },
      initial: templates.map((t) => t.id),
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-8 pb-12 space-y-5">
      <Card title="企业信息" icon="business">
        <Row label="企业信息来源">
          <PickerField
            selectedLabel={companySource?.title}
            selectedSource={companySource?.source}
            onPick={() => setPicker({ kind: "company" })}
            onClear={() => setCompanySource(null)}
            secondary={{ label: "上传文件", onClick: () => openUpload("company", "上传企业信息") }}
            pickLabel="从知识库选择"
          />
        </Row>
        <Row label="企业名称" required>
          <input
            ref={companyRef}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="请输入企业名称"
            className={
              "w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none " +
              (showError && !company.trim()
                ? "border-[#FF4D4F]"
                : "border-[#ECEEF1] focus:border-[#3B82F6]")
            }
          />
        </Row>
        <Row label="主营业务">
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="例如：信息系统集成、智慧城市建设"
            className="w-full px-4 py-2.5 rounded-xl border border-[#ECEEF1] bg-white text-sm focus:outline-none focus:border-[#3B82F6]"
          />
        </Row>
        <Row label="企业简介">
          <textarea
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            placeholder="选择知识库企业信息或上传企业信息文件后自动填充，也可手动编辑"
            className="w-full h-24 px-4 py-2.5 rounded-xl border border-[#ECEEF1] bg-white text-sm focus:outline-none focus:border-[#3B82F6] resize-none"
          />
        </Row>
      </Card>

      <Card title="资质 / 人员 / 业绩 / 财务" icon="folder_special">
        <Row label="资质证书">
          <ChipsField
            items={certs}
            onPick={() => setPicker({ kind: "certs" })}
            onRemove={(id) => setCerts((s) => s.filter((x) => x.id !== id))}
            pickLabel="从知识库选择"
            secondary={{ label: "上传文件", onClick: () => openUpload("certs", "上传资质证书") }}
          />
        </Row>
        <Row label="人员配置">
          <ChipsField
            items={staff}
            onPick={() => setPicker({ kind: "staff" })}
            onRemove={(id) => setStaff((s) => s.filter((x) => x.id !== id))}
            pickLabel="从知识库选择"
            secondary={{ label: "新增人员", onClick: () => openUpload("staff", "上传人员资料") }}
          />
        </Row>
        <Row label="类似业绩">
          <ChipsField
            items={cases}
            onPick={() => setPicker({ kind: "cases" })}
            onRemove={(id) => setCases((s) => s.filter((x) => x.id !== id))}
            pickLabel="从知识库选择"
            secondary={{ label: "新增业绩", onClick: () => openUpload("cases", "上传业绩资料") }}
            hint="建议选择与本项目类型一致的业绩"
          />
        </Row>
        <Row label="财务状况">
          <ChipsField
            items={financials}
            onPick={() => setPicker({ kind: "financials" })}
            onRemove={(id) => setFinancials((s) => s.filter((x) => x.id !== id))}
            pickLabel="从知识库选择"
            secondary={{
              label: "上传文件",
              onClick: () => openUpload("financials", "上传财务状况"),
            }}
            hint="可选择审计报告、财务报表或上传文件"
          />
        </Row>
      </Card>

      <Card title={schemeTemplateLabel.title} icon="upload_file" required>
        <div ref={respRef}>
          <p className="text-xs text-[#191c1e]/60 -mt-2 mb-2">{schemeTemplateLabel.upload}</p>
          <div className="flex flex-wrap gap-2 items-center mb-3">
            {templates.map((it) => (
              <span
                key={it.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#D4E3FF] text-[#3B82F6] text-xs font-semibold"
              >
                {it.title}
                <button
                  onClick={() => setTemplates((s) => s.filter((x) => x.id !== it.id))}
                  className="hover:text-[#FF4D4F]"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
            <button
              onClick={() => setPicker({ kind: "template" })}
              className="h-9 min-w-[132px] px-3 rounded-lg border border-[#3B82F6]/40 text-[#3B82F6] text-xs font-semibold hover:bg-[#D4E3FF]/40 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">library_books</span>
              选择知识库内容
            </button>
          </div>
          <UploadZone
            files={respFiles}
            onChange={setRespFiles}
            hint="支持 PDF / Word / Excel"
            onPreview={setPreviewFile}
          />
        </div>
        {showError && !schemeTemplateFilled && (
          <p className="text-xs text-[#FF4D4F] mt-2">{schemeTemplateLabel.required}</p>
        )}
      </Card>

      <div className="flex justify-between pt-2">
        <button
          onClick={onPrev}
          className="px-6 py-3 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-white flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          上一步
        </button>
        <button
          onClick={() => {
            if (!canNext) {
              setShowError(true);
              if (!company.trim()) {
                companyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                companyRef.current?.focus();
                return;
              }
              if (!schemeTemplateFilled)
                respRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            onNext();
          }}
          className="px-8 py-3 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] shadow-md flex items-center gap-2"
        >
          下一步：编写目录
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {picker && (
        <KbPickerDrawer
          open={!!picker}
          title={pickerConfig[picker.kind].title}
          items={pickerConfig[picker.kind].items}
          multi={pickerConfig[picker.kind].multi}
          initialSelected={pickerConfig[picker.kind].initial}
          groups={picker.kind === "template" ? templateGroups : undefined}
          onClose={() => setPicker(null)}
          onConfirm={pickerConfig[picker.kind].onConfirm}
        />
      )}
      {historyPicker && (
        <HistoryExtractDrawer
          onClose={() => setHistoryPicker(false)}
          onConfirm={(items) => {
            setTemplates((s) => [
              ...s,
              ...items.map((it) => ({ ...it, source: "history" as const })),
            ]);
            setHistoryPicker(false);
          }}
          onPreview={setPreviewFile}
        />
      )}
      {uploadModal && (
        <UploadConfirmDialog
          title={uploadModal.title}
          files={uploadFiles}
          onFilesChange={setUploadFiles}
          syncKb={syncKb}
          onSyncChange={setSyncKb}
          onClose={() => setUploadModal(null)}
          onConfirm={confirmUpload}
        />
      )}
      {previewFile && <FilePreviewDialog file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
}

function Card({
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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#3B82F6] text-[18px]">{icon}</span>
        </div>
        <h3 className="text-base font-bold">
          {title}
          {required && <span className="text-[#FF4D4F] ml-1">*</span>}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
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

function UploadConfirmDialog({
  title,
  files,
  onFilesChange,
  syncKb,
  onSyncChange,
  onClose,
  onConfirm,
}: {
  title: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  syncKb: boolean;
  onSyncChange: (v: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const done = files.some((f) => f.status === "已完成");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[86vh] overflow-auto shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <UploadZone
          files={files}
          onChange={onFilesChange}
          hint="支持 PDF / Word / Excel / 图片，上传后将自动解析"
        />
        <label className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7F9FC] text-sm font-semibold text-[#191c1e]/75 cursor-pointer">
          <input
            type="checkbox"
            checked={syncKb}
            onChange={(e) => onSyncChange(e.target.checked)}
            className="w-4 h-4 accent-[#3B82F6]"
          />
          同步保存至知识库
        </label>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC]"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={!done}
            className="px-5 py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] disabled:bg-[#F2F4F6] disabled:text-[#191c1e]/40"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryExtractDrawer({
  onClose,
  onConfirm,
  onPreview,
}: {
  onClose: () => void;
  onConfirm: (items: SelItem[]) => void;
  onPreview: (file: UploadedFile) => void;
}) {
  const [projectId, setProjectId] = useState(mockHistory[0]?.id ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const project = mockHistory.find((h) => h.id === projectId) ?? mockHistory[0];
  const files = [
    { id: "quality", title: "质量管理方案章节.docx" },
    { id: "implementation", title: "实施方案章节.docx" },
    { id: "safety", title: "安全管理方案章节.docx" },
    { id: "emergency", title: "应急预案章节.docx" },
  ];
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-[#ECEEF1] flex items-center justify-between">
          <h3 className="text-base font-bold">从历史标书提取</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4 flex-1 overflow-auto">
          <div>
            <div className="text-xs font-semibold text-[#191c1e]/60 mb-1.5">项目选择</div>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#ECEEF1] bg-[#F7F9FC] text-sm focus:outline-none focus:border-[#3B82F6]"
            >
              {mockHistory.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl bg-[#F7F9FC] p-4">
            <div className="text-sm font-bold text-[#191c1e]">{project?.name}</div>
            <div className="text-xs text-[#191c1e]/50 mt-1">创建时间：{project?.created}</div>
          </div>
          <div className="space-y-2">
            {files.map((file) => {
              const on = selected.has(file.id);
              return (
                <div
                  key={file.id}
                  className={
                    "rounded-xl border px-3 py-2.5 flex items-center gap-2 " +
                    (on ? "border-[#3B82F6] bg-[#D4E3FF]/30" : "border-[#ECEEF1]")
                  }
                >
                  <button
                    onClick={() => toggle(file.id)}
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                  >
                    <span
                      className={
                        "material-symbols-outlined text-[18px] " +
                        (on ? "text-[#3B82F6]" : "text-[#191c1e]/35")
                      }
                    >
                      {on ? "check_box" : "check_box_outline_blank"}
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      onPreview({ name: file.title, size: "1.20 MB", status: "已完成" })
                    }
                    className="flex-1 text-left text-sm font-semibold text-[#191c1e] hover:text-[#3B82F6] truncate"
                  >
                    {file.title}
                  </button>
                  <span className="material-symbols-outlined text-[#191c1e]/35 text-[16px]">
                    visibility
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#ECEEF1] flex justify-between items-center">
          <span className="text-xs text-[#191c1e]/60">已选 {selected.size} 项</span>
          <button
            onClick={() =>
              onConfirm(
                files
                  .filter((f) => selected.has(f.id))
                  .map((f) => ({ id: `history-${f.id}-${Date.now()}`, title: f.title })),
              )
            }
            disabled={selected.size === 0}
            className="px-5 py-2 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] disabled:bg-[#F2F4F6] disabled:text-[#191c1e]/40"
          >
            确认提取
          </button>
        </div>
      </div>
    </div>
  );
}

function FilePreviewDialog({ file, onClose }: { file: UploadedFile; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[84vh] flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-[#ECEEF1] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">{file.name}</h3>
            <p className="text-xs text-[#191c1e]/50 mt-0.5">{file.size} · 文件预览</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-[#F7F9FC] p-8">
          <div className="bg-white shadow-sm rounded-md mx-auto max-w-[460px] aspect-[1/1.414] p-8">
            <div className="text-xs text-center text-[#191c1e]/40 mb-5">文件内容预览</div>
            <div className="space-y-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded bg-[#ECEEF1]"
                  style={{ width: `${55 + ((i * 13) % 42)}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PickerField({
  selectedLabel,
  selectedSource,
  onPick,
  onClear,
  secondary,
  pickLabel = "从知识库引用",
}: {
  selectedLabel?: string;
  selectedSource?: "kb" | "upload" | "history";
  onPick: () => void;
  onClear: () => void;
  secondary?: { label: string; onClick: () => void };
  pickLabel?: string;
}) {
  if (selectedLabel) {
    const meta =
      selectedSource === "upload"
        ? {
            wrap: "border-[#DCEFD8] bg-[#F0FAF0]",
            icon: "upload_file",
            iconClass: "text-[#10B981]",
            badge: "上传文件",
            badgeClass: "bg-[#DCFCE7] text-[#15803D]",
          }
        : selectedSource === "history"
          ? {
              wrap: "border-[#FDECC8] bg-[#FFF8E7]",
              icon: "history",
              iconClass: "text-[#F59E0B]",
              badge: "历史标书",
              badgeClass: "bg-[#FEF3C7] text-[#B45309]",
            }
          : {
              wrap: "border-[#D4E3FF] bg-[#EEF4FF]",
              icon: "link",
              iconClass: "text-[#3B82F6]",
              badge: "知识库",
              badgeClass: "bg-[#D4E3FF] text-[#3B82F6]",
            };
    return (
      <div className={"flex items-center gap-2 px-3 py-2 rounded-xl border " + meta.wrap}>
        <span className={"material-symbols-outlined text-[14px] " + meta.iconClass}>
          {meta.icon}
        </span>
        <span
          className={
            "text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap " + meta.badgeClass
          }
        >
          {meta.badge}
        </span>
        <span className="flex-1 text-sm font-semibold text-[#191c1e] truncate">
          {selectedLabel}
        </span>
        <button onClick={onPick} className="text-xs font-semibold text-[#3B82F6] hover:underline">
          更换
        </button>
        <button onClick={onClear} className="text-xs text-[#191c1e]/50 hover:text-[#FF4D4F]">
          移除
        </button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <button
        onClick={onPick}
        className="h-10 min-w-[132px] px-3 rounded-xl border border-[#3B82F6]/40 text-[#3B82F6] text-sm font-semibold hover:bg-[#D4E3FF]/40 flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-[14px]">library_books</span>
        {pickLabel}
      </button>
      {secondary && (
        <button
          onClick={secondary.onClick}
          className="h-10 min-w-[132px] px-3 rounded-xl border border-[#ECEEF1] text-[#191c1e]/70 text-sm font-semibold hover:bg-[#F7F9FC] flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">upload</span>
          {secondary.label}
        </button>
      )}
    </div>
  );
}

function ChipsField({
  items,
  onPick,
  onRemove,
  pickLabel,
  secondary,
  hint,
}: {
  items: SelItem[];
  onPick: () => void;
  onRemove: (id: string) => void;
  pickLabel: string;
  secondary: { label: string; onClick: () => void };
  hint?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">
        {items.map((it) => (
          <span
            key={it.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#D4E3FF] text-[#3B82F6] text-xs font-semibold"
          >
            {it.title}
            <button onClick={() => onRemove(it.id)} className="hover:text-[#FF4D4F]">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}
        <button
          onClick={onPick}
          className="h-9 min-w-[116px] px-3 rounded-lg border border-[#3B82F6]/40 text-[#3B82F6] text-xs font-semibold hover:bg-[#D4E3FF]/40 flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">library_books</span>
          {pickLabel}
        </button>
        <button
          onClick={secondary.onClick}
          className="h-9 min-w-[116px] px-3 rounded-lg border border-[#ECEEF1] text-[#191c1e]/70 text-xs font-semibold hover:bg-[#F7F9FC] flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          {secondary.label}
        </button>
      </div>
      {hint && <p className="text-[11px] text-[#191c1e]/50 mt-2">{hint}</p>}
    </div>
  );
}
