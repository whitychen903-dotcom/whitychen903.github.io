export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-jpop-bg text-jpop-text px-4">
      <div className="text-center rounded-3xl bg-jpop-glass/90 backdrop-blur-2xl border border-white/60 p-10 shadow-lg">
        <h1 className="text-6xl font-semibold text-jpop-dark">404</h1>
        <p className="mt-4 text-xl text-jpop-muted font-light">Page Not Found / ページが見つかりません / 页面不存在</p>
        <a
          href="/zh/"
          className="mt-6 inline-block rounded-full bg-jpop-primary px-6 py-2 text-sm font-medium text-white shadow-md shadow-jpop-primary/20 transition hover:bg-jpop-primary/90"
        >
          Back to Home / 返回首页
        </a>
      </div>
    </div>
  );
}
