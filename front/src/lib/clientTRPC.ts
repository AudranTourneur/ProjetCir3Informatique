import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../back/src/server';

export function getTRPCClient() {
	const trpc = createTRPCProxyClient<AppRouter>({
		links: [
			httpBatchLink({
				//url: 'http://localhost:8080/trpc',
				url: 'http://localhost:5173/trpc',
			}),
		],
	});
	return trpc
}