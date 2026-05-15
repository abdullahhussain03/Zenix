const envUrl =
  typeof process.env.REACT_APP_API_URL === "string"
    ? process.env.REACT_APP_API_URL.trim()
    : ""

const API_BASE =
  envUrl.length > 0
    ? envUrl.replace(/\/$/, "")
    : "http://localhost:5000" 

export function mediaUrl(localPath) {
  if (!localPath) {
    return null
  }
  if (
    localPath.startsWith("http://") ||
    localPath.startsWith("https://")
  ) {
    return localPath
  }
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const path = localPath.startsWith("/") ? localPath : "/" + localPath;
  return base + path;
}

export { API_BASE }
