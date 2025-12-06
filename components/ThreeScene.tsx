"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Html, Text, Float } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

// Service Nodes configuration
const services = [
    { id: "gateway", position: [0, 2, 0], color: "#34d399", label: "Gateway" },
    { id: "auth", position: [-3, 0, 2], color: "#a78bfa", label: "Auth" },
    { id: "order", position: [3, 0, 2], color: "#60a5fa", label: "Order" },
    { id: "db", position: [0, -3, 0], color: "#fbbf24", label: "Primary DB" },
    { id: "analytics", position: [-2, -2, -3], color: "#f472b6", label: "Analytics" },
    { id: "cache", position: [2, -2, -3], color: "#9ca3af", label: "Cache" }
];

// Define connections between nodes
const connections = [
    ["gateway", "auth"],
    ["gateway", "order"],
    ["auth", "db"],
    ["order", "db"],
    ["order", "cache"],
    ["order", "analytics"],
    ["db", "analytics"]
];

function DataPacket({ start, end, speed, offset, color }: { start: number[], end: number[], speed: number, offset: number, color: string }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = (state.clock.getElapsedTime() * speed + offset) % 1;
        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);
        // Linear interpolation for travel
        meshRef.current.position.copy(startVec.lerp(endVec, t));
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
    );
}

function ServiceNode({ position, color, label }: { position: number[], color: string, label: string }) {
    const [hovered, setHover] = useState(false);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={new THREE.Vector3(...position)}>
                {/* Core Node */}
                <mesh onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                    <icosahedronGeometry args={[0.8, 0]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} opacity={0.9} transparent />
                </mesh>

                {/* Glow Effect */}
                <mesh scale={hovered ? 1.2 : 1}>
                    <sphereGeometry args={[0.85, 16, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                </mesh>

                {/* Label */}
                <Html distanceFactor={12} transform position={[0, 1.2, 0]}>
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold text-white whitespace-nowrap">
                        {label}
                    </div>
                </Html>
            </group>
        </Float>
    );
}

function NetworkGraph() {
    // Memoize line points
    const lines = useMemo(() => {
        return connections.map(([startId, endId]) => {
            const startNode = services.find(s => s.id === startId)!;
            const endNode = services.find(s => s.id === endId)!;
            return {
                points: [new THREE.Vector3(...startNode.position), new THREE.Vector3(...endNode.position)],
                color: "#4b5563",
                start: startNode.position,
                end: endNode.position
            };
        });
    }, []);

    return (
        <group>
            {/* Draw Nodes */}
            {services.map(service => (
                <ServiceNode key={service.id} {...service} />
            ))}

            {/* Draw Connections */}
            {lines.map((line, i) => (
                <group key={i}>
                    {/* The Line Wire */}
                    <Line points={line.points} color={line.color} opacity={0.2} transparent lineWidth={1} />

                    {/* Traveling Packets */}
                    <DataPacket start={line.start} end={line.end} speed={1} offset={Math.random()} color="#60a5fa" />
                    <DataPacket start={line.end} end={line.start} speed={0.5} offset={Math.random()} color="#34d399" />
                </group>
            ))}
        </group>
    );
}

export default function ThreeScene() {
    return (
        <div className="h-full w-full relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#60a5fa" />

                {/* Network */}
                <NetworkGraph />

                {/* Controls & FX */}
                <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
            </Canvas>
        </div>
    );
}
