import { PUBLIC_API_HOST } from "$env/static/public"

export async function load() {
    let images = await fetch(`${PUBLIC_API_HOST}/getImagesList`)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.error(err))

    return {images}
}