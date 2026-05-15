function trimVal(v) {
  if (typeof v !== "string") return "";
  let s = v.trim();
  if (s.length >= 2 && ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))) {
    return s.slice(1, -1);
  }
  return s;
}

function getMongoUri() {
  const direct = trimVal(process.env.MONGODB_DIRECT_URI || "");
  if (direct.length > 0) return direct;

  const user = trimVal(process.env.MONGODB_USER || "");
  const pass = trimVal(process.env.MONGODB_PASSWORD || "");
  const cluster = trimVal(process.env.MONGODB_CLUSTER || "");
  const dbName = trimVal(process.env.MONGODB_DB_NAME || "zenix_cinema");

  if (user && pass && cluster) {
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  }

  // 3. Check for standard URI
  const uri = trimVal(process.env.MONGODB_URI || "");
  if (uri.length > 0) return uri;

  return "mongodb://127.0.0.1:27017/zenix_cinema";
}

module.exports = { getMongoUri };
