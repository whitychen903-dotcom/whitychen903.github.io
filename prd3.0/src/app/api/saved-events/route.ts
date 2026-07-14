export const dynamic = "force-static";
export async function GET() {
  return new Response(JSON.stringify({ error: "Not available in static mode" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
export async function POST() {
  return new Response(JSON.stringify({ error: "Not available in static mode" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
export async function DELETE() {
  return new Response(JSON.stringify({ error: "Not available in static mode" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
