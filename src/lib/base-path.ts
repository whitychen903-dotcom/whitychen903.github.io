// 共享的 basePath 工具，用于在客户端和服务端为图片路径添加前缀
const BASE_PATH = "/whitychen903.github.io";

export function withBasePath(path: string): string {
  if (process.env.GITHUB_PAGES === "true") {
    return BASE_PATH + path;
  }
  return path;
}
