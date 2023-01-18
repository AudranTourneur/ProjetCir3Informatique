import { writable } from "svelte/store"

export type EditorState = {
    currentFloor: number,
    currentRoom: number,

}

export const editorStore = writable<EditorState|null>(null)