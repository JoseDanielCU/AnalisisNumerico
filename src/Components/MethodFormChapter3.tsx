// src/Components/MethodFormChapter3.tsx
import { useState } from "react";
import { vandermondeMethod, VandermondeResult } from "../Methods/VanderMonde";
import { newtonInterpolantMethod, NewtonResult } from "../Methods/NewtonInt";
import { lagrangeMethod, LagrangeResult } from "../Methods/Lagrange";
import { linearSplineMethod, LinearSplineResult } from "../Methods/SplineLineal";
import { cubicSplineMethod, CubicSplineResult } from "../Methods/Spline Cubico";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

type InterpolationResult = VandermondeResult | NewtonResult | LagrangeResult | LinearSplineResult | CubicSplineResult;

const MethodFormChapter3 = ({ method }: { method: string }) => {
    const [points, setPoints] = useState<[number, number][]>([[0, 0], [1, 1], [2, 4]]);
    const [testPoint, setTestPoint] = useState(1.5);
    const [result, setResult] = useState<InterpolationResult>({ polynomial: "" });
    const [showHelp, setShowHelp] = useState(false);
    const [generateReport, setGenerateReport] = useState(false);
    const [reportResults, setReportResults] = useState<
        { name: string; polynomial: string; testValue: number; error?: string | number }[]
    >([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState<"abs" | "rel">("abs");

    const methodDescriptions: Record<string, string> = {
        vandermonde: "El método de Vandermonde construye un polinomio interpolante resolviendo un sistema lineal basado en la matriz de Vandermonde.",
        newton: "El método de Newton Interpolante usa diferencias divididas para construir un polinomio de forma eficiente.",
        lagrange: "El método de Lagrange construye un polinomio como combinación lineal de polinomios base de Lagrange.",
        linearSpline: "El método de Spline Lineal genera funciones lineales por tramos entre cada par de puntos.",
        cubicSpline: "El método de Spline Cúbico genera funciones cúbicas por tramos, asegurando continuidad en la primera y segunda derivada.",
    };

    const handlePointInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        type: "x" | "y"
    ) => {
        const newPoints = [...points];
        newPoints[index][type === "x" ? 0 : 1] = parseFloat(e.target.value) || 0;
        setPoints(newPoints);
    };

    const handleAddPoint = () => {
        if (points.length < 8) {
            setPoints([...points, [0, 0]]);
        }
    };

    const handleRemovePoint = (index: number) => {
        if (points.length > 2) {
            setPoints(points.filter((_, i) => i !== index));
        }
    };

    const validateInputs = () => {
        const xValues = points.map(p => p[0]);
        const uniqueX = new Set(xValues);
        if (uniqueX.size !== xValues.length) {
            setErrorMessage("Los valores de x deben ser distintos.");
            return false;
        }
        if (points.length < 2) {
            setErrorMessage("Se requieren al menos 2 puntos.");
            return false;
        }
        return true;
    };

    const evaluatePolynomial = (coefficients: number[], x: number, xPoints?: number[]): number => {
        let result = 0;
        if (method === "newton" && xPoints) {
            for (let i = coefficients.length - 1; i >= 0; i--) {
                let term = coefficients[i];
                for (let j = 0; j < i; j++) {
                    term *= (x - xPoints[j]);
                }
                result += term;
            }
        } else {
            for (let i = 0; i < coefficients.length; i++) {
                result += coefficients[i] * Math.pow(x, coefficients.length - 1 - i);
            }
        }
        return result;
    };

    const evaluateLagrange = (points: [number, number][], x: number): number => {
        const n = points.length;
        let result = 0;
        for (let i = 0; i < n; i++) {
            let term = points[i][1];
            let denominator = 1;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x - points[j][0]);
                    denominator *= (points[i][0] - points[j][0]);
                }
            }
            result += term / denominator;
        }
        return result;
    };

    const evaluateSpline = (
        segments: { m?: number; b?: number; a?: number; c?: number; d?: number; interval: [number, number] }[],
        x: number
    ): number => {
        for (const seg of segments) {
            if (x >= seg.interval[0] && x <= seg.interval[1]) {
                if ("m" in seg) {
                    return seg.m! * x + seg.b!;
                } else {
                    const dx = x - seg.interval[0];
                    return seg.a! + seg.b! * dx + seg.c! * dx ** 2 + seg.d! * dx ** 3;
                }
            }
        }
        return 0;
    };

    const runMethod = () => {
        if (!validateInputs()) return;

        setErrorMessage("");
        let res: InterpolationResult = { polynomial: "" };

        try {
            switch (method) {
                case "vandermonde":
                    res = vandermondeMethod(points);
                    break;
                case "newton":
                    res = newtonInterpolantMethod(points);
                    break;
                case "lagrange":
                    res = lagrangeMethod(points);
                    break;
                case "linearSpline":
                    res = linearSplineMethod(points);
                    break;
                case "cubicSpline":
                    res = cubicSplineMethod(points);
                    break;
            }

            (res as any).error = errorType === "abs" ? (res as any).error_abs : (res as any).error_rel;


            setResult(res);

            if (generateReport) {
                const methodsToRun = [
                    { name: "Vandermonde", fn: vandermondeMethod },
                    { name: "Newton Interpolante", fn: newtonInterpolantMethod },
                    { name: "Lagrange", fn: lagrangeMethod },
                    { name: "Spline Lineal", fn: linearSplineMethod },
                    { name: "Spline Cúbico", fn: cubicSplineMethod },
                ];

               const report = methodsToRun.map(({ name, fn }) => {
    try {
        const result = fn(points);
        let testValue: number;
        if (name === "Lagrange") {
            testValue = evaluateLagrange(points, testPoint);
        } else if (name.includes("Spline")) {
            testValue = evaluateSpline((result as LinearSplineResult | CubicSplineResult).segments, testPoint);
        } else {
            testValue = evaluatePolynomial(
                (result as VandermondeResult | NewtonResult).coefficients,
                testPoint,
                name === "Newton Interpolante" ? points.map(p => p[0]) : undefined
            );
        }
        // Asigna el error según errorType:
        const errorValue = errorType === "abs" ? (result as any).error_abs : (result as any).error_rel;
        return { name, polynomial: result.polynomial, testValue, error: errorValue };
    } catch (err) {
        return { name, polynomial: "", testValue: 0, error: "Error al ejecutar" };
    }
});

                setReportResults(report);
            } else {
                setReportResults([]);
            }
        } catch (err) {
            setErrorMessage("Error al ejecutar el método. Verifica los datos de entrada.");
        }
    };

    const xMin = Math.min(...points.map(p => p[0])) - 1;
    const xMax = Math.max(...points.map(p => p[0])) + 1;
    const xValues = Array.from({ length: 100 }, (_, i) => xMin + (xMax - xMin) * i / 99);
    const yValues = xValues.map(x => {
        if (method === "lagrange") {
            return evaluateLagrange(points, x);
        } else if (method.includes("Spline")) {
            return evaluateSpline((result as LinearSplineResult | CubicSplineResult).segments || [], x);
        } else {
            return evaluatePolynomial((result as VandermondeResult | NewtonResult).coefficients || [], x, method === "newton" ? points.map(p => p[0]) : undefined);
        }
    });

    return (
        <div className="space-y-4">
            <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                <strong>Descripción del método:</strong>
                <p>{methodDescriptions[method] || "Selecciona un método para ver su descripción."}</p>
            </div>

            {errorMessage && (
                <div className="p-3 bg-red-100 rounded border border-red-300 text-red-800">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Puntos (x, y):</label>
                    <div className="grid gap-2">
                        {points.map((point, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={point[0]}
                                    onChange={(e) => handlePointInput(e, i, "x")}
                                    className="border p-2 rounded w-24 text-center"
                                    placeholder={`x${i + 1}`}
                                />
                                <input
                                    type="number"
                                    value={point[1]}
                                    onChange={(e) => handlePointInput(e, i, "y")}
                                    className="border p-2 rounded w-24 text-center"
                                    placeholder={`y${i + 1}`}
                                />
                                {points.length > 2 && (
                                    <button
                                        onClick={() => handleRemovePoint(i)}
                                        className="text-red-600 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        ))}
                        {points.length < 8 && (
                            <button
                                onClick={handleAddPoint}
                                className="text-blue-600 text-sm underline mt-2"
                            >
                                Agregar punto
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Punto de prueba:</label>
                    <input
                        type="number"
                        value={testPoint}
                        onChange={(e) => setTestPoint(parseFloat(e.target.value))}
                        className="w-full border p-2 rounded"
                        step="any"
                    />
                </div>
            </div>

                                        <div className="grid grid-cols-5 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Tipo de error:</label>
                    <select
                        value={errorType}
                        onChange={(e) => setErrorType(e.target.value as "abs" | "rel")}
                        className="w-full border p-2 rounded"
                >
                    <option value="abs">Error Absoluto</option>
                    <option value="rel">Error Relativo</option>
                    </select>
                </div>
            </div>
            

            <div className="flex items-center space-x-2 mt-2">
                <input
                    type="checkbox"
                    id="reportToggle"
                    checked={generateReport}
                    onChange={() => setGenerateReport(!generateReport)}
                    className="w-4 h-4"
                />
                <label htmlFor="reportToggle" className="text-sm text-gray-700">
                    Generar informe comparativo entre métodos
                </label>
            </div>

            <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-blue-600 text-sm underline"
            >
                {showHelp ? "Ocultar ayuda" : "¿Cómo ingresar los datos?"}
            </button>

            {showHelp && (
                <div className="mt-2 text-sm text-gray-700 border border-gray-200 p-3 rounded bg-gray-50">
                    <p>Instrucciones para ingresar datos:</p>
                    <ul className="list-disc list-inside mt-1">
                        <li>Ingresa hasta 8 puntos (x, y) en los campos correspondientes.</li>
                        <li>Cada x debe ser único para evitar errores en la interpolación.</li>
                        <li>Ejemplo: Para los puntos (0,0), (1,1), (2,4), ingresa x1=0, y1=0, x2=1, y2=1, x3=2, y3=4.</li>
                        <li>El punto de prueba se usa para evaluar y comparar métodos en el informe.</li>
                    </ul>
                </div>
            )}
<td></td>
            <button
                onClick={runMethod}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
                Ejecutar método
            </button>

            {result.polynomial && (
                <>
                    <h3 className="text-xl font-semibold mt-4">Polinomio/Spline Resultante</h3>
                    <pre className="p-3 bg-gray-100 rounded border">{result.polynomial}</pre>

                    <h4 className="font-semibold mt-4">Gráfica de Interpolación</h4>
                    <Line
                        data={{
                            datasets: [
                                {
                                    label: "Interpolación",
                                    data: xValues.map((x, i) => ({ x, y: yValues[i] })),
                                    borderColor: "rgb(37, 99, 235)",
                                    fill: false,
                                    tension: method.includes("Spline") ? 0 : 0.4,
                                },
                                {
                                    label: "Puntos",
                                    data: points.map(p => ({ x: p[0], y: p[1] })),
                                    backgroundColor: "rgb(255, 99, 132)",
                                    pointRadius: 5,
                                    showLine: false,
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                x: { type: "linear", min: xMin, max: xMax },
                                y: { type: "linear" },
                            },
                        }}
                    />

                    {generateReport && reportResults.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-2">Informe comparativo de métodos</h3>
                            <table className="min-w-full text-sm border">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-2 py-1 border">Método</th>
                                    <th className="px-2 py-1 border">Polinomio/Spline</th>
                                    <th className="px-2 py-1 border">Valor en x={testPoint}</th>
                                    <th className="px-2 py-1 border">Error</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reportResults.map(({ name, polynomial, testValue, error }, idx) => (
                                    <tr key={idx} className="odd:bg-white even:bg-gray-100">
                                        <td className="px-2 py-1 border">{name}</td>
                                        <td className="px-2 py-1 border">{polynomial || "—"}</td>
                                        <td className="px-2 py-1 border">{testValue.toFixed(6)}</td>
                                        <td className="px-2 py-1 border">{error ? String(error) : "—"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {(() => {
                                const validResults = reportResults.filter(r => !r.error);
                                if (validResults.length === 0) return null;

                                const meanValue = validResults.reduce((sum, r) => sum + r.testValue, 0) / validResults.length;
                                const best = validResults.reduce((prev, curr) =>
                                    Math.abs(curr.testValue - meanValue) < Math.abs(prev.testValue - meanValue) ? curr : prev
                                );

                                return (
                                    <div className="mt-4 p-4 border rounded bg-green-50 text-green-800 font-semibold">
                                        Mejor método: <strong>{best.name}</strong> con valor en x={testPoint} de{" "}
                                        <code>{best.testValue.toFixed(6)}</code>.
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MethodFormChapter3;