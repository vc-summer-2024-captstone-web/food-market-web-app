export async function response(body: {} | null, status: number = 200): Promise<Response> {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
