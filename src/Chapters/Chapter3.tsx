// src/pages/Chapter3.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import MethodFormChapter3 from "../Components/MethodFormChapter3";

const methods = [
    { name: "Vandermonde", value: "vandermonde" },
    { name: "Newton Interpolante", value: "newton" },
    { name: "Lagrange", value: "lagrange" },
    { name: "Spline Lineal", value: "linearSpline" },
    { name: "Spline Cúbico", value: "cubicSpline" },
];

const Chapter3 = () => {
    const [selectedMethod, setSelectedMethod] = useState("vandermonde");

    return (
        <div className="relative max-w-4xl mx-auto p-4 space-y-6">
            <Link
                to="/"
                className="absolute top-4 left-4 px-3 py-1 rounded bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                aria-label="Volver a Home"
            >
                ← Home
            </Link>

            <h1 className="text-3xl font-bold text-center">Capítulo 3: Métodos de Interpolación</h1>

            <div className="flex justify-center">
                <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="p-2 rounded border border-gray-300"
                    aria-label="Seleccionar método de interpolación"
                >
                    {methods.map((method) => (
                        <option key={method.value} value={method.value}>
                            {method.name}
                        </option>
                    ))}
                </select>
            </div>

            <MethodFormChapter3 method={selectedMethod} />
        </div>
    );
};

export default Chapter3;