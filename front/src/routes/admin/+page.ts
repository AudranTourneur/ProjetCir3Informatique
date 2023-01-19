import { PUBLIC_API_HOST } from "$env/static/public"
import { image } from "d3";

export async function load() {
    let images;
    let plans;

    try {
        const imagesRes = await fetch(`${PUBLIC_API_HOST}/getImagesList`)
        images = await imagesRes.json()

        plans = (await (await fetch(`${PUBLIC_API_HOST}/getAllPlans`)).json()).data
    } catch (e) {
        console.error(e)
    }

    return { images, plans }
}