import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/bid")({
  head: () => ({
    meta: [
      { title: "标书编制 — 原采智擎" },
      { name: "description", content: "您的智能标书生成助手" },
    ],
  }),
  component: BidLayout,
});

const sideItems = [
  { to: "/bid", label: "首页", icon: "home", exact: true },
  { to: "/bid/library", label: "知识库", icon: "library_books", exact: false },
  { to: "/bid/my", label: "我的标书", icon: "description", exact: false },
];

function BidLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });
  const inFlow = pathname.startsWith("/bid/new");
  const fromMy = inFlow && search?.from === "my";
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <SiteHeader />
      <div className="flex pt-16">
        <aside className="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-on-surface/5 px-4 py-6 flex flex-col gap-1">
          <div className="px-3 mb-4">
            <div className="text-xs font-bold text-[#191c1e]/40 uppercase tracking-wider">
              标书编制
            </div>
          </div>
          {sideItems.map((item) => {
            let active = false;
            if (inFlow) {
              active = fromMy ? item.to === "/bid/my" : item.to === "/bid";
            } else if (item.exact) {
              active = pathname === item.to || pathname === item.to + "/";
            } else {
              active = pathname.startsWith(item.to);
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all " +
                  (active
                    ? "bg-[#D4E3FF] text-[#3B82F6]"
                    : "text-[#191c1e]/70 hover:bg-[#F2F4F6]")
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </aside>
        <main className="flex-1 ml-60 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
