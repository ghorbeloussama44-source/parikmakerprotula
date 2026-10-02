"use client";
import { Canvas } from "@react-three/fiber";
import Particles from "./Particles";

export default function BookingScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <Particles count={220} spread={[12, 8, 5]} speed={0.08} size={0.07} />
    </Canvas>
  );
}
