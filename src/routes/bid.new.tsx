import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Stepper } from "@/components/bid/Stepper";
import { Step1Tender } from "@/components/bid/Step1Tender";
import { Step2Settings } from "@/components/bid/Step2Settings";
import { Step3Resources } from "@/components/bid/Step3Resources";
import { Step3Outline } from "@/components/bid/Step3Outline";
import { Step4Content } from "@/components/bid/Step4Content";

export const Route = createFileRoute("/bid/new")({
  component: NewBid,
  validateSearch: (s: Record<string, unknown>) => ({
    step: typeof s.step === "number" ? s.step : s.step ? Number(s.step) : undefined,
    from: typeof s.from === "string" ? s.from : undefined,
    status: typeof s.status === "string" ? s.status : undefined,
  }),
});

function NewBid() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [step, setStep] = useState<number>(search.step && search.step >= 1 && search.step <= 5 ? search.step : 1);
  const [exitConfirm, setExitConfirm] = useState(false);

  const backTo = search.from === "my" ? "/bid/my" : "/bid";

  return (
    <div className="-mx-0">
      {/* 顶部：步骤条 + 退出 */}
      {step < 5 && (
        <div className="bg-white border-b border-[#ECEEF1] sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <button
              onClick={() => setExitConfirm(true)}
              className="text-sm font-semibold text-[#191c1e]/60 hover:text-[#3B82F6] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              退出
            </button>
            <Stepper current={step} />
            <div className="text-xs text-[#191c1e]/50 font-semibold">
              草稿已自动保存
            </div>
          </div>
        </div>
      )}

      <div className="pt-6">
        {step === 1 && <Step1Tender onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step2Settings onPrev={() => setStep(1)} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <Step3Resources onPrev={() => setStep(2)} onNext={() => setStep(4)} />
        )}
        {step === 4 && (
          <Step3Outline onPrev={() => setStep(3)} onNext={() => setStep(5)} />
        )}
        {step === 5 && <Step4Content onPrev={() => navigate({ to: backTo })} status={search.status === "已完成" ? "已完成" : "编写中"} />}
      </div>

      {exitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-600 text-[24px]">
                warning
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">确认退出？</h3>
            <p className="text-sm text-[#191c1e]/70 mb-6">
              草稿已自动保存，退出后可在「我的标书」中继续编辑该流程。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setExitConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#ECEEF1] text-sm font-bold text-[#191c1e]/70 hover:bg-[#F7F9FC]"
              >
                继续编辑
              </button>
              <button
                onClick={() => navigate({ to: backTo })}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#3F6DF0]"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
