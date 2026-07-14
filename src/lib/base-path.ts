// 共享的 basePath 工具，用于在客户端和服务端为图片路径添加前缀
const BASE_PATH = "/whitychen903.github.io";

export function withBasePath(path: string): string {
  // 始终添加 basePath，因为 next.config.ts 中 basePath 已硬编码
  return BASE_PATH + path;
}
