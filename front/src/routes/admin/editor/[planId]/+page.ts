import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = (async ({ params }) => {
    try {
        const planId = params.planId;
        const res = await fetch(`${PUBLIC_API_HOST}/getPlan/${planId}`)
        const plan = await res.json()
        return {
            plan
        };
    } catch (e) {
        return {
            plan: null
        }
    }
}) satisfies PageLoad;