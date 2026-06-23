import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/bid/my")({
  component: MyBids,
});

type Status = "草稿" | "编写中" | "已完成";
const statusStyles: Record<Status, string> = {
  草稿: "bg-[#F2F4F6] text-[#191c1e]/60",
  编写中: "bg-[#D4E3FF] text-[#3B82F6]",
  已完成: "bg-emerald-50 text-emerald-600",
};

const initialData = [
  { id: 1, name: "XX市政务云平台建设项目投标书", type: "服务类", status: "编写中" as Status, progress: 65, created: "2026-06-01 10:23", updated: "2026-06-08 16:45" },
  { id: 2, name: "XX区智慧路灯采购项目投标书", type: "物资类", status: "已完成" as Status, progress: 100, created: "2026-05-22 09:10", updated: "2026-05-30 18:12" },
  { id: 3, name: "XX大学图书馆改造工程", type: "工程类", status: "草稿" as Status, progress: 12, created: "2026-06-05 14:30", updated: "2026-06-05 14:50" },
  { id: 4, name: "XX医院信息化运维服务", type: "服务类", status: "已完成" as Status, progress: 100, created: "2026-04-12 11:00", updated: "2026-04-20 09:30" },
];

function MyBids() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(initialData);
  const [deleteTarget, setDeleteTarget] = useState<null | { id: number; name: string }>(null);
  const [toast, setToast] = useState<null | { kind: "success" | "error"; msg: string }>(null);

  const showToast = (kind: "success" | "error", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 2400);
  };

  const handleEdit = (status: Status) =>
    navigate({ to: "/bid/new", search: { step: 5, from: "my", status } });
  const handleDownload = (name: string) => {
    // 模拟下载：90% 成功
    if (Math.random() > 0.1) showToast("success", `《${name}》下载成功`);
    else showToast("error", `《${name}》下载失败，请重试`);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((rs) => rs.filter((r) => r.id !== deleteTarget.id));
    showToast("success", `已删除《${deleteTarget.name}》`);
    setDeleteTarget(null);
  };

  const data = rows.filter(
    (r) =>
      (typeFilter === "全部" || r.type === typeFilter) &&
      (statusFilter === "全部" || r.status === statusFilter) &&
      (search === "" || r.name.includes(search))
  );

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">我的标书</h1>
          <p className="mt-1 text-[#191c1e]/70">
            管理所有已创建的标书项目，支持编辑、导出与复用。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm mb-5 flex flex-wrap items-center gap-3">
        <Select label="标书类型" value={typeFilter} onChange={setTypeFilter} options={["全部","服务类","物资类","工程类","其他"]} />
        <Select label="标书状态" value={statusFilter} onChange={setStatusFilter} options={["全部","草稿","编写中","已完成"]} />
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#191c1e]/40 text-[20px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标书名称"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ECEEF1] bg-[#F7F9FC] text-sm focus:outline-none focus:border-[#3B82F6] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FC] text-[12px] font-bold text-[#191c1e]/60 uppercase tracking-wider">
              <th className="text-left px-6 py-4">标书名称</th>
              <th className="text-left px-6 py-4">类型</th>
              <th className="text-left px-6 py-4">状态</th>
              <th className="text-left px-6 py-4">进度</th>
              <th className="text-left px-6 py-4">创建时间</th>
              <th className="text-left px-6 py-4">最后编辑</th>
              <th className="text-right px-6 py-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t border-[#F2F4F6] hover:bg-[#F7F9FC]/60 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-[#191c1e] max-w-xs">{r.name}</td>
                <td className="px-6 py-4 text-sm text-[#191c1e]/70">{r.type}</td>
                <td className="px-6 py-4">
                  <span className={"inline-block whitespace-nowrap text-xs font-bold px-2.5 py-1 rounded-full " + statusStyles[r.status]}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 w-40">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3B82F6] rounded-full transition-all" style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#191c1e]/70 w-9 text-right">{r.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-[#191c1e]/60">{r.created}</td>
                <td className="px-6 py-4 text-xs text-[#191c1e]/60">{r.updated}</td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <IconBtn icon="edit" title="编辑" onClick={() => handleEdit(r.status)} />
                    {r.status === "已完成" && (
                      <IconBtn icon="download" title="下载" onClick={() => handleDownload(r.name)} />
                    )}
                    <IconBtn icon="delete" title="删除" danger onClick={() => setDeleteTarget({ id: r.id, name: r.name })} />
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={7} className="text-center py-16 text-[#191c1e]/50">没有匹配的标书</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#FF4D4F] text-[24px]">delete_forever</span>
            </div>
            <h3 className="text-lg font-bold mb-2">确认删除该标书？</h3>
            <p className="text-sm text-[#191c1e]/70 mb-1">
              即将删除《{deleteTarget.name}》。
            </p>
            <p className="text-sm text-[#FF4D4F] mb-6">删除后将无法恢复，请谨慎操作。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC]"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-[#FF4D4F] text-white text-sm font-bold hover:bg-[#e84446]"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div
            className={
              "px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold " +
              (toast.kind === "success"
                ? "bg-emerald-600 text-white"
                : "bg-[#FF4D4F] text-white")
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

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-[#191c1e]/60">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-[#ECEEF1] bg-[#F7F9FC] text-sm font-semibold focus:outline-none focus:border-[#3B82F6] focus:bg-white transition-all cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function IconBtn({ icon, title, danger, onClick }: { icon: string; title: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={"w-8 h-8 rounded-lg flex items-center justify-center transition-all " + (danger ? "text-[#191c1e]/50 hover:bg-red-50 hover:text-[#FF4D4F]" : "text-[#191c1e]/50 hover:bg-[#F2F4F6] hover:text-[#3B82F6]")}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}
