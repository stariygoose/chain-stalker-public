import { useRef, useEffect } from "react";

declare global {
  interface Window {
    VANTA: {
      HALO: (options: VantaOptions) => VantaInstance;
      CELLS: (options: VantaOptions) => VantaInstance;
      TRUNK: (options: VantaOptions) => VantaInstance;
    };
  }
}

type VantaKeys = Lowercase<keyof typeof global.window.VANTA>;

interface VantaOptions {
  el: HTMLElement | null;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  baseColor?: number;
  backgroundColor?: number;
  amplitudeFactor?: number;
  [key: string]: unknown;
}

interface VantaInstance {
  destroy?: () => void;
}

const Colors = {
  "brand-green": 0x01694e,
  "brang-green-light": 0x04a36d,
  "brand-red": 0xf40405,
  "bg-dark": 0x0b0f10,
  "bg-light": 0xf9fafb,
} as const;

export const VantaBackground = ({ theme }: { theme: "dark" | "light" }) => {
  const vantaRef = useRef(null);
  const vantaInstance = useRef<VantaInstance | null>(null);

  useEffect(() => {
    console.log(`Vanta useEffect runs.`);
    const loadScript = (src: string) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    const init = async (bg: VantaKeys) => {
      if (bg == "trunk") {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/p5@1.11.8/lib/p5.min.js",
        );
      } else {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
        );
      }
      await loadScript(
        `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${bg}.min.js`,
      );

      vantaInstance.current = window.VANTA[
        bg.toUpperCase() as Uppercase<VantaKeys>
      ]({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        spacing: 3.0,
        chaos: 3.5,
        color: Colors["brand-red"],
        backgroundColor:
          theme === "dark" ? Colors["bg-dark"] : Colors["bg-light"],
      });
    };

    init("halo");
    return () => vantaInstance.current?.destroy?.();
  }, [theme]);

  return <div ref={vantaRef} className="w-full h-screen absolute -z-10" />;
};
