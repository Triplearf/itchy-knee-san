"use client";
import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const dotSize = 1;
    const gridSize = 10;
    const maxScale = 4
    const interactionRadius = 25;
    const baseColor = 210; // light grey
    const rippleColor = 90; //dark grey
    const rippleSpeed = 1; // pixels per millisecond
    const rippleDuration = 2000; // milliseconds
    const rippleGirth = 20; // grids
    const autoBeatsPerClick = 110;

    let mouseX = 0;
    let mouseY = 0;
    const clicks: { x: number; y: number; time: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    let mouseDown = false

    const handleMouseDown = (e: MouseEvent) => {
      mouseDown = true;
      clicks.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    }

    const handleMouseUp = () => {
      mouseDown = false;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const autoSecondsPerClick = 60 / autoBeatsPerClick

    // const autoClicker = setInterval(
    //   () => clicks.push({
    //     x: Math.random() * canvas.width,
    //     y: Math.random() * canvas.height,
    //     time: Date.now()}),
    //   autoSecondsPerClick * 1000
    // )

    let prevTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now();

      if (mouseDown && currentTime - prevTime >= 100) {
        clicks.push({ x: mouseX, y: mouseY, time: Date.now() });
        prevTime = currentTime;
      }

      // Remove old clicks
      for (let i = clicks.length - 1; i >= 0; i--) {
        if (currentTime - clicks[i].time > rippleDuration) {
          clicks.splice(i, 1);
        }
      }
      
      // Render all dots
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const mouseDistance = Math.sqrt(dx * dx + dy * dy);

          let colorCorrection = 0;
          let maxScale = 3;

          // Mouse hover effect
          maxScale = Math.max(1, maxScale - (mouseDistance / interactionRadius));

          // Check for ripple effects
          for (const click of clicks) {
            const clickDx = click.x - x;
            const clickDy = click.y - y;
            const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
            const elapsed = currentTime - click.time;
            const rippleRadius = elapsed * rippleSpeed;

            if (Math.abs(clickDistance - rippleRadius) <= rippleGirth * gridSize) {
              const t = Math.max(0, 1 - (clickDistance / rippleRadius));
              colorCorrection = Math.max(colorCorrection, t);
              const rippleScale = 5 * (1 - clickDistance / rippleRadius);
              maxScale = Math.max(maxScale, rippleScale);
            }
          }

          const red = Math.round(baseColor + (252 - baseColor) * colorCorrection);
          const green = Math.round(baseColor + (174 - baseColor) * colorCorrection);
          const blue = Math.round(baseColor + (5 - baseColor) * colorCorrection);

          ctx.beginPath();
          ctx.arc(x, y, dotSize * maxScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      // clearInterval(autoClicker);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  );
}