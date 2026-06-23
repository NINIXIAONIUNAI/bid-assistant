import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "原采智擎 — AI驱动的投标文件智能评审自查" },
      {
        name: "description",
        content:
          "投标前一键自查，精准识别废标风险。覆盖签章、资质、报价、技术响应等全维度检查。",
      },
      { property: "og:title", content: "原采智擎" },
      {
        property: "og:description",
        content: "AI驱动的投标文件智能评审自查平台",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="pt-24">
        {/* HERO */}
        <section className="relative overflow-hidden px-8 py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4e3ff] rounded-full text-[#3B82F6] text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">
                auto_awesome
              </span>
              新一代 AI 深度学习驱动
            </div>
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
              AI驱动的投标文件
              <br />
              <span className="text-[#3B82F6]">智能评审自查</span>
            </h1>
            <p className="text-lg text-[#191c1e]/70 max-w-lg leading-relaxed">
              投标前一键自查，精准识别废标风险。覆盖签章、资质、报价、技术响应等全维度检查，让每一次投标都胸有成竹。
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link
                to="/bid"
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#3B82F6]/20 transition-all hover:-translate-y-1 inline-block"
              >
                立即使用
              </Link>
              <button className="flex items-center gap-2 text-[#191c1e] font-semibold px-8 py-4 rounded-xl hover:bg-[#F2F4F6] transition-all">
                <span className="material-symbols-outlined">play_circle</span>
                观看演示
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-on-surface/5">
              {[
                ["6+", "内置检查Skill"],
                ["20+", "废标检查项"],
                ["<3min", "平均检查时间"],
                ["95%+", "风险覆盖率"],
              ].map(([n, l]) => (
                <div key={l} className="flex flex-col">
                  <span className="text-2xl font-black text-[#3B82F6]">
                    {n}
                  </span>
                  <span className="text-xs font-bold text-[#191c1e]/70 uppercase tracking-wider">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#3B82F6]/10 rounded-3xl blur-2xl group-hover:bg-[#3B82F6]/20 transition-all duration-700"></div>
              <div className="relative rounded-[2rem] border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur-[20px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="px-3 py-1 bg-[#3B82F6]/5 rounded-full text-[10px] font-bold text-[#3B82F6] tracking-widest uppercase">
                    Analysis Dashboard
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
                    <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-tighter">
                      Overall Score
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-[#3B82F6]">
                        98.5
                      </span>
                      <span className="text-xs text-emerald-500 font-bold mb-1">
                        ↑ 12%
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3B82F6] w-[98%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
                    <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-tighter">
                      Confidence
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-[#3B82F6]">
                        A+
                      </span>
                      <span className="text-[10px] text-slate-400 mb-1 ml-1">
                        High Accuracy
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">speed</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-32 bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-1.5 w-2/3 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-8 top-1/4 animate-bounce rounded-2xl border border-white/40 bg-white/95 p-4 shadow-xl backdrop-blur-[20px] [animation-duration:3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                      <span className="material-symbols-outlined text-sm">
                        bolt
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400">
                        Processing Time
                      </div>
                      <div className="text-sm font-black">0.8s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-30 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#3B82F6]/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#3B82F6]/10 blur-[80px] rounded-full"></div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 bg-[#F7F9FC] px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-extrabold">核心智能评估能力</h2>
              <p className="text-[#191c1e]/70">
                集成尖端算法，专为高标准商业评估场景设计
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "timer",
                  title: "文件快速研读",
                  desc: "毫秒级响应速度，即刻解析复杂文档逻辑，将原本数小时的工作大幅缩减。",
                },
                {
                  icon: "speed",
                  title: "智能文档解析",
                  desc: "上传招标文件和投标文件，AI自动提取废标/否决条款，精准识别关键要求。",
                },
                {
                  icon: "security",
                  title: "Skill引擎检查",
                  desc: "基于可配置的 Skill 检查引擎，覆盖签章、资质、报价、技术响应等多维度检查。",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-500 group border border-white"
                >
                  <div className="w-14 h-14 bg-[#3B82F6]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3B82F6]/10 transition-colors">
                    <span className="material-symbols-outlined text-[#3B82F6] text-3xl">
                      {f.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                  <p className="text-[#191c1e]/70 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#E6E9EE] to-[#F7F9FC] rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="flex-1 space-y-6 relative z-10">
              <h2 className="text-4xl font-bold leading-tight">
                开启您的智能评分之旅
              </h2>
              <p className="text-[#191c1e]/70 text-lg">
                我们按次数为您量身定制充值方案。
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-[#191c1e]/70">
                  <span className="material-symbols-outlined text-[#3B82F6]">
                    check_circle
                  </span>
                  <span>废标点检查 + 投标预评分，全方位保障投标质量</span>
                </div>
                <div className="flex items-center gap-2 text-[#191c1e]/70">
                  <span className="material-symbols-outlined text-[#3B82F6]">
                    check_circle
                  </span>
                  <span>专家技术支持</span>
                </div>
              </div>
              <button className="bg-[#191c1e] px-8 py-4 rounded-xl font-bold mt-4 text-white hover:bg-[#191c1e]/90 transition-all">
                了解详情
              </button>
            </div>
            <div className="flex-1 relative z-10">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#ECEEF1]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="font-bold text-lg">500 积分 + 200积分</h4>
                    <div className="text-3xl font-black text-[#3B82F6] mt-2">
                      ¥500{" "}
                      <span className="text-sm font-normal text-[#191c1e]/70">
                        / 方案
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      超值赠送
                    </span>
                    <span className="bg-[#d4e3ff] px-3 py-1 rounded-full text-[#3B82F6] text-xs font-bold">
                      推荐
                    </span>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-4 mb-8">
                  {[
                    "充值500送200积分",
                    "积分永久有效",
                    "支持所有 AI 检查 Skill",
                    "详细评分报告",
                    "历史记录永久保存",
                    "专业技术支持",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-sm">
                      <span className="material-symbols-outlined text-[#3B82F6] text-lg">
                        done
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-[#3B82F6]/90 shadow-lg shadow-[#3B82F6]/20 transition-all">
                  立即充值
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#3B82F6]/10 blur-[120px] rounded-full"></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
