"use client"
import { useState, useEffect, useRef } from "react"

const CursorShower = () => {
    const [leaves, setLeaves] = useState([])
    const lastTimeRef = useRef(0)

    useEffect(() => {
        const handleMouseMove = (e) => {
            const now = Date.now()

            // 👉 Same throttle as before (no logic change)
            if (now - lastTimeRef.current > 20) {
                const leavesToAdd = []

                // 👉 Same 3 leaves generation (unchanged)
                for (let i = 0; i < 3; i++) {
                    leavesToAdd.push({
                        id: now + i,
                        x: e.clientX + (Math.random() * 16 - 8), // 👉 thoda kam spread (smooth look)
                        y: e.clientY + (Math.random() * 16 - 8),
                        rotation: Math.random() * 180 - 90, // 👉 extreme rotation hata diya
                        size: Math.random() * 18 + 22, // 👉 controlled size (premium feel)
                    })
                }

                setLeaves((prev) => [...prev, ...leavesToAdd])
                lastTimeRef.current = now

                // 👉 Same cleanup logic (unchanged)
                setTimeout(() => {
                    setLeaves((prev) =>
                        prev.filter(
                            (leaf) => !leavesToAdd.some((newLeaf) => newLeaf.id === leaf.id)
                        )
                    )
                }, 2000) // 👉 slightly shorter for cleanliness
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {leaves.map((leaf) => (
                <img
                    key={leaf.id}
                    src="/leaf.svg"
                    alt=""
                    className="absolute animate-cursor-shower"
                    style={{
                        left: leaf.x,
                        top: leaf.y,
                        width: leaf.size,
                        height: leaf.size,

                        // 👉 Rotation smooth rakhi (no jitter)
                        transform: `rotate(${leaf.rotation}deg)`,

                        // 👉 CSS variables only for animation
                        "--fall-distance": `${Math.random() * 40 + 40}px`,
                        "--rotation-end": `${leaf.rotation + (Math.random() * 40 - 20)}deg`,
                    }}
                />
            ))}
        </div>
    )
}

export default CursorShower
