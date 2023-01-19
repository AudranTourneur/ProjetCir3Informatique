import type { PageLoad } from './$types';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = (async ({ params }) => {
    try {
        const res = await fetch(`${PUBLIC_API_HOST}/getAllPlans`)
        const plans = (await res.json()).data
        console.log('plan', plans)
        return {
            plans
        };
    } catch (e) {
        return {
            plans: []
        }
    }
}) satisfies PageLoad;