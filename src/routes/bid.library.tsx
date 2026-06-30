import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadZone, type UploadedFile } from "@/components/bid/UploadZone";
import {
  mockCerts,
  mockStaff,
  mockCases,
  mockFinancials,
  mockTemplates,
  mockHistory,
  mockCompany,
  type KbCert,
  type KbStaff,
  type KbCase,
  type KbFinancial,
} from "@/lib/mockKb";

export const Route = createFileRoute("/bid/library")({
  component: Library,
});

const cats = [
  { key: "home", label: "知识库首页", icon: "dashboard" },
  { key: "company", label: "企业信息", icon: "business" },
  { key: "certs", label: "资质证书", icon: "verified" },
  { key: "staff", label: "人员信息", icon: "groups" },
  { key: "cases", label: "类似业绩", icon: "stars" },
  { key: "financials", label: "财务状况", icon: "account_balance_wallet" },
  { key: "templates", label: "方案模板", icon: "description" },
  { key: "history", label: "历史标书", icon: "history" },
] as const;
type CatKey = (typeof cats)[number]["key"];

function Library() {
  const [cat, setCat] = useState<CatKey>("home");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<null | { name: string; cb: () => void }>(null);
  const [uploadCat, setUploadCat] = useState<CatKey | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);
  const [syncKb, setSyncKb] = useState(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">知识库</h1>
          <p className="mt-1 text-[#191c1e]/70">
            集中管理企业资料，AI 智能引用，提升标书生成质量。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#191c1e]/40 text-[18px]">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索资料名称"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ECEEF1] bg-white text-sm focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
          {cat !== "home" && cat !== "company" && (
            <button
              onClick={() => {
                setUploadFiles([]);
                setSyncKb(true);
                setUploadCat(cat);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              新增资料
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* 左二级菜单 */}
        <aside className="col-span-3 bg-white rounded-3xl shadow-sm p-3 self-start sticky top-24">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all " +
                (cat === c.key
                  ? "bg-[#D4E3FF] text-[#3B82F6]"
                  : "text-[#191c1e]/70 hover:bg-[#F7F9FC]")
              }
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </aside>

        {/* 右内容 */}
        <section className="col-span-9">
          {cat === "home" && <HomePage onJump={setCat} />}
          {cat === "company" && <CompanyPage onSave={() => showToast("企业信息已保存")} />}
          {cat === "certs" && (
            <CertsPage
              search={search}
              onDelete={(c) =>
                setConfirmDelete({ name: c.name, cb: () => showToast(`已删除 ${c.name}`) })
              }
            />
          )}
          {cat === "staff" && (
            <StaffPage
              search={search}
              onDelete={(s) =>
                setConfirmDelete({ name: s.name, cb: () => showToast(`已删除 ${s.name}`) })
              }
            />
          )}
          {cat === "cases" && (
            <CasesPage
              search={search}
              onDelete={(k) =>
                setConfirmDelete({ name: k.name, cb: () => showToast(`已删除 ${k.name}`) })
              }
            />
          )}
          {cat === "financials" && (
            <FinancialsPage
              search={search}
              onDelete={(f) =>
                setConfirmDelete({ name: f.name, cb: () => showToast(`已删除 ${f.name}`) })
              }
            />
          )}
          {cat === "templates" && <TemplatesPage search={search} onToast={showToast} />}
          {cat === "history" && <HistoryPage search={search} onToast={showToast} />}
        </section>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#FF4D4F] text-[24px]">
                delete_forever
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">确认删除？</h3>
            <p className="text-sm text-[#191c1e]/70">即将删除《{confirmDelete.name}》。</p>
            <p className="text-sm text-[#FF4D4F] mb-6">删除后将无法恢复，请谨慎操作。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC]"
              >
                取消
              </button>
              <button
                onClick={() => {
                  confirmDelete.cb();
                  setConfirmDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-[#FF4D4F] text-white text-sm font-bold hover:bg-[#e84446]"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadCat && (
        <KbUploadDialog
          title={`新增${cats.find((c) => c.key === uploadCat)?.label ?? "资料"}`}
          files={uploadFiles}
          onFilesChange={setUploadFiles}
          syncKb={syncKb}
          onSyncChange={setSyncKb}
          onClose={() => setUploadCat(null)}
          onConfirm={() => {
            showToast(syncKb ? "资料已上传并保存至知识库" : "资料已上传");
            setUploadCat(null);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="px-5 py-3 rounded-xl shadow-lg bg-emerald-600 text-white flex items-center gap-2 text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({ onJump }: { onJump: (c: CatKey) => void }) {
  const stats: { key: CatKey; label: string; value: string; icon: string; color: string }[] = [
    { key: "company", label: "企业信息", value: "已完善", icon: "business", color: "#3B82F6" },
    {
      key: "certs",
      label: "资质证书",
      value: `${mockCerts.length} 份`,
      icon: "verified",
      color: "#10B981",
    },
    {
      key: "staff",
      label: "人员信息",
      value: `${mockStaff.length} 人`,
      icon: "groups",
      color: "#6366F1",
    },
    {
      key: "cases",
      label: "类似业绩",
      value: `${mockCases.length} 项`,
      icon: "stars",
      color: "#F59E0B",
    },
    {
      key: "financials",
      label: "财务状况",
      value: `${mockFinancials.length} 份`,
      icon: "account_balance_wallet",
      color: "#14B8A6",
    },
    {
      key: "templates",
      label: "方案模板",
      value: `${mockTemplates.length} 份`,
      icon: "description",
      color: "#EF4444",
    },
    {
      key: "history",
      label: "历史标书",
      value: `${mockHistory.length} 份`,
      icon: "history",
      color: "#0EA5E9",
    },
  ];
  const recent = [
    "长沙市中心医院信息化监理",
    "ISO9001 质量管理体系认证",
    "信息化项目监理服务方案",
    "近三年财务状况汇总",
    "张三（总监理工程师）",
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => onJump(s.key)}
            className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.color + "14" }}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ color: s.color }}>
                  {s.icon}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#191c1e]/30 text-[18px]">
                arrow_outward
              </span>
            </div>
            <div className="text-sm text-[#191c1e]/60 font-semibold">{s.label}</div>
            <div className="text-xl font-extrabold text-[#191c1e] mt-1">{s.value}</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">history</span>
          最近引用资料
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {recent.map((r) => (
            <div
              key={r}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F7F9FC] text-sm"
            >
              <span className="material-symbols-outlined text-[#191c1e]/40 text-[14px]">
                bookmark
              </span>
              <span className="text-[#191c1e]/80">{r}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-r from-[#EEF4FF] to-[#F7F9FC] border border-[#D4E3FF] p-4 flex items-center gap-2 text-sm text-[#191c1e]/70">
        <span className="material-symbols-outlined text-[#3B82F6] text-[18px]">lightbulb</span>
        完善知识库可提升 AI 生成质量。
      </div>
    </div>
  );
}

function CompanyPage({ onSave }: { onSave: () => void }) {
  const [data, setData] = useState(mockCompany);
  const [edit, setEdit] = useState(false);
  const [licenseFiles, setLicenseFiles] = useState<UploadedFile[]>([]);
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold">企业信息</h3>
        {edit ? (
          <button
            onClick={() => {
              setEdit(false);
              onSave();
            }}
            className="px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0]"
          >
            保存
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="px-4 py-2 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>编辑
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="企业名称"
          value={data.name}
          edit={edit}
          onChange={(v) => setData({ ...data, name: v })}
        />
        <Field
          label="统一社会信用代码"
          value={data.uscc}
          edit={edit}
          onChange={(v) => setData({ ...data, uscc: v })}
        />
        <Field
          label="主营业务"
          value={data.business}
          edit={edit}
          onChange={(v) => setData({ ...data, business: v })}
          full
        />
        <Field
          label="企业简介"
          value={data.intro}
          edit={edit}
          onChange={(v) => setData({ ...data, intro: v })}
          full
          multiline
        />
        <Field
          label="LOGO"
          value={data.logo}
          edit={edit}
          onChange={(v) => setData({ ...data, logo: v })}
          placeholder="上传 LOGO"
        />
        <Field
          label="组织架构图"
          value={data.org}
          edit={edit}
          onChange={(v) => setData({ ...data, org: v })}
          placeholder="上传组织架构图"
        />
        <div className="col-span-2">
          <div className="text-xs font-semibold text-[#191c1e]/60 mb-1.5">营业执照</div>
          <UploadZone
            files={licenseFiles}
            onChange={setLicenseFiles}
            hint="上传营业执照 PDF / 图片"
            multiple={false}
          />
        </div>
      </div>
      <div className="mt-5 text-xs text-[#191c1e]/50 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-[#3B82F6]">auto_awesome</span>
        企业信息将在智能标书中自动引用至"公司介绍"章节。
      </div>
    </div>
  );
}

function KbUploadDialog({
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

function Field({
  label,
  value,
  edit,
  onChange,
  full,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  edit: boolean;
  onChange: (v: string) => void;
  full?: boolean;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-xs font-semibold text-[#191c1e]/60 mb-1.5">{label}</div>
      {edit ? (
        multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-24 px-3 py-2 rounded-xl border border-[#ECEEF1] bg-[#F7F9FC] text-sm focus:outline-none focus:border-[#3B82F6] focus:bg-white resize-none"
          />
        ) : (
          <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#ECEEF1] bg-[#F7F9FC] text-sm focus:outline-none focus:border-[#3B82F6] focus:bg-white"
          />
        )
      ) : (
        <div className="px-3 py-2 rounded-xl bg-[#F7F9FC] text-sm text-[#191c1e]/80 min-h-[36px]">
          {value || <span className="text-[#191c1e]/30">未填写</span>}
        </div>
      )}
    </div>
  );
}

function CertsPage({ search, onDelete }: { search: string; onDelete: (c: KbCert) => void }) {
  const data = mockCerts.filter((c) => !search || c.name.includes(search));
  return (
    <KbTable
      head={["证书名称", "证书编号", "发证机构", "有效期", "状态"]}
      rows={data.map((c) => ({
        id: c.id,
        cells: [
          <span className="font-semibold text-[#191c1e]">{c.name}</span>,
          <span className="text-[#191c1e]/70">{c.code}</span>,
          <span className="text-[#191c1e]/70">{c.issuer}</span>,
          <span
            className={
              c.status === "即将过期" ? "text-amber-600 font-semibold" : "text-[#191c1e]/70"
            }
          >
            {c.expiry}
          </span>,
          <StatusBadge status={c.status} />,
        ],
        onDelete: () => onDelete(c),
      }))}
    />
  );
}

function StatusBadge({ status }: { status: KbCert["status"] }) {
  const m: Record<KbCert["status"], string> = {
    有效: "bg-emerald-50 text-emerald-600",
    即将过期: "bg-amber-50 text-amber-600",
    已过期: "bg-red-50 text-[#FF4D4F]",
  };
  return (
    <span className={"text-[11px] font-bold px-2 py-0.5 rounded-full " + m[status]}>{status}</span>
  );
}

function StaffPage({ search, onDelete }: { search: string; onDelete: (s: KbStaff) => void }) {
  const data = mockStaff.filter(
    (s) => !search || s.name.includes(search) || s.role.includes(search),
  );
  return (
    <KbTable
      head={["姓名", "岗位", "联系电话", "工作年限", "证书数量"]}
      rows={data.map((s) => ({
        id: s.id,
        cells: [
          <span className="font-semibold text-[#191c1e]">{s.name}</span>,
          <span className="text-[#191c1e]/70">{s.role}</span>,
          <span className="text-[#191c1e]/70">{s.phone}</span>,
          <span className="text-[#191c1e]/70">{s.years} 年</span>,
          <span className="text-[#3B82F6] font-semibold">{s.certs.length} 本</span>,
        ],
        onDelete: () => onDelete(s),
      }))}
    />
  );
}

function CasesPage({ search, onDelete }: { search: string; onDelete: (k: KbCase) => void }) {
  const data = mockCases.filter((k) => !search || k.name.includes(search));
  return (
    <KbTable
      head={["项目名称", "类型", "合同金额", "建设地点", "时间"]}
      rows={data.map((k) => ({
        id: k.id,
        cells: [
          <span className="font-semibold text-[#191c1e]">{k.name}</span>,
          <span className="text-[#191c1e]/70">{k.type}</span>,
          <span className="font-semibold text-[#191c1e]">{k.amount}</span>,
          <span className="text-[#191c1e]/70">{k.place}</span>,
          <span className="text-[#191c1e]/70">{k.date}</span>,
        ],
        onDelete: () => onDelete(k),
      }))}
    />
  );
}

function FinancialsPage({
  search,
  onDelete,
}: {
  search: string;
  onDelete: (f: KbFinancial) => void;
}) {
  const data = mockFinancials.filter(
    (f) => !search || f.name.includes(search) || f.period.includes(search),
  );
  return (
    <KbTable
      head={["资料名称", "期间", "营业收入", "净利润", "资产负债率", "更新时间"]}
      rows={data.map((f) => ({
        id: f.id,
        cells: [
          <span className="font-semibold text-[#191c1e]">{f.name}</span>,
          <span className="text-[#191c1e]/70">{f.period}</span>,
          <span className="font-semibold text-[#191c1e]">{f.revenue}</span>,
          <span className="font-semibold text-[#191c1e]">{f.netProfit}</span>,
          <span className="text-[#191c1e]/70">{f.debtRatio}</span>,
          <span className="text-[#191c1e]/70">{f.updated}</span>,
        ],
        onDelete: () => onDelete(f),
      }))}
    />
  );
}

function TemplatesPage({ search, onToast }: { search: string; onToast: (m: string) => void }) {
  const data = mockTemplates.filter((t) => !search || t.name.includes(search));
  return (
    <KbTable
      head={["方案名称", "适用场景", "更新时间"]}
      rows={data.map((t) => ({
        id: t.id,
        cells: [
          <span className="font-semibold text-[#191c1e]">{t.name}</span>,
          <span className="text-[#191c1e]/70">{t.scene}</span>,
          <span className="text-[#191c1e]/70">{t.updated}</span>,
        ],
        onDelete: () => onToast(`已删除《${t.name}》`),
      }))}
    />
  );
}

function HistoryPage({ search, onToast }: { search: string; onToast: (m: string) => void }) {
  const data = mockHistory.filter((h) => !search || h.name.includes(search));
  return (
    <KbTable
      head={["标书名称", "创建时间"]}
      rows={data.map((h) => ({
        id: h.id,
        cells: [
          <span className="font-semibold text-[#191c1e]">{h.name}</span>,
          <span className="text-[#191c1e]/70">{h.created}</span>,
        ],
        onDelete: () => onToast(`已删除《${h.name}》`),
      }))}
    />
  );
}

function KbTable({
  head,
  rows,
}: {
  head: string[];
  rows: { id: string; cells: React.ReactNode[]; onDelete: () => void }[];
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      {rows.length === 0 ? (
        <div className="text-center py-16 text-[#191c1e]/50">
          <span className="material-symbols-outlined text-[40px] text-[#191c1e]/20 block mb-2">
            inbox
          </span>
          暂无资料，点击右上角"新增资料"
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FC] text-[12px] font-bold text-[#191c1e]/60 uppercase tracking-wider">
              {head.map((h) => (
                <th key={h} className="text-left px-5 py-3.5">
                  {h}
                </th>
              ))}
              <th className="text-right px-5 py-3.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[#F2F4F6] hover:bg-[#F7F9FC]/60">
                {r.cells.map((c, i) => (
                  <td key={i} className="px-5 py-3.5 text-sm">
                    {c}
                  </td>
                ))}
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Icn icon="visibility" title="查看" />
                    <Icn icon="edit" title="编辑" />
                    <Icn icon="delete" title="删除" danger onClick={r.onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Icn({
  icon,
  title,
  danger,
  onClick,
}: {
  icon: string;
  title: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={
        "w-7 h-7 rounded-md flex items-center justify-center " +
        (danger
          ? "text-[#191c1e]/50 hover:bg-red-50 hover:text-[#FF4D4F]"
          : "text-[#191c1e]/50 hover:bg-[#F2F4F6] hover:text-[#3B82F6]")
      }
    >
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
    </button>
  );
}
