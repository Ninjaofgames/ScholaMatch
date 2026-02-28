import { useEffect, useRef } from "react";
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

export function VantaBg() {
    const vantaEffect = useRef(null);

    useEffect(() => {
        window.THREE = THREE;

        if (!vantaEffect.current) {
            vantaEffect.current = NET({
                el: document.body,  // ← attach to body directly
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                color: 0x5FC3DC,
                backgroundColor: 0x0f1923,
                points: 14.00,
                maxDistance: 22.00,
                spacing: 18.00,
                showDots: true,
            });
        }
        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    return null;  // ← no div needed
}