export function SiteFooter() {
  return (
    <footer className="w-full border-t border-on-surface/5 bg-white py-12">
      <div className="mx-auto flex max-w-full flex-col items-center justify-between gap-4 px-8 md:flex-row">
        <div className="text-xs font-medium text-[#191c1e]/60">
          沪ICP备2024077964号-2
        </div>
        <div className="flex gap-8">
          <button className="text-xs font-medium text-[#191c1e]/60 transition-all hover:text-[#3B82F6]">
            用户协议
          </button>
          <button className="text-xs font-medium text-[#191c1e]/60 transition-all hover:text-[#3B82F6]">
            隐私政策
          </button>
          <button className="text-xs font-medium text-[#191c1e]/60 transition-all hover:text-[#3B82F6]">
            联系我们
          </button>
        </div>
      </div>
    </footer>
  );
}
