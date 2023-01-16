import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const SVELTEKIT_HOST = 'localhost:5173'
const SERVER_HOST = 'localhost:8080'

async function proxyRequest(request: Request): Promise<Response> {
  const proxiedRequest = new Request(request.url.replace(SVELTEKIT_HOST, SERVER_HOST), request)
  const apiRes = await fetch(proxiedRequest)
  return apiRes
}

export const GET = (async ({ request }) => {
  console.log('Hit GET Proxy')
  return await proxyRequest(request)
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  console.log('Hit POST Proxy')
  return await proxyRequest(request)
}) satisfies RequestHandler;