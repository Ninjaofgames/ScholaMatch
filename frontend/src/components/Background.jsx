import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export function VantaBg() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    return init ? (
        <Particles
            id="tsparticles"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}
            options={{
                background: {
                    color: { value: "#0f1923" },
                },
                particles: {
                    number: { value: 80 },
                    color: { value: "#5FC3DC" },
                    links: {
                        enable: true,
                        color: "#5FC3DC",
                        distance: 150,
                        opacity: 0.4,
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                    },
                    opacity: { value: 0.5 },
                    size: { value: 3 },
                },
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "repulse" },
                        onClick: { enable: true, mode: "push" },
                    },
                },
            }}
        />
    ) : null;
}