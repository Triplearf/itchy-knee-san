'use client';
import React, { useRef, useEffect, useState } from "react";

type Point = { x: number, y: number}
type StrokeData = { points: Point[], width: number, color: string}

export default function DrawingWidget() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    // Master list of strokes
    const [strokes, setStrokes] = useState<StrokeData[]>([]);

    // Default values
    const defaultLineWidth = 5
    const defaultLineColor = '#000000'

    const [lineWidth, setLineWidth] = useState(defaultLineWidth);
    const [lineColor, setLineColor] = useState(defaultLineColor);

    // Current stroke to be pushed to master strokes
    const currentStroke = useRef<StrokeData>({ points: [], width: defaultLineWidth, color: defaultLineColor });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = lineWidth;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setContext(ctx);
    }, [lineWidth, lineColor, context]);

    const startDrawing = ( ( e: React.MouseEvent ) => {
        if (!context) return;

        const xPos = e.nativeEvent.offsetX;
        const yPos = e.nativeEvent.offsetY;

        const strokeWidth = lineWidth
        const strokeColor = lineColor

        currentStroke.current = {
            points: [{ x: xPos, y: yPos }],
            width: strokeWidth,
            color: strokeColor
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
                width: currentStroke.current.width,         // Copy the width
                color: currentStroke.current.color
            };
            setStrokes((prevStrokes) => [...prevStrokes, strokeToSave]);
        }
        
        currentStroke.current = { points: [], width: lineWidth, color: lineColor };
        setIsDrawing(false);

        console.log(strokes)
    })

    const redrawCanvasFromStrokes = ( strokesToDraw : StrokeData[] ) => {
        if (!context || !canvasRef.current) return;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        strokesToDraw.forEach(stroke => {
            if (stroke.points.length === 0) return;

            context.beginPath();
            context.lineWidth = stroke.width;
            context.strokeStyle = stroke.color;
            context.moveTo(stroke.points[0].x, stroke.points[0].y)

            for (let i = 1; i < stroke.points.length; i++) {
                context.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            context.stroke();
        });
    }

    const clear = ( e: React.MouseEvent ) => {
        if (!context || !canvasRef.current) return;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
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

    const submit = async () => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob(async (blob) => {
            if (!blob) {
                console.error("Canvas is empty");
                return;
            }

            const formData = new FormData();
            formData.append("file", blob, "new_doodle.png"); 
            formData.append("content", new Date().toString()); 

            try {
                const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;

                if (!webhookUrl) {
                    console.log("Missing webHookUrl");
                    return;
                }

                const response = await fetch(webhookUrl, {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    console.log("Doodle sent to Discord!");
                    alert("Thank you kind fella");
                    // Optional: Add erasing of canvas
                    
                } else {
                    console.error("Failed to send doodle");
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        }, 'image/png'); 
    }

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

            <input
                type="color"
                defaultValue={defaultLineColor}
                onChange={(e) => setLineColor(e.target.value)}
                style={{ backgroundColor: lineColor }}
                className="
                rounded-bl-lg col-span-2 w-full cursor-pointer
                border-2 border-deep-mocha-900 shadow-hard-br5 shadow-taupe-800
                p-0 bg-transparent
                [&::-webkit-color-swatch-wrapper]:p-0
                [&::-webkit-color-swatch]:border-none
                [&::-moz-color-swatch]:border-none
            ">
            </input>

            <button
                onClick={submit}
                className="
                rounded-br-lg
                flex items-center justify-center cursor-pointer transition 
                hover:scale-110 select-none
                border-2 border-deep-mocha-900 shadow-hard-br5 shadow-taupe-800 bg-amber-100">
                    Submit
            </button>
        </div>
    </div>

    );
}