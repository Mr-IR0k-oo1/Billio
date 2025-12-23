import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const SimplePlasma: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing SimplePlasma...');

    try {
      const renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      
      const gl = renderer.gl;
      console.log('WebGL context created:', gl);
      
      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas as HTMLCanvasElement;
      
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      
      containerRef.current.appendChild(canvas);
      console.log('Canvas appended to container');

      // Simple shader that just shows a color
      const vertex = `#version 300 es
        precision highp float;
        in vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fragment = `#version 300 es
        precision highp float;
        out vec4 fragColor;
        uniform float iTime;
        void main() {
          vec3 color = vec3(
            sin(iTime) * 0.5 + 0.5,
            cos(iTime * 1.3) * 0.5 + 0.5,
            sin(iTime * 0.7) * 0.5 + 0.5
          );
          fragColor = vec4(color, 0.8);
        }
      `;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iTime: { value: 0 }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      const setSize = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        renderer.setSize(width, height);
        console.log('Size set to:', width, 'x', height);
      };

      const ro = new ResizeObserver(setSize);
      ro.observe(containerRef.current);
      setSize();

      const t0 = performance.now();
      let raf = 0;
      const loop = (t: number) => {
        const timeValue = (t - t0) * 0.001;
        program.uniforms.iTime.value = timeValue;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      console.log('Animation loop started');

      return () => {
        console.log('Cleaning up SimplePlasma...');
        cancelAnimationFrame(raf);
        ro.disconnect();
        if (canvas && containerRef.current) {
          containerRef.current.removeChild(canvas);
        }
      };
    } catch (error) {
      console.error('SimplePlasma failed:', error);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(124, 58, 237, 0.3))',
        zIndex: 0
      }} 
    />
  );
};

export default SimplePlasma;