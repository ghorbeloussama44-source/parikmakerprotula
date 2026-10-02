"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Particules dorées flottantes (utilisées dans le hero et la réservation).
export default function Particles({ count = 160, spread = [8, 5, 4], speed = 0.15, size = 0.05 }: {
  count?: number; spread?: number[]; speed?: number; size?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
      seeds[i] = Math.random() * 10;
    }
    return { positions, seeds };
  }, [count, spread]);

  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,236,200,1)");
    grad.addColorStop(0.3, "rgba(214,184,141,.7)");
    grad.addColorStop(1, "rgba(214,184,141,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(({ clock }) => {
    const p = ref.current;
    if (!p) return;
    const t = clock.elapsedTime * speed;
    const a = p.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      a.setY(i, ((positions[i * 3 + 1] + t * (0.4 + (s % 1)) + spread[1] / 2) % spread[1]) - spread[1] / 2);
      a.setX(i, positions[i * 3] + Math.sin(t * 2 + s) * 0.15);
    }
    a.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={size} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#D6B88D" />
    </points>
  );
}
