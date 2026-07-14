// This file forces static export for API routes
// These routes won't work in static export mode, but the rest of the site will
export const dynamic = "force-static";
export async function GET() {
  return new Response(JSON.stringify({ error: "Not available in static mode" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
