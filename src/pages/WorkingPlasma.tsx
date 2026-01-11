import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const WorkingPlasma: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🔥 Starting WorkingPlasma...');

    try {
      const renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: 1
      });
      
      const gl = renderer.gl;
      console.log('✅ WebGL context created:', gl);
      
      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas as HTMLCanvasElement;
      
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '-1';
      
      document.body.appendChild(canvas);
      console.log('✅ Canvas added to body');

      // Simple, working shader
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
        uniform vec2 iResolution;
        
        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          
          float wave1 = sin(uv.x * 10.0 + iTime * 2.0) * 0.5 + 0.5;
          float wave2 = sin(uv.y * 8.0 - iTime * 1.5) * 0.5 + 0.5;
          float wave3 = sin(length(uv - 0.5) * 15.0 + iTime * 3.0) * 0.5 + 0.5;
          
          vec3 color = vec3(
            wave1 * 0.3 + 0.1,
            wave2 * 0.5 + 0.1,
            wave3 * 0.8 + 0.2
          );
          
          fragColor = vec4(color, 0.8);
        }
      `;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: [window.innerWidth, window.innerHeight] }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        program.uniforms.iResolution.value = [window.innerWidth, window.innerHeight];
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const t0 = performance.now();
      let raf = 0;
      const animate = (t: number) => {
        const timeValue = (t - t0) * 0.001;
        program.uniforms.iTime.value = timeValue;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      
      console.log('✅ Animation started');

      return () => {
        console.log('🧹 Cleaning up...');
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      };
    } catch (error) {
      console.error('❌ WorkingPlasma failed:', error);
    }
  }, []);

  return null; // This component doesn't render anything itself
};

export default WorkingPlasma;