export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'multitiers');

  return (
    <footer className="border-t border-white/10 bg-nav-bg mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-widest uppercase text-tier-s">MULTI</span>
            <span className="text-xl font-black tracking-widest uppercase text-app-fg">TIERS</span>
          </div>
          <p className="text-app-muted text-sm text-center">
            © {year} MultiTiers. All rights reserved.
          </p>
          <p className="text-app-muted text-sm flex items-center gap-1">
            Built with{' '}
            <span className="text-tier-a" aria-label="love">♥</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tier-s hover:text-tier-s/80 font-semibold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
