import {createContext, use} from 'react'

// Easter egg: while the mouse is over the photo, photo and introduction show their shadow versions. Both may
// sit in different places of the page depending on the layout, hence a context instead of local state.

interface ShadowState {
    shadow: boolean
    setShadow: (shadow: boolean) => void
}

export const ShadowContext = createContext<ShadowState>({
    shadow: false,
    setShadow: () => undefined,
})

export function useShadow(): ShadowState {
    return use(ShadowContext)
}
