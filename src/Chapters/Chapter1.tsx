// src/pages/Chapter1.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import MethodFormChapter1 from "../Components/MethodFormChapter1";

const methods = [
    { name: "Bisección", value: "bisection" },
    { name: "Regla Falsa", value: "falseRule" },
    { name: "Punto Fijo", value: "fixedPoint" },
    { name: "Newton", value: "newton" },
    { name: "Secante", value: "secant" },
    { name: "Raíces Múltiples", value: "multipleRoots" },
];

const Chapter1 = () => {
    const [selectedMethod, setSelectedMethod] = useState("bisection");

    return (
        <div className="relative max-w-4xl mx-auto p-4 space-y-6">
            {/* Botón volver a home */}
            <Link
                to="/"
                className="absolute top-4 left-4 px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                aria-label="Volver a Home"
            >
                ← Home
            </Link>

            <h1 className="text-3xl font-bold text-center">Capítulo 1: Métodos de Raíces</h1>

            <div className="flex justify-center">
                <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="p-2 rounded border border-gray-300"
                    aria-label="Seleccionar método numérico"
                >
                    {methods.map((method) => (
                        <option key={method.value} value={method.value}>
                            {method.name}
                        </option>
                    ))}
                </select>
            </div>

            <MethodFormChapter1 method={selectedMethod} />
        </div>
    );
};

export default Chapter1;
