import { useState } from "react";

type SubSub = { id: string; name: string };
type Sub = { id: string; name: string; subs: SubSub[] };
type Chapter = { id: string; name: string; pages: number; subs: Sub[] };
type PendingDelete =
  | { kind: "chapter"; cid: string }
  | { kind: "sub"; cid: string; sid: string }
  | { kind: "subSub"; cid: string; sid: string; ssid: string };

const cnNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
function cn(n: number): string {
  if (n <= 10) return cnNums[n];
  if (n < 20) return "十" + cnNums[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return cnNums[t] + "十" + (o ? cnNums[o] : "");
}

let _uid = 1000;
const uid = () => "n" + ++_uid;

const defaultOutline: Chapter[] = [
  {
    id: uid(), name: "项目概述", pages: 8,
    subs: [
      { id: uid(), name: "项目背景", subs: [
        { id: uid(), name: "行业现状" },
        { id: uid(), name: "建设必要性" },
      ] },
      { id: uid(), name: "项目目标", subs: [] },
      { id: uid(), name: "建设范围", subs: [] },
    ],
  },
  {
    id: uid(), name: "技术方案", pages: 25,
    subs: [
      { id: uid(), name: "总体架构设计", subs: [
        { id: uid(), name: "架构原则" },
        { id: uid(), name: "技术选型" },
      ] },
      { id: uid(), name: "核心模块设计", subs: [] },
      { id: uid(), name: "数据安全方案", subs: [] },
      { id: uid(), name: "接口设计", subs: [] },
    ],
  },
  {
    id: uid(), name: "项目实施", pages: 15,
    subs: [
      { id: uid(), name: "实施计划", subs: [] },
      { id: uid(), name: "团队组织", subs: [] },
      { id: uid(), name: "风险控制", subs: [] },
    ],
  },
  {
    id: uid(), name: "服务与培训", pages: 12,
    subs: [
      { id: uid(), name: "售后服务", subs: [] },
      { id: uid(), name: "培训方案", subs: [] },
    ],
  },
  {
    id: uid(), name: "商务条款", pages: 10,
    subs: [
      { id: uid(), name: "报价说明", subs: [] },
      { id: uid(), name: "付款方式", subs: [] },
      { id: uid(), name: "合同条款", subs: [] },
    ],
  },
  {
    id: uid(), name: "资质证明", pages: 10,
    subs: [
      { id: uid(), name: "公司资质", subs: [] },
      { id: uid(), name: "项目案例", subs: [] },
    ],
  },
];

const tenderTabs = [
  { key: "source", label: "招标文件.pdf" },
  { key: "overview", label: "项目概述" },
  { key: "scoring", label: "评分标准" },
  { key: "qualify", label: "资格要求" },
  { key: "tech", label: "技术要求" },
  { key: "risk", label: "风险提示" },
  { key: "other", label: "其他关键信息" },
];

const tenderContent: Record<string, string> = {
  overview:
    "项目名称：XX市政务云平台建设项目\n采购人：XX市信息化办公室\n预算金额：1,200万元\n投标截止时间：2026-07-15 09:30\n开标时间：2026-07-15 10:00\n项目地点：XX市\n\n项目概述：本项目旨在建设统一的政务云平台，提供 IaaS / PaaS / SaaS 三层服务能力，支撑全市各委办局信息系统的迁移与新建。",
  qualify:
    "1. 投标人须为中华人民共和国境内依法注册的独立法人；\n2. 具有 ISO9001、ISO20000、ISO27001 体系认证；\n3. 具有 CMMI 3 级及以上软件能力成熟度认证；\n4. 近 3 年（2023-2025）无重大违法记录；\n5. 注册资本不少于人民币 1000 万元。",
  tech:
    "1. 计算资源：≥ 200 台虚拟机能力；\n2. 存储资源：≥ 500TB 高性能存储；\n3. 网络：双链路冗余，带宽 ≥ 10Gbps；\n4. 安全：通过等保三级测评；\n5. 平台兼容主流国产芯片与操作系统。",
  risk:
    "⚠️ 高风险点：\n• 投标文件未加盖公章 → 直接废标\n• 报价高于最高限价 → 直接废标\n• 资格证明文件缺失 → 直接废标\n• 投标保证金未按时缴纳 → 直接废标\n• 法人代表授权书未签字 → 直接废标",
  other:
    "• 投标保证金：人民币 20 万元，须于投标截止前 24 小时到账；\n• 履约保证金：合同金额的 5%；\n• 质保期：3 年；\n• 付款方式：分期支付，验收合格后支付 90%，质保期满支付剩余 10%。",
};

const tenderScoring = {
  tech: [
    { item: "总体技术方案", max: 15, rule: "架构合理、可扩展性强得满分，逐项扣分" },
    { item: "核心模块设计", max: 10, rule: "模块完整、设计清晰得满分" },
    { item: "安全方案", max: 8, rule: "通过等保三级 + 数据加密方案" },
    { item: "项目案例", max: 7, rule: "近 3 年 ≥ 500 万案例，每个 2 分" },
  ],
  business: [
    { item: "公司资质", max: 5, rule: "ISO9001/20000/27001 各 1 分，CMMI3 2 分" },
    { item: "售后服务", max: 5, rule: "7×24 现场支持得满分" },
    { item: "付款条款", max: 5, rule: "接受分期付款得满分" },
  ],
  price: [
    { item: "投标报价", max: 30, rule: "低于评标基准价按线性扣分" },
    { item: "报价完整性", max: 5, rule: "清单齐全无漏项得满分" },
  ],
};

export function Step3Outline({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  const [outline, setOutline] = useState<Chapter[]>(defaultOutline);
  const [tab, setTab] = useState("overview");
  const [preview, setPreview] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultOutline.map(c => c.id)));
  const [regenerating, setRegenerating] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [toast, setToast] = useState<null | { kind: "success" | "error"; msg: string }>(null);

  const showToast = (kind: "success" | "error", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 2200);
  };
  const handleRegenerate = () => {
    setConfirmRegenerate(false);
    setRegenerating(true);
    setTimeout(() => {
      setOutline(defaultOutline);
      setExpanded(new Set(defaultOutline.map((c) => c.id)));
      setRegenerating(false);
      showToast("success", "目录已重新生成");
    }, 1400);
  };
  const handleDownload = () => showToast("success", "目录下载成功");

  const totalSubs = outline.reduce(
    (s, c) => s + c.subs.length + c.subs.reduce((a, b) => a + b.subs.length, 0),
    0
  );
  const totalPages = outline.reduce((s, c) => s + c.pages, 0);

  const toggleExpand = (id: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const updateChapter = (id: string, patch: Partial<Chapter>) =>
    setOutline((arr) => arr.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const updateSub = (cid: string, sid: string, patch: Partial<Sub>) =>
    setOutline((arr) => arr.map((c) => c.id !== cid ? c : { ...c, subs: c.subs.map(s => s.id === sid ? { ...s, ...patch } : s) }));
  const updateSubSub = (cid: string, sid: string, ssid: string, patch: Partial<SubSub>) =>
    setOutline((arr) => arr.map((c) => c.id !== cid ? c : { ...c, subs: c.subs.map(s => s.id !== sid ? s : { ...s, subs: s.subs.map(ss => ss.id === ssid ? { ...ss, ...patch } : ss) }) }));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= outline.length) return;
    const arr = [...outline];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setOutline(arr);
  };
  const moveSub = (cid: string, idx: number, dir: -1 | 1) =>
    setOutline(arr => arr.map(c => {
      if (c.id !== cid) return c;
      const j = idx + dir;
      if (j < 0 || j >= c.subs.length) return c;
      const ns = [...c.subs];
      [ns[idx], ns[j]] = [ns[j], ns[idx]];
      return { ...c, subs: ns };
    }));
  const deleteChapter = (id: string) => setOutline(arr => arr.filter(c => c.id !== id));
  const deleteSub = (cid: string, sid: string) =>
    setOutline(arr => arr.map(c => c.id !== cid ? c : { ...c, subs: c.subs.filter(s => s.id !== sid) }));
  const deleteSubSub = (cid: string, sid: string, ssid: string) =>
    setOutline(arr => arr.map(c => c.id !== cid ? c : { ...c, subs: c.subs.map(s => s.id !== sid ? s : { ...s, subs: s.subs.filter(x => x.id !== ssid) }) }));
  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "chapter") deleteChapter(pendingDelete.cid);
    if (pendingDelete.kind === "sub") deleteSub(pendingDelete.cid, pendingDelete.sid);
    if (pendingDelete.kind === "subSub") deleteSubSub(pendingDelete.cid, pendingDelete.sid, pendingDelete.ssid);
    setPendingDelete(null);
  };

  const addSub = (cid: string) =>
    setOutline(arr => arr.map(c => c.id !== cid ? c : { ...c, subs: [...c.subs, { id: uid(), name: "新增小节", subs: [] }] }));
  const addSubSub = (cid: string, sid: string) =>
    setOutline(arr => arr.map(c => c.id !== cid ? c : { ...c, subs: c.subs.map(s => s.id !== sid ? s : { ...s, subs: [...s.subs, { id: uid(), name: "新增条目" }] }) }));

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
        <span className="material-symbols-outlined text-amber-600 text-[18px] leading-none mt-0.5 shrink-0">
          info
        </span>
        <p className="m-0 text-sm leading-relaxed text-amber-800">
          目录页数为系统规划参考，正文实际页数可能因生成内容、图片插入和最终排版产生差异，请以最终导出文件为准。
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 左：招标文件 */}
        <div className="bg-white rounded-3xl shadow-sm p-5 max-h-[680px] flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">
              article
            </span>
            <h3 className="text-base font-bold">招标文件参考</h3>
          </div>
          <div className="flex gap-1 border-b border-[#ECEEF1] mb-4 overflow-x-auto">
            {tenderTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "px-3 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px " +
                  (tab === t.key
                    ? "border-[#3B82F6] text-[#3B82F6]"
                    : "border-transparent text-[#191c1e]/60 hover:text-[#3B82F6]")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto">
            {tab === "source" ? (
              <div className="bg-[#F7F9FC] rounded-2xl border border-[#ECEEF1] overflow-hidden">
                <div className="px-4 py-2.5 bg-white border-b border-[#ECEEF1] flex items-center gap-2 text-sm font-semibold text-[#191c1e]">
                  <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">picture_as_pdf</span>
                  招标文件.pdf
                </div>
                <div className="p-5">
                  <div className="bg-white rounded-md shadow-sm mx-auto max-w-[420px] aspect-[1/1.414] p-7">
                    <div className="text-xs text-center text-[#191c1e]/40 mb-4">招标文件原文预览</div>
                    <h4 className="text-sm font-bold mb-3">XX市政务云平台建设项目招标文件</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="h-2 rounded bg-[#ECEEF1]" style={{ width: `${58 + ((i * 19) % 38)}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : tab === "scoring" ? (
              <div className="space-y-4">
                {(
                  [
                    { key: "tech", title: "技术评分标准", color: "#3B82F6", rows: tenderScoring.tech },
                    { key: "business", title: "商务评分标准", color: "#10B981", rows: tenderScoring.business },
                    { key: "price", title: "报价评分标准", color: "#F59E0B", rows: tenderScoring.price },
                  ] as const
                ).map((g) => {
                  const total = g.rows.reduce((s, r) => s + r.max, 0);
                  return (
                    <div key={g.key}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-block w-1 h-3.5 rounded-full" style={{ background: g.color }} />
                        <h4 className="text-xs font-bold text-[#191c1e]">{g.title}</h4>
                        <span className="text-[11px] text-[#191c1e]/50">合计 {total} 分</span>
                      </div>
                      <div className="bg-[#F7F9FC] rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-[10px] font-bold text-[#191c1e]/50 uppercase tracking-wider">
                              <th className="text-left px-2.5 py-2 w-28">评分项</th>
                              <th className="text-left px-2.5 py-2 w-12">分值</th>
                              <th className="text-left px-2.5 py-2">评分细则</th>
                            </tr>
                          </thead>
                          <tbody>
                            {g.rows.map((r, i) => (
                              <tr key={i} className="border-t border-[#ECEEF1] align-top text-[#191c1e]/80">
                                <td className="px-2.5 py-1.5">{r.item}</td>
                                <td className="px-2.5 py-1.5 font-semibold">{r.max}</td>
                                <td className="px-2.5 py-1.5 leading-relaxed">{r.rule}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#F7F9FC] rounded-2xl p-4 text-sm text-[#191c1e]/80 whitespace-pre-wrap leading-relaxed">
                {tenderContent[tab]}
              </div>
            )}
          </div>
        </div>

        {/* 右：标书目录 */}
        <div className="bg-white rounded-3xl shadow-sm p-5 max-h-[680px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">
                format_list_bulleted
              </span>
              <h3 className="text-base font-bold">标书目录</h3>
              <span className="text-xs text-[#191c1e]/50 ml-1">
                {outline.length} 章 · {totalSubs} 节 · {totalPages} 页
              </span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setConfirmRegenerate(true)} disabled={regenerating} className="text-xs font-semibold text-[#191c1e]/60 hover:text-[#3B82F6] hover:bg-[#F2F4F6] px-2 py-1.5 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50">
                <span className={"material-symbols-outlined text-[14px] " + (regenerating ? "animate-spin" : "")}>
                  refresh
                </span>
                {regenerating ? "生成中..." : "重新生成目录"}
              </button>
              <button onClick={handleDownload} className="text-xs font-semibold text-[#191c1e]/60 hover:text-[#3B82F6] hover:bg-[#F2F4F6] px-2 py-1.5 rounded-lg flex items-center gap-1 transition-all">
                <span className="material-symbols-outlined text-[14px]">
                  download
                </span>
                下载目录
              </button>
            </div>
          </div>
          {regenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[#3B82F6] text-[36px] animate-spin mb-3">
                progress_activity
              </span>
              <p className="text-sm font-semibold text-[#191c1e]/70">AI 正在生成标书目录…</p>
              <p className="text-xs text-[#191c1e]/50 mt-1">预计需要数秒，请稍候</p>
            </div>
          ) : (
          <div className="flex-1 overflow-auto space-y-2 pr-1">
            {outline.map((c, ci) => {
              const open = expanded.has(c.id);
              return (
                <div key={c.id} className="bg-[#F7F9FC] rounded-2xl p-3 transition-colors">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => toggleExpand(c.id)}
                      className="w-5 h-5 rounded-md hover:bg-white flex items-center justify-center text-[#191c1e]/50"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {open ? "expand_more" : "chevron_right"}
                      </span>
                    </button>
                    <span className="text-xs font-bold text-[#3B82F6] bg-[#D4E3FF] px-2 py-0.5 rounded-md whitespace-nowrap">
                      第{cn(ci + 1)}章
                    </span>
                    <input
                      value={c.name}
                      onChange={(e) => updateChapter(c.id, { name: e.target.value })}
                      className="flex-1 min-w-[120px] px-2 py-1 rounded-md text-sm font-bold text-[#191c1e] bg-transparent hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    />
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[#191c1e]/50">页</span>
                      <input
                        type="number"
                        value={c.pages}
                        onChange={(e) => updateChapter(c.id, { pages: +e.target.value })}
                        className="w-12 px-1.5 py-0.5 rounded-md border border-[#ECEEF1] bg-white text-center font-semibold focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                    <div className="flex items-center gap-0.5 bg-white rounded-lg border border-[#ECEEF1] px-1 py-0.5">
                      <ChapterAction icon="arrow_upward" title="上移本章" disabled={ci === 0} onClick={() => move(ci, -1)} />
                      <ChapterAction icon="arrow_downward" title="下移本章" disabled={ci === outline.length - 1} onClick={() => move(ci, 1)} />
                      <ChapterAction icon="add" title="新增小节" onClick={() => { addSub(c.id); setExpanded(s => new Set(s).add(c.id)); }} />
                      <ChapterAction icon="delete" title="删除本章" danger onClick={() => setPendingDelete({ kind: "chapter", cid: c.id })} />
                    </div>
                  </div>
                  {open && c.subs.length > 0 && (
                    <div className="mt-2 ml-8 space-y-1">
                      {c.subs.map((s, si) => (
                        <div key={s.id}>
                          <div className="flex items-center gap-2 py-1 pl-3 border-l-2 border-[#D4E3FF] group/sub">
                            <span className="text-[11px] font-bold text-[#3B82F6]/80 w-10">{ci + 1}.{si + 1}</span>
                            <input
                              value={s.name}
                              onChange={(e) => updateSub(c.id, s.id, { name: e.target.value })}
                              className="flex-1 px-2 py-0.5 rounded-md text-xs text-[#191c1e]/80 bg-transparent hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                            />
                            <span className="opacity-0 group-hover/sub:opacity-100 flex gap-0.5 transition-opacity">
                              <ChapterAction icon="arrow_upward" small disabled={si === 0} onClick={() => moveSub(c.id, si, -1)} />
                              <ChapterAction icon="arrow_downward" small disabled={si === c.subs.length - 1} onClick={() => moveSub(c.id, si, 1)} />
                              <ChapterAction icon="add" small title="新增三级条目" onClick={() => addSubSub(c.id, s.id)} />
                              <ChapterAction icon="delete" small danger onClick={() => setPendingDelete({ kind: "sub", cid: c.id, sid: s.id })} />
                            </span>
                          </div>
                          {s.subs.length > 0 && (
                            <div className="ml-8 mt-1.5 space-y-1">
                              {s.subs.map((ss, ssi) => (
                                <div key={ss.id} className="flex items-center gap-2 py-1 pl-3 border-l border-[#ECEEF1] group/ss">
                                  <span className="text-[11px] font-semibold text-[#191c1e]/45 w-12 tabular-nums tracking-wide">{ci + 1}.{si + 1}.{ssi + 1}</span>
                                  <input
                                    value={ss.name}
                                    onChange={(e) => updateSubSub(c.id, s.id, ss.id, { name: e.target.value })}
                                    className="flex-1 px-2 py-1 rounded-md text-[13px] text-[#191c1e]/75 bg-transparent hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                                  />
                                  <span className="opacity-0 group-hover/ss:opacity-100">
                                    <ChapterAction icon="delete" small danger onClick={() => setPendingDelete({ kind: "subSub", cid: c.id, sid: s.id, ssid: ss.id })} />
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => setOutline(arr => [...arr, { id: uid(), name: "新章节", pages: 5, subs: [] }])}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#ECEEF1] text-xs font-semibold text-[#191c1e]/50 hover:border-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#D4E3FF]/20 transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              新增章节
            </button>
          </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 rounded-xl border border-[#ECEEF1] bg-white text-sm font-bold text-[#191c1e]/70 hover:shadow-sm flex items-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          上一步
        </button>
        <button
          onClick={() => setPreview(true)}
          className="px-8 py-3 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
        >
          预览并开始编写正文
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* 预览弹窗 */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-[#ECEEF1] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">目录预览</h3>
                <p className="text-xs text-[#191c1e]/60 mt-0.5">
                  共 {outline.length} 章 · {totalSubs} 节 · 预计 {totalPages} 页
                </p>
              </div>
              <button
                onClick={() => setPreview(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[16px] leading-none shrink-0">info</span>
              <p className="text-xs text-amber-700 leading-relaxed m-0">
                <span className="font-bold">提示：</span>进入正文编写后，目录将被锁定且不可再修改，请仔细核对章节结构与顺序。
              </p>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-3">
              {outline.map((c, ci) => (
                <div key={c.id}>
                  <div className="font-bold text-[#191c1e]">第{cn(ci + 1)}章 {c.name}</div>
                  <div className="ml-4 mt-1 space-y-0.5">
                    {c.subs.map((s, si) => (
                      <div key={s.id}>
                        <div className="text-sm text-[#191c1e]/70">{ci + 1}.{si + 1} {s.name}</div>
                        {s.subs.map((ss, ssi) => (
                          <div key={ss.id} className="ml-4 text-xs text-[#191c1e]/55">{ci + 1}.{si + 1}.{ssi + 1} {ss.name}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[#ECEEF1] flex gap-3 justify-end">
              <button
                onClick={() => setPreview(false)}
                className="px-5 py-2.5 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC]"
              >
                返回修改
              </button>
              <button
                onClick={() => {
                  setPreview(false);
                  onNext();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0]"
              >
                确认开始编写
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmRegenerate}
        title="重新生成目录"
        description="重新生成后将覆盖当前目录内容。是否继续？"
        confirmText="重新生成"
        cancelText="取消"
        onConfirm={handleRegenerate}
        onCancel={() => setConfirmRegenerate(false)}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        title="删除章节"
        description="删除后该章节及下级目录将一并删除。是否确认删除？"
        confirmText="确认删除"
        cancelText="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div
            className={
              "px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold " +
              (toast.kind === "success" ? "bg-emerald-600 text-white" : "bg-[#FF4D4F] text-white")
            }
          >
            <span className="material-symbols-outlined text-[18px]">
              {toast.kind === "success" ? "check_circle" : "error"}
            </span>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <span
            className={
              "material-symbols-outlined mt-0.5 text-[22px] " +
              (danger ? "text-[#FF4D4F]" : "text-[#3B82F6]")
            }
          >
            {danger ? "warning" : "info"}
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#191c1e]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#191c1e]/65">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC] transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={
              "px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all " +
              (danger ? "bg-[#FF4D4F] hover:bg-[#E04345]" : "bg-[#3B82F6] hover:bg-[#3F6DF0]")
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChapterAction({
  icon,
  title,
  onClick,
  danger,
  small,
  disabled,
}: {
  icon: string;
  title?: string;
  onClick?: () => void;
  danger?: boolean;
  small?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={
        (small ? "w-5 h-5 " : "w-6 h-6 ") +
        "rounded-md flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed " +
        (danger
          ? "text-[#191c1e]/40 hover:bg-red-50 hover:text-[#FF4D4F]"
          : "text-[#191c1e]/40 hover:bg-white hover:text-[#3B82F6]")
      }
    >
      <span className={"material-symbols-outlined " + (small ? "text-[12px]" : "text-[14px]")}>
        {icon}
      </span>
    </button>
  );
}
