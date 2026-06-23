import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/bid/")({
  component: BidHome,
});

const abilities = [
  {
    key: "tender",
    icon: "auto_awesome",
    title: "智能标书生成助手",
    desc: "上传招标文件，AI 自动解读评分项、生成目录并编写正文，全流程一键完成。",
    credits: 100,
    available: true,
  },
];

function BidHome() {
  const navigate = useNavigate();
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const current = abilities.find((a) => a.key === confirmKey);
  const userCredits = 1280;

  return (
    <div className="px-10 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#191c1e]">
          您的智能标书生成助手
        </h1>
        <p className="mt-2 text-[#191c1e]/70">
          开始你的智能标书工作流。
        </p>
      </div>

      <h2 className="text-lg font-bold mb-4 text-[#191c1e]">AI 能力</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {abilities.map((a) => (
          <div
            key={a.key}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-white flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#3B82F6] text-[26px]">
                  {a.icon}
                </span>
              </div>
              {!a.available && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F2F4F6] text-[#191c1e]/50">
                  即将上线
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#191c1e]">{a.title}</h3>
            <p className="mt-2 text-sm text-[#191c1e]/70 leading-relaxed flex-1">
              {a.desc}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#191c1e]/60">
                <span className="material-symbols-outlined text-[16px] text-[#FAAD14]">
                  toll
                </span>
                消耗 {a.credits} 积分 / 次
              </div>
              <button
                disabled={!a.available}
                onClick={() => setConfirmKey(a.key)}
                className={
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all " +
                  (a.available
                    ? "bg-[#3B82F6] text-white hover:bg-[#3F6DF0] shadow-sm hover:shadow-md"
                    : "bg-[#F2F4F6] text-[#191c1e]/40 cursor-not-allowed")
                }
              >
                立即使用
              </button>
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#3B82F6] text-[28px]">
                {current.icon}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">使用 {current.title}</h3>
            <p className="text-sm text-[#191c1e]/70 mb-6">
              本次操作将消耗积分，确认后将进入主流程。
            </p>
            <div className="bg-[#F7F9FC] rounded-2xl p-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#191c1e]/70">当前积分</span>
                <span className="font-bold">{userCredits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#191c1e]/70">本次消耗</span>
                <span className="font-bold text-[#FF4D4F]">
                  -{current.credits}
                </span>
              </div>
              <div className="h-px bg-[#ECEEF1] my-1"></div>
              <div className="flex justify-between text-sm">
                <span className="text-[#191c1e]/70">扣除后余额</span>
                <span className="font-bold text-[#3B82F6]">
                  {userCredits - current.credits}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmKey(null)}
                className="flex-1 py-3 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC] transition-all"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setConfirmKey(null);
                  navigate({ to: "/bid/new" });
                }}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0] shadow-sm transition-all"
              >
                确认并开始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
