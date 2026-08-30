// Disabled: Auth is handled by Cloudflare Workers Backend
export async function GET() {
    return new Response("Auth is handled by Cloudflare Workers backend", { status: 404 });
}

export async function POST() {
    return new Response("Auth is handled by Cloudflare Workers backend", { status: 404 });
}
