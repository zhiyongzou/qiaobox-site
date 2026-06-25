export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env)
      });
    }

    if (url.pathname !== "/api/visit" || request.method !== "POST") {
      return jsonResponse({ error: "Not found" }, 404, request, env);
    }

    if (!env.DB) {
      return jsonResponse({ error: "Visit counter is not configured" }, 500, request, env);
    }

    const counterName = env.COUNTER_NAME || "qiaobox-site-total";
    await env.DB
      .prepare(
        "INSERT INTO visit_counter (name, count) VALUES (?, 1) " +
          "ON CONFLICT(name) DO UPDATE SET count = count + 1"
      )
      .bind(counterName)
      .run();

    const row = await env.DB
      .prepare("SELECT count FROM visit_counter WHERE name = ?")
      .bind(counterName)
      .first();

    return jsonResponse({ count: Number(row?.count || 0) }, 200, request, env);
  }
};

function jsonResponse(payload, status, request, env) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function corsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
