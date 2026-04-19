'use client';
import React, { useRef, useEffect, useState } from "react";

type Point = { x: number, y: number}
type StrokeData = { points: Point[], width: number}

export default function DrawingWidget() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    // Master list of strokes
    const [strokes, setStrokes] = useState<StrokeData[]>([]);

    const [lineWidth, setLineWidth] = useState(5);

    // Current stroke to be pushed to master strokes
    const currentStroke = useRef<StrokeData>({ points: [], width: 5 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = lineWidth;
        setContext(ctx);
    }, [lineWidth, context]);

    const startDrawing = ( ( e: React.MouseEvent ) => {
        if (!context) return;

        const xPos = e.nativeEvent.offsetX;
        const yPos = e.nativeEvent.offsetY;

        const strokeWidth = lineWidth

        currentStroke.current = {
            points: [{ x: xPos, y: yPos }],
            width: strokeWidth
        };

        context.beginPath();
        context.moveTo(xPos, yPos);
        setIsDrawing(true);
    })

    const draw = ( ( e: React.MouseEvent ) => {
        if (!isDrawing || !context) return;

        const xPos = e.nativeEvent.offsetX;
        const yPos = e.nativeEvent.offsetY;

        // Add to current strokes
        currentStroke.current.points.push({ x: xPos, y: yPos });

        redrawCanvasFromStrokes([...strokes, currentStroke.current]);
    })

    const stopDrawing = ( ( e: React.MouseEvent ) => {
        if (!context) return;

        if (currentStroke.current.points.length > 0) {
            const strokeToSave: StrokeData = {
                points: [...currentStroke.current.points], // Hard copy the points
                width: currentStroke.current.width         // Copy the width
            };
            setStrokes((prevStrokes) => [...prevStrokes, strokeToSave]);
        }
        
        currentStroke.current = { points: [], width: 10 };
        setIsDrawing(false);

        console.log(strokes)
    })

    const redrawCanvasFromStrokes = ( strokesToDraw : StrokeData[] ) => {
        if (!context || !canvasRef.current) return;

        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        strokesToDraw.forEach(stroke => {
            if (stroke.points.length === 0) return;

            context.beginPath();
            context.lineWidth = stroke.width;
            context.moveTo(stroke.points[0].x, stroke.points[0].y)

            for (let i = 1; i < stroke.points.length; i++) {
                context.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            context.stroke();
        });
    }

    const clear = ( e: React.MouseEvent ) => {
        if (!context || !canvasRef.current) return;
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setStrokes([]);
        console.log(strokes);
    };

    const undo = ( e: React.MouseEvent ) => {
        if (strokes.length === 0) return;

        const updatedStrokes = strokes.slice(0, -1);
        setStrokes(updatedStrokes);
        redrawCanvasFromStrokes(updatedStrokes);
        console.log(strokes);
    };

    return (
    <div className="flex justify-center pt-6">
        <div className="grid grid-cols-3 max-w-[75vw]">
            <button
                onClick={clear}
                className="
                rounded-tl-lg
                flex items-center justify-center cursor-pointer transition 
                hover:scale-110 select-none
                border-2 border-deep-mocha-900 shadow-hard-br5 shadow-taupe-800 bg-amber-100">
                    Clear
            </button>

            <div className="
            flex items-center px-2
            border-2 border-deep-mocha-900
            shadow-hard-br5 shadow-taupe-800
            bg-amber-50
            transition hover:scale-110">
                <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={lineWidth} 
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="
                    w-full h-2 rounded-lg appearance-none cursor-pointer 
                    accent-deep-mocha-800 hover:accent-deep-mocha-900
                    border-2 border-deep-mocha-900 bg-soft-fawn-50
                    flex items-center justify-center"
                />
            </div>
            

            <button
                onClick={undo}
                className="
                rounded-tr-lg
                flex items-center justify-center cursor-pointer transition 
                hover:scale-110 select-none
                border-2 border-deep-mocha-900 shadow-hard-br5 shadow-taupe-800 bg-amber-100">
                    Undo
            </button>

            <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 border-deep-mocha-900 shadow-hard-br5 shadow-taupe-800 bg-white col-span-3"
            width={500}
            height={500}
            />
        </div>
    </div>

    );
}