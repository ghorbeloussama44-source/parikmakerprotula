"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Particles from "./Particles";
import { prefersReducedMotion } from "@/lib/gsap";

const ASPECT = 580 / 955;

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;

// Distorsion « cheveux » : seules les zones sombres (cheveux) ondulent, le visage reste net.
// Lumière : halo chaud qui suit la souris + pulsation des ampoules du miroir.
const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime, uScroll;
uniform vec2 uMouse;
float luma(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
void main(){
  vec2 uv = vUv;
  vec3 base = texture2D(uTex, uv).rgb;
  float hairMask = smoothstep(.42, .12, luma(base)) * smoothstep(.65, .15, uv.x + (uv.y - .5) * .0);
  float amp = .006 + uScroll * .012;
  vec2 off = vec2(
    sin(uv.y * 14. + uTime * .9) + .5 * sin(uv.y * 31. - uTime * 1.3),
    .4 * sin(uv.x * 20. + uTime * .7)
  ) * amp * hairMask;
  vec3 col = texture2D(uTex, uv + off).rgb;

  // halo du miroir (haut droite)
  vec2 mirror = vec2(.74, .72);
  float pulse = .85 + .15 * sin(uTime * 1.3);
  col += vec3(1., .82, .55) * smoothstep(.35, .0, distance(uv, mirror)) * .22 * pulse;
  // lumière qui suit la souris
  float m = smoothstep(.55, .0, distance(uv, uMouse));
  col += vec3(1., .78, .5) * m * .16;
  // vignette + fondu gauche vers le noir pour le texte
  float edge = smoothstep(.0, .35, uv.x);
  col *= mix(.0, 1., edge) * (1. - .35 * smoothstep(.5, 1., distance(uv, vec2(.5))));
  gl_FragColor = vec4(col, 1.);
  #include <colorspace_fragment>
}`;

function Portrait({ mouse, scroll }: { mouse: React.MutableRefObject<THREE.Vector2>; scroll: React.MutableRefObject<number> }) {
  const tex = useLoader(THREE.TextureLoader, "/img/portrait.jpg");
  const { viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const still = useMemo(() => prefersReducedMotion(), []);
  tex.colorSpace = THREE.SRGBColorSpace;

  const wide = viewport.width / viewport.height > 1;
  const h = wide ? viewport.height * 1.04 : Math.max(viewport.height, viewport.width / ASPECT);
  const w = h * ASPECT;
  const x = wide ? viewport.width / 2 - w / 2 : 0;

  const uniforms = useMemo(() => ({
    uTex: { value: tex }, uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2(.5, .5) },
  }), [tex]);

  useFrame(({ clock }) => {
    const u = mat.current!.uniforms;
    if (!still) u.uTime.value = clock.elapsedTime;
    u.uScroll.value += (scroll.current - u.uScroll.value) * 0.08;
    u.uMouse.value.lerp(new THREE.Vector2(mouse.current.x * .5 + .5, mouse.current.y * .5 + .5), 0.06);
    const g = group.current!;
    g.rotation.y += (mouse.current.x * 0.12 - g.rotation.y) * 0.05;
    g.rotation.x += (-mouse.current.y * 0.06 - g.rotation.x) * 0.05;
    g.position.y = scroll.current * h * 0.12;
    g.position.z = -scroll.current * 1.2;
  });

  return (
    <group ref={group} position={[x, 0, 0]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const mouse = useRef(new THREE.Vector2(0.3, 0.2));
  const scroll = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const move = (e: PointerEvent) => mouse.current.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const sc = () => { scroll.current = Math.min(1, scrollY / innerHeight); };
    addEventListener("pointermove", move);
    addEventListener("scroll", sc, { passive: true });
    return () => { removeEventListener("pointermove", move); removeEventListener("scroll", sc); };
  }, []);

  return (
    // Rendu suspendu quand le hero est hors écran (économie GPU/mémoire sur mobile) ;
    // on évite de perdre le contexte WebGL en preventDefault sur « webglcontextlost ».
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: "default" }}
      frameloop={visible ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        new IntersectionObserver(([en]) => setVisible(en.isIntersecting)).observe(gl.domElement);
      }}
    >
      <Portrait mouse={mouse} scroll={scroll} />
      <Particles count={140} spread={[9, 6, 3]} />
    </Canvas>
  );
}
