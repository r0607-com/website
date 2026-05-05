import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase";

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? "";

async function computeToken(email: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(email));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function htmlPage(title: string, body: string): NextResponse {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} | R0607</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:480px;margin:4rem auto;padding:0 1rem;color:#e2e8f0;background:#0d1117}
    h1{font-size:1.5rem;margin-bottom:1rem}
    a{color:#7ee8fa}
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>${body}</p>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const email = searchParams.get("email")?.toLowerCase() ?? "";
  const token = searchParams.get("token") ?? "";

  if (!email || !token) {
    return htmlPage("Invalid Request", "Missing email or token.");
  }

  if (!SECRET) {
    return htmlPage("Unavailable", "Unsubscribe is not configured on this server.");
  }

  const expected = await computeToken(email);
  if (token !== expected) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return htmlPage("Unavailable", "Database is not configured. Contact hello@r0607.com.");
  }

  const { error } = await supabase
    .from("workshop_signups")
    .delete()
    .eq("email", email);

  if (error) {
    return htmlPage("Error", "Something went wrong. Please contact hello@r0607.com.");
  }

  return htmlPage(
    "Unsubscribed",
    'Your workshop interest data has been deleted. <a href="/">Return to R0607</a>',
  );
}
