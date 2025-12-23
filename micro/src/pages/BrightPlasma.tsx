import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const BrightPlasma: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing BrightPlasma...');

    try {
      const renderer = new Renderer({
        webgl: 2,
        alpha: false, // No transparency for testing
        antialias: false,
        dpr: 1
      });
      
      const gl = renderer.gl;
      console.log('WebGL context created:', gl);
      
      // Set a bright background color
      gl.clearColor(0.2, 0.1, 0.5, 1.0);
      
      const canvas = gl.canvas as HTMLCanvasElement;
      
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.background = 'purple'; // Fallback color
      
      containerRef.current.appendChild(canvas);
      console.log('Canvas appended to container');

      // Very simple and bright shader
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
          // Bright animated colors
          vec3 color = vec3(
            0.5 + 0.5 * sin(iTime),
            0.5 + 0.5 * cos(iTime * 1.5),
            0.5 + 0.5 * sin(iTime * 2.0)
          );
          fragColor = vec4(color, 1.0);
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
        console.log('Cleaning up BrightPlasma...');
        cancelAnimationFrame(raf);
        ro.disconnect();
        if (canvas && containerRef.current) {
          containerRef.current.removeChild(canvas);
        }
      };
    } catch (error) {
      console.error('BrightPlasma failed:', error);
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
        background: 'magenta', // Very visible fallback
        zIndex: 0
      }} 
    />
  );
};

export default BrightPlasma;