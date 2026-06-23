import { Link, useRouterState } from "@tanstack/react-router";

type NavItem = { label: string; to: "/" | "/bid"; soon?: boolean } | { label: string; href: string; soon?: boolean };

const navItems: NavItem[] = [
  { label: "首页", to: "/" },
  { label: "标书编制", to: "/bid" },
  { label: "工作台", href: "#", soon: true },
  { label: "充值", href: "#", soon: true },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-on-surface/5 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-full items-center justify-between px-8 py-4">
        <Link
          to="/"
          className="font-headline text-xl font-bold tracking-tight text-[#191c1e]"
        >
          原采智擎
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = "to" in item ? isActive(item.to) : false;
              const cls =
                "font-headline text-sm font-semibold transition-all duration-300 " +
                (active
                  ? "relative inline-block text-[#3B82F6] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#3B82F6]"
                  : "text-[#191c1e]/70 hover:text-[#3B82F6]");
              if ("to" in item) {
                return (
                  <Link key={item.label} to={item.to} className={cls}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <a key={item.label} href={item.href} className={cls}>
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#3B82F6]/90"
            >
              <span className="material-symbols-outlined text-[18px]">
                confirmation_number
              </span>
              兑换码优惠
            </button>
            <div className="relative group">
              <div className="flex items-center gap-2 ml-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-on-surface/10 bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
                <span className="material-symbols-outlined text-[#191c1e]/40 text-sm">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
