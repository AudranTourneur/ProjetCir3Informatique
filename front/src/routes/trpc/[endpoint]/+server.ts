import type { RequestHandler } from './$types';

import { SVELTEKIT_HOST, API_HOST } from '$env/static/private'

const sveltekitHost = SVELTEKIT_HOST ?? 'localhost:5173'
const apiHost = API_HOST ?? 'localhost:8080'

async function proxyRequest(request: Request): Promise<Response> {
  //console.log({SVELTEKIT_HOST, API_HOST })
  const proxiedRequest = new Request(request.url.replace(sveltekitHost, apiHost), request)
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