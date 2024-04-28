import { useRef } from "react";

export function useRenderCount(name: string, enabled: boolean) {
    const renders = useRef(1);
    if (enabled) console.log(`${name} Render #${renders.current++}`);
}