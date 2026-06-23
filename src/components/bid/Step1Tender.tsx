import { useEffect, useState } from "react";
import { UploadZone, type UploadedFile } from "./UploadZone";
import { ParsingProgress, type ParseStep } from "./ParsingProgress";
import { SourceViewer } from "./SourceViewer";

const tabs = [
  { key: "overview", label: "项目概况" },
  { key: "qualify", label: "资格要求" },
  { key: "preEval", label: "初步评审标准" },
  { key: "scoring", label: "评分标准" },
  { key: "tech", label: "重点响应要求" },
  { key: "risk", label: "风险提示" },
  { key: "timeline", label: "关键时间节点" },
  { key: "other", label: "其他关键信息" },
];

const parseSteps: ParseStep[] = [
  { key: "overview", label: "正在提取项目概况……" },
  { key: "qualify", label: "正在识别资格要求……" },
  { key: "preEval", label: "正在解析初步评审标准……" },
  { key: "scoring", label: "正在解析评分标准……" },
  { key: "tech", label: "正在识别重点响应要求……" },
  { key: "risk", label: "正在分析风险提示……" },
  { key: "timeline", label: "正在提取关键时间节点……" },
  { key: "other", label: "正在整理其他关键信息……" },
];

type SourceHit = { page: number; title: string };

const sourcePages: Record<string, SourceHit[]> = {
  overview: [
    { page: 1, title: "项目概况" },
    { page: 2, title: "采购范围" },
    { page: 4, title: "项目背景" },
  ],
  qualify: [
    { page: 5, title: "投标人资格要求" },
    { page: 6, title: "资格证明材料" },
    { page: 9, title: "联合体要求" },
  ],
  preEval: [
    { page: 8, title: "初步评审标准" },
    { page: 10, title: "形式评审" },
    { page: 11, title: "响应性评审" },
  ],
  scoring: [
    { page: 12, title: "评分标准" },
    { page: 13, title: "技术评分" },
    { page: 15, title: "商务评分" },
  ],
  tech: [
    { page: 18, title: "技术响应要求" },
    { page: 19, title: "平台能力要求" },
    { page: 21, title: "服务要求" },
  ],
  risk: [
    { page: 22, title: "废标条款" },
    { page: 23, title: "无效投标情形" },
    { page: 25, title: "保证金要求" },
  ],
  timeline: [
    { page: 3, title: "关键时间节点" },
    { page: 7, title: "答疑安排" },
    { page: 31, title: "开标安排" },
  ],
  other: [
    { page: 28, title: "其他条款" },
    { page: 29, title: "付款方式" },
    { page: 30, title: "履约保证金" },
  ],
};

const defaultContent: Record<string, string> = {
  overview:
    "招标项目名称：XX市政务云平台建设项目\n招标人：XX市信息化办公室\n委托人：xxxxxx公司\n招标编号：YZN0-FW-GKZB\n投标截止时间：2026-07-15 09:30\n开标时间：2026-07-15 10:00\n项目地点：XX市\n\n招标项目概况：本项目旨在建设统一的政务云平台，提供 IaaS / PaaS / SaaS 三层服务能力，支撑全市各委办局信息系统的迁移与新建。",
  scoring: "",
  qualify:
    "1. 投标人须为中华人民共和国境内依法注册的独立法人；\n2. 具有 ISO9001、ISO20000、ISO27001 体系认证；\n3. 具有 CMMI 3 级及以上软件能力成熟度认证；\n4. 近 3 年（2023-2025）无重大违法记录；\n5. 注册资本不少于人民币 1000 万元。",
  tech:
    "1. 计算资源：≥ 200 台虚拟机能力（需逐项响应）；\n2. 存储资源：≥ 500TB 高性能存储；\n3. 网络：双链路冗余，带宽 ≥ 10Gbps；\n4. 安全：通过等保三级测评；\n5. 平台兼容主流国产芯片与操作系统；\n6. 服务承诺：7×24 现场支持，故障响应 ≤ 30 分钟。",
  risk:
    "⚠️ 风险提示：\n• 投标文件未加盖公章 → 直接废标\n• 报价高于最高限价 → 直接废标\n• 资格证明文件缺失 → 直接废标\n• 投标保证金未按时缴纳 → 直接废标\n• 法人代表授权书未签字 → 直接废标",
  timeline: "",
  other: "",
};

const defaultTimeline: { label: string; time: string }[] = [
  { label: "招标公告发布时间", time: "2026-06-20 09:00" },
  { label: "答疑截止时间", time: "2026-07-05 17:00" },
  { label: "投标截止时间", time: "2026-07-15 09:30" },
  { label: "开标时间", time: "2026-07-15 10:00" },
  { label: "中标公示时间", time: "2026-07-22 18:00" },
];

type ScoreRow = { item: string; max: number; rule: string };
type ScoreRowC = ScoreRow & { consistency: boolean };
type PriceRow = { item: string; rule: string };
type ScoreGroups = { tech: ScoreRowC[]; business: ScoreRowC[]; price: PriceRow[] };
const defaultScoring: ScoreGroups = {
  tech: [
    { item: "总体技术方案", max: 15, rule: "架构合理、可扩展性强得满分，逐项扣分", consistency: true },
    { item: "核心模块设计", max: 10, rule: "模块完整、设计清晰得满分", consistency: true },
    { item: "安全方案", max: 8, rule: "通过等保三级 + 数据加密方案", consistency: false },
    { item: "项目案例", max: 7, rule: "近 3 年 ≥ 500 万案例，每个 2 分", consistency: false },
  ],
  business: [
    { item: "公司资质", max: 5, rule: "ISO9001/20000/27001 各 1 分，CMMI3 2 分", consistency: true },
    { item: "售后服务", max: 5, rule: "7×24 现场支持得满分", consistency: false },
    { item: "付款条款", max: 5, rule: "接受分期付款得满分", consistency: false },
  ],
  price: [
    { item: "投标报价", rule: "低于评标基准价按线性扣分" },
    { item: "报价完整性", rule: "清单齐全无漏项得满分" },
  ],
};

type PreEvalRow = { factor: string; standard: string; mustRespond: boolean; module: "形式评审标准" | "资格评审标准" | "响应性评审标准" };
const defaultPreEval: PreEvalRow[] = [
  { factor: "投标文件签署", standard: "投标函由法定代表人或授权人签字并加盖单位公章", mustRespond: true, module: "形式评审标准" },
  { factor: "投标文件格式", standard: "按招标文件要求的格式编制，内容完整", mustRespond: true, module: "形式评审标准" },
  { factor: "投标人资格", standard: "具备独立法人资格，营业执照在有效期内", mustRespond: true, module: "资格评审标准" },
  { factor: "体系认证", standard: "具有 ISO9001 / ISO20000 / ISO27001 体系认证", mustRespond: true, module: "资格评审标准" },
  { factor: "投标报价", standard: "未超过最高限价且报价唯一", mustRespond: true, module: "响应性评审标准" },
  { factor: "投标有效期", standard: "投标有效期满足招标文件要求", mustRespond: true, module: "响应性评审标准" },
];

export function Step1Tender({
  onNext,
}: {
  onNext: () => void;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [content, setContent] = useState<Record<string, string>>(defaultContent);
  const [scoring, setScoring] = useState<ScoreGroups>(defaultScoring);
  const [timeline, setTimeline] = useState(defaultTimeline);
  const [preEval, setPreEval] = useState<PreEvalRow[]>(defaultPreEval);
  const [editing, setEditing] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [reparsing, setReparsing] = useState(false);
  const [initialParsing, setInitialParsing] = useState(false);
  const [parsedOnce, setParsedOnce] = useState(false);
  const [viewingSource, setViewingSource] = useState<null | { hits: SourceHit[]; index: number; fileName: string }>(null);

  const hasParsed = files.some((f) => f.status === "已完成");

  // Trigger initial parsing progress when first file completes
  useEffect(() => {
    if (hasParsed && !parsedOnce && !initialParsing) {
      setInitialParsing(true);
    }
    if (!hasParsed) {
      setParsedOnce(false);
      setViewingSource(null);
    }
  }, [hasParsed, parsedOnce, initialParsing]);

  const handleReparse = () => {
    setReparsing(true);
    setViewingSource(null);
    setTimeout(() => {
      setContent(defaultContent);
      setScoring(defaultScoring);
      setTimeline(defaultTimeline);
      setPreEval(defaultPreEval);
      setReparsing(false);
    }, parseSteps.length * 380 + 200);
  };

  const showProgress = initialParsing || reparsing;
  const firstFileName = files.find((f) => f.status === "已完成")?.name ?? "招标文件.pdf";
  const currentSource = viewingSource?.hits[viewingSource.index];
  const shiftSource = (dir: -1 | 1) => {
    setViewingSource((s) => {
      if (!s) return s;
      const next = (s.index + dir + s.hits.length) % s.hits.length;
      return { ...s, index: next };
    });
  };

  const ResultPanel = (
    <>
      <div className="flex gap-1 border-b border-[#ECEEF1] mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={
              "px-3 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px " +
              (activeTab === t.key
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#191c1e]/60 hover:text-[#3B82F6]")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      {showProgress ? (
        <ParsingProgress
          key={reparsing ? "re" : "init"}
          steps={parseSteps}
          onDone={() => {
            setInitialParsing(false);
            setParsedOnce(true);
          }}
        />
      ) : (
      <>
      <div className="flex items-center justify-end mb-2 -mt-2">
        <button
          onClick={() =>
            setViewingSource({
              hits: sourcePages[activeTab],
              index: 0,
              fileName: firstFileName,
            })
          }
          className="text-xs font-semibold text-[#3B82F6] hover:bg-[#D4E3FF]/50 flex items-center gap-1 px-2 py-1 rounded-md"
        >
          <span className="material-symbols-outlined text-[14px]">link</span>
          查看来源
        </button>
      </div>
      {activeTab === "scoring" ? (
        <ScoringTables value={scoring} onChange={setScoring} editable={editing} />
      ) : activeTab === "timeline" ? (
        <TimelinePanel value={timeline} onChange={setTimeline} editable={editing} />
      ) : activeTab === "preEval" ? (
        <PreEvalTable value={preEval} onChange={setPreEval} editable={editing} />
      ) : activeTab === "other" && !content.other.trim() ? (
        <div className="bg-[#F7F9FC] rounded-2xl p-5 min-h-96 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#ECEEF1] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[#191c1e]/30 text-[26px]">inbox</span>
          </div>
          <p className="text-sm text-[#191c1e]/55">暂无其他关键信息</p>
          {editing && (
            <p className="text-xs text-[#191c1e]/40 mt-1">点击下方区域可补充录入</p>
          )}
          {editing && (
            <textarea
              value={content.other}
              onChange={(e) => setContent({ ...content, other: e.target.value })}
              placeholder="可在此补充其他关键信息…"
              className="mt-4 w-full max-w-md h-32 px-3 py-2 rounded-xl border border-[#ECEEF1] bg-white text-sm focus:outline-none focus:border-[#3B82F6] resize-none"
            />
          )}
        </div>
      ) : editing ? (
        <textarea
          value={content[activeTab]}
          onChange={(e) =>
            setContent({ ...content, [activeTab]: e.target.value })
          }
          className="w-full h-96 px-4 py-3 rounded-xl border border-[#3B82F6]/40 bg-white text-sm focus:outline-none focus:border-[#3B82F6] resize-none font-mono leading-relaxed"
        />
      ) : (
        <div className={"bg-[#F7F9FC] rounded-2xl p-5 text-sm text-[#191c1e]/80 whitespace-pre-wrap min-h-96 " + (activeTab === "overview" ? "leading-6" : "leading-relaxed")}>
          {content[activeTab]}
        </div>
      )}
      </>
      )}
    </>
  );

  const ActionButtons = (
    <div className="flex items-center gap-2">
      <button
        onClick={handleReparse}
        disabled={reparsing}
        className="text-xs font-semibold text-[#191c1e]/60 hover:text-[#3B82F6] flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F2F4F6] transition-all disabled:opacity-50"
        title="重新解析"
      >
        <span className={"material-symbols-outlined text-[14px] " + (reparsing ? "animate-spin" : "")}>
          autorenew
        </span>
        {reparsing ? "解析中..." : "重新解析"}
      </button>
      <button
        onClick={() => setEditing((v) => !v)}
        className={
          "text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all " +
          (editing ? "bg-[#3B82F6] text-white" : "text-[#3B82F6] hover:bg-[#D4E3FF]/50")
        }
      >
        <span className="material-symbols-outlined text-[14px]">
          {editing ? "check" : "edit"}
        </span>
        {editing ? "完成" : "编辑"}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左：上传 40% */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6 flex flex-col">
          {viewingSource ? (
            <SourceViewer
              fileName={viewingSource.fileName}
              page={currentSource?.page ?? 1}
              hintTitle={currentSource?.title ?? "来源位置"}
              index={viewingSource.index}
              total={viewingSource.hits.length}
              onPrevSource={() => shiftSource(-1)}
              onNextSource={() => shiftSource(1)}
              onClose={() => setViewingSource(null)}
            />
          ) : (
          <>
          <h3 className="text-lg font-bold mb-1">招标文件上传</h3>
          <p className="text-xs text-[#191c1e]/60 mb-4">
            支持上传 PDF / Word / 图片，AI 自动解析关键信息
          </p>
          <UploadZone
            files={files}
            onChange={setFiles}
            hint="支持 PDF / Word / 图片，单个 ≤ 50MB"
            accept=".pdf,.doc,.docx,image/*"
          />

          {/* 能力说明卡片，填充左侧视觉 */}
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#EEF4FF] to-[#F7F9FC] border border-[#D4E3FF]/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">
                auto_awesome
              </span>
              <h4 className="text-sm font-bold text-[#191c1e]">AI 将为你识别</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { i: "info", t: "项目概述", d: "采购人、预算、关键时间节点" },
                { i: "scoreboard", t: "评分标准", d: "技术 / 商务 / 报价三类评分项" },
                { i: "verified_user", t: "资格要求", d: "资质、业绩、财务等准入条件" },
                { i: "build", t: "技术要求", d: "功能、性能、安全等硬性指标" },
                { i: "warning", t: "风险提示", d: "高频废标点提前预警" },
              ].map((it) => (
                <div key={it.t} className="bg-white/70 border border-[#D4E3FF]/60 rounded-xl px-2.5 py-2 flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#3B82F6] text-[14px] shrink-0">
                    {it.i}
                  </span>
                  <span className="text-[12px] font-semibold text-[#191c1e] truncate">{it.t}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#D4E3FF]/60 flex items-center gap-2 text-[11px] text-[#191c1e]/60">
              <span className="material-symbols-outlined text-[12px] text-[#10B981]">lock</span>
              文件加密传输，仅用于本次解析
            </div>
          </div>
          </>
          )}
        </div>

        {/* 右：解析结果 60% */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm p-6 min-h-[520px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">AI 解析结果</h3>
              <p className="text-xs text-[#191c1e]/60 mt-0.5">
                {hasParsed
                  ? "已识别招标文件关键信息，可直接编辑修改"
                  : "上传招标文件后将在此显示解析结果"}
              </p>
            </div>
            {hasParsed && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(true)}
                  className="text-xs font-semibold text-[#191c1e]/60 hover:text-[#3B82F6] flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F2F4F6] transition-all"
                  title="放大查看"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    open_in_full
                  </span>
                  放大
                </button>
                {ActionButtons}
              </div>
            )}
          </div>

          {!hasParsed ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F2F4F6] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#191c1e]/30 text-[32px]">
                  description
                </span>
              </div>
              <p className="text-sm text-[#191c1e]/50">
                请先上传招标文件
              </p>
            </div>
          ) : (
            ResultPanel
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!hasParsed}
          className={
            "px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all " +
            (hasParsed
              ? "bg-[#3B82F6] text-white hover:bg-[#3F6DF0] shadow-md hover:shadow-lg"
              : "bg-[#F2F4F6] text-[#191c1e]/40 cursor-not-allowed")
          }
        >
          下一步：基础设置
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>

      {zoom && hasParsed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-[#ECEEF1] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">招标文件AI解析结果</h3>
                <p className="text-xs text-[#191c1e]/60 mt-0.5">可放大查看与编辑</p>
              </div>
              <div className="flex items-center gap-2">
                {ActionButtons}
                <button
                  onClick={() => setZoom(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              {viewingSource ? (
                <div className="grid grid-cols-12 gap-5 h-full">
                  <div className="col-span-5 min-h-0">
                    <SourceViewer
                      fileName={viewingSource.fileName}
                      page={currentSource?.page ?? 1}
                      hintTitle={currentSource?.title ?? "来源位置"}
                      index={viewingSource.index}
                      total={viewingSource.hits.length}
                      onPrevSource={() => shiftSource(-1)}
                      onNextSource={() => shiftSource(1)}
                      onClose={() => setViewingSource(null)}
                    />
                  </div>
                  <div className="col-span-7 overflow-auto">{ResultPanel}</div>
                </div>
              ) : (
                <div className="h-full overflow-auto">{ResultPanel}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoringTables({
  value,
  onChange,
  editable,
}: {
  value: ScoreGroups;
  onChange: (v: ScoreGroups) => void;
  editable: boolean;
}) {
  const updateScored = (k: "tech" | "business", idx: number, patch: Partial<ScoreRowC>) =>
    onChange({ ...value, [k]: value[k].map((r, i) => (i === idx ? { ...r, ...patch } : r)) });
  const updatePrice = (idx: number, patch: Partial<PriceRow>) =>
    onChange({ ...value, price: value.price.map((r, i) => (i === idx ? { ...r, ...patch } : r)) });
  const addScored = (k: "tech" | "business") =>
    onChange({ ...value, [k]: [...value[k], { item: "新增项", max: 0, rule: "", consistency: false }] });
  const addPrice = () =>
    onChange({ ...value, price: [...value.price, { item: "新增项", rule: "" }] });
  const removeScored = (k: "tech" | "business", idx: number) =>
    onChange({ ...value, [k]: value[k].filter((_, i) => i !== idx) });
  const removePrice = (idx: number) =>
    onChange({ ...value, price: value.price.filter((_, i) => i !== idx) });

  const scoredGroups: { key: "tech" | "business"; title: string; color: string }[] = [
    { key: "tech", title: "技术评分标准", color: "#3B82F6" },
    { key: "business", title: "商务评分标准", color: "#10B981" },
  ];

  return (
    <div className="space-y-5">
      {scoredGroups.map((g) => {
        const total = value[g.key].reduce((s, r) => s + (Number(r.max) || 0), 0);
        return (
          <div key={g.key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1 h-4 rounded-full" style={{ background: g.color }} />
                <h4 className="text-sm font-bold text-[#191c1e]">{g.title}</h4>
                <span className="text-xs text-[#191c1e]/50">合计 {total} 分</span>
              </div>
              {editable && (
                <button onClick={() => addScored(g.key)} className="text-xs font-semibold text-[#3B82F6] hover:bg-[#D4E3FF]/50 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span>新增
                </button>
              )}
            </div>
            <div className="bg-[#F7F9FC] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-[#191c1e]/60 uppercase tracking-wider">
                    <th className="text-left px-3 py-2.5 w-10">#</th>
                    <th className="text-left px-3 py-2.5 w-36">评分项</th>
                    <th className="text-left px-3 py-2.5 w-14">分值</th>
                    <th className="text-left px-3 py-2.5">评分细则</th>
                    <th className="text-left px-3 py-2.5 w-24">一致性打分</th>
                    {editable && <th className="w-10" />}
                  </tr>
                </thead>
                <tbody>
                  {value[g.key].map((r, i) => (
                    <tr key={i} className="border-t border-[#ECEEF1] align-top">
                      <td className="px-3 py-2 text-[#191c1e]/60">{i + 1}</td>
                      <td className="px-2 py-2"><Cell editable={editable} value={r.item} onChange={(v) => updateScored(g.key, i, { item: v })} /></td>
                      <td className="px-2 py-2"><Cell editable={editable} value={String(r.max)} onChange={(v) => updateScored(g.key, i, { max: +v || 0 })} numeric /></td>
                      <td className="px-2 py-2"><Cell editable={editable} value={r.rule} onChange={(v) => updateScored(g.key, i, { rule: v })} /></td>
                      <td className="px-2 py-2">
                        {editable ? (
                          <select value={r.consistency ? "是" : "否"} onChange={(e) => updateScored(g.key, i, { consistency: e.target.value === "是" })}
                            className="px-2 py-1 rounded-md bg-white border border-[#ECEEF1] text-sm focus:outline-none focus:border-[#3B82F6]">
                            <option>是</option><option>否</option>
                          </select>
                        ) : (
                          <span className="text-sm text-[#191c1e]/80">{r.consistency ? "是" : "否"}</span>
                        )}
                      </td>
                      {editable && (
                        <td className="px-2 py-2">
                          <button onClick={() => removeScored(g.key, i)} className="w-7 h-7 rounded-md text-[#191c1e]/40 hover:bg-red-50 hover:text-[#FF4D4F] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* 报价评分标准 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1 h-4 rounded-full" style={{ background: "#F59E0B" }} />
            <h4 className="text-sm font-bold text-[#191c1e]">报价评分标准</h4>
          </div>
          {editable && (
            <button onClick={addPrice} className="text-xs font-semibold text-[#3B82F6] hover:bg-[#D4E3FF]/50 px-2 py-1 rounded-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">add</span>新增
            </button>
          )}
        </div>
        <div className="bg-[#F7F9FC] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-[#191c1e]/60 uppercase tracking-wider">
                <th className="text-left px-3 py-2.5 w-10">#</th>
                <th className="text-left px-3 py-2.5 w-40">评分项</th>
                <th className="text-left px-3 py-2.5">评分细则</th>
                {editable && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {value.price.map((r, i) => (
                <tr key={i} className="border-t border-[#ECEEF1] align-top">
                  <td className="px-3 py-2 text-[#191c1e]/60">{i + 1}</td>
                  <td className="px-2 py-2"><Cell editable={editable} value={r.item} onChange={(v) => updatePrice(i, { item: v })} /></td>
                  <td className="px-2 py-2"><Cell editable={editable} value={r.rule} onChange={(v) => updatePrice(i, { rule: v })} /></td>
                  {editable && (
                    <td className="px-2 py-2">
                      <button onClick={() => removePrice(i)} className="w-7 h-7 rounded-md text-[#191c1e]/40 hover:bg-red-50 hover:text-[#FF4D4F] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PreEvalTable({
  value,
  onChange,
  editable,
}: {
  value: PreEvalRow[];
  onChange: (v: PreEvalRow[]) => void;
  editable: boolean;
}) {
  const modules: PreEvalRow["module"][] = ["形式评审标准", "资格评审标准", "响应性评审标准"];
  const update = (i: number, patch: Partial<PreEvalRow>) =>
    onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => onChange([...value, { factor: "新增因素", standard: "", mustRespond: true, module: "形式评审标准" }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1 h-4 rounded-full bg-[#3B82F6]" />
          <h4 className="text-sm font-bold text-[#191c1e]">初步评审标准</h4>
          <span className="text-xs text-[#191c1e]/50">共 {value.length} 项</span>
        </div>
        {editable && (
          <button onClick={add} className="text-xs font-semibold text-[#3B82F6] hover:bg-[#D4E3FF]/50 px-2 py-1 rounded-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">add</span>新增
          </button>
        )}
      </div>
      <div className="bg-[#F7F9FC] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-[#191c1e]/60 uppercase tracking-wider">
              <th className="text-left px-3 py-2.5 w-10">#</th>
              <th className="text-left px-3 py-2.5 w-32">评审因素</th>
              <th className="text-left px-3 py-2.5">评审标准</th>
              <th className="text-left px-3 py-2.5 w-28">必须响应</th>
              <th className="text-left px-3 py-2.5 w-32">模块</th>
              {editable && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {value.map((r, i) => (
              <tr key={i} className="border-t border-[#ECEEF1] align-top">
                <td className="px-3 py-2 text-[#191c1e]/60">{i + 1}</td>
                <td className="px-2 py-2"><Cell editable={editable} value={r.factor} onChange={(v) => update(i, { factor: v })} /></td>
                <td className="px-2 py-2"><Cell editable={editable} value={r.standard} onChange={(v) => update(i, { standard: v })} /></td>
                <td className="px-2 py-2">
                  {editable ? (
                    <select value={r.mustRespond ? "是" : "否"} onChange={(e) => update(i, { mustRespond: e.target.value === "是" })}
                      className="px-2 py-1 rounded-md bg-white border border-[#ECEEF1] text-sm focus:outline-none focus:border-[#3B82F6]">
                      <option>是</option><option>否</option>
                    </select>
                  ) : (
                    <span className="text-sm text-[#191c1e]/80">{r.mustRespond ? "是" : "否"}</span>
                  )}
                </td>
                <td className="px-2 py-2">
                  {editable ? (
                    <select value={r.module} onChange={(e) => update(i, { module: e.target.value as PreEvalRow["module"] })}
                      className="px-2 py-1 rounded-md bg-white border border-[#ECEEF1] text-sm focus:outline-none focus:border-[#3B82F6]">
                      {modules.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  ) : (
                    <span className="text-sm text-[#191c1e]/80">{r.module}</span>
                  )}
                </td>
                {editable && (
                  <td className="px-2 py-2">
                    <button onClick={() => remove(i)} className="w-7 h-7 rounded-md text-[#191c1e]/40 hover:bg-red-50 hover:text-[#FF4D4F] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({
  value,
  onChange,
  editable,
  numeric,
}: {
  value: string;
  onChange: (v: string) => void;
  editable: boolean;
  numeric?: boolean;
}) {
  if (!editable) return <span className="text-sm text-[#191c1e]/80">{value}</span>;
  return (
    <input
      type={numeric ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1 rounded-md bg-white border border-[#ECEEF1] text-sm focus:outline-none focus:border-[#3B82F6]"
    />
  );
}

function TimelinePanel({
  value,
  onChange,
  editable,
}: {
  value: { label: string; time: string }[];
  onChange: (v: { label: string; time: string }[]) => void;
  editable: boolean;
}) {
  const update = (i: number, patch: Partial<{ label: string; time: string }>) =>
    onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  return (
    <div className="bg-[#F7F9FC] rounded-2xl p-6 min-h-96">
      <ol className="relative">
        <span className="absolute left-[11px] top-2 bottom-2 w-px bg-[#D4E3FF]" />
        {value.map((it, i) => (
          <li key={i} className="relative pl-9 pb-5 last:pb-0">
            <span className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-white border-2 border-[#3B82F6] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            </span>
            {editable ? (
              <div className="flex flex-col gap-1.5">
                <input
                  value={it.label}
                  onChange={(e) => update(i, { label: e.target.value })}
                  className="px-2 py-1 rounded-md bg-white border border-[#ECEEF1] text-sm font-bold focus:outline-none focus:border-[#3B82F6]"
                />
                <input
                  value={it.time}
                  onChange={(e) => update(i, { time: e.target.value })}
                  className="px-2 py-1 rounded-md bg-white border border-[#ECEEF1] text-sm focus:outline-none focus:border-[#3B82F6] w-56"
                />
              </div>
            ) : (
              <>
                <div className="text-sm font-bold text-[#191c1e]">{it.label}</div>
                <div className="text-xs text-[#191c1e]/60 mt-0.5">{it.time}</div>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
