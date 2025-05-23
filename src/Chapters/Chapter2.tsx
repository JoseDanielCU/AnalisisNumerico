// src/pages/Chapter2.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import MethodFormChapter2 from "../Components/MethodFormChapter2";

const methods = [
    { name: "Jacobi", value: "jacobi" },
    { name: "Gauss-Seidel", value: "gaussSeidel" },
    { name: "SOR", value: "sor" },
];

const Chapter2 = () => {
    const [selectedMethod, setSelectedMethod] = useState("jacobi");

    return (
        <div className="relative max-w-4xl mx-auto p-4 space-y-6">
            <Link
                to="/"
                className="absolute top-4 left-4 px-3 py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                aria-label="Volver a Home"
            >
                ← Home
            </Link>

            <h1 className="text-3xl font-bold text-center">Capítulo 2: Métodos Iterativos para Sistemas Lineales</h1>

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

            <MethodFormChapter2 method={selectedMethod} />
        </div>
    );
};

export default Chapter2;