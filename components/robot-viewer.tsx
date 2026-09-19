"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Bounds, OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

function Model({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <Bounds fit clip observe margin={1.2}>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#c3cad4" roughness={0.5} metalness={0.25} />
      </mesh>
    </Bounds>
  );
}

class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean; message?: string }> {
  state: { failed: boolean; message?: string } = { failed: false };
  static getDerivedStateFromError(error: unknown) {
    return { failed: true, message: error instanceof Error ? error.message : String(error) };
  }
  componentDidCatch(error: unknown) {
    console.error("[robot-viewer] failed to load STL:", error);
  }
  render() {
    if (this.state.failed) {
      return (
        <p className="muted">
          לא ניתן לטעון את המודל התלת-ממדי.
          {this.state.message && <><br /><span dir="ltr" style={{ fontSize: 12, opacity: 0.7 }}>{this.state.message}</span></>}
        </p>
      );
    }
    return this.props.children;
  }
}

export function RobotViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="robot-canvas">
      <ModelErrorBoundary>
        <Canvas camera={{ fov: 40 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} />
          <directionalLight position={[-5, -3, -5]} intensity={0.35} />
          <Suspense fallback={null}>
            <Model url={modelUrl} />
          </Suspense>
          <OrbitControls makeDefault enableDamping />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}
