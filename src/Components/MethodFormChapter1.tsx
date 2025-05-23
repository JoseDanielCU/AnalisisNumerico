// src/Components/MethodFormChapter1.tsx
import { useEffect, useState } from "react";
import { bisectionMethod } from "../Methods/Biseccion";
import { falseRuleMethod } from "../Methods/ReglaFalsa";
import { fixedPointMethod } from "../Methods/PuntoFijo";
import { newtonMethod } from "../Methods/Newton";
import { secantMethod } from "../Methods/Secante";
import { multipleRootsMethod } from "../Methods/RaicesMultiples";
import { getDerivatives } from "../Utils/DerivatePreview";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

interface Iteration {
    iter: number;
    error: number;
    x?: number; // Used by Newton, Multiple Roots
    mid?: number; // Used by Bisection, False Rule
    x1?: number; // Used by Secant
    xn?: number; // Used by Fixed Point
    fx?: number; // Function value for Fixed Point
    status?: string; // Status message for Fixed Point
    [key: string]: any; // Allow additional method-specific fields
}

const MethodFormChapter1 = ({ method }: { method: string }) => {
    const [func, setFunc] = useState("x^3 - x - 2");
    const [gx, setGx] = useState("");
    const [useAutoGx, setUseAutoGx] = useState(false); // Toggle for automatic g(x)
    const [k, setK] = useState(0.1); // Scaling factor for g(x) = x - k * f(x)
    const [x0, setX0] = useState(1);
    const [x1, setX1] = useState(2);
    const [tol, setTol] = useState(5e-4);
    const [maxIter, setMaxIter] = useState(100);
    const [A, setA] = useState(0);
    const [results, setResults] = useState<Iteration[]>([]);
    const [showHelp, setShowHelp] = useState(false);
    const [firstDeriv, setFirstDeriv] = useState("");
    const [secondDeriv, setSecondDeriv] = useState("");
    const [generateReport, setGenerateReport] = useState(false);
    const [reportResults, setReportResults] = useState<
        { name: string; results: Iteration[]; error?: string }[]
    >([]);
    const [errorMessage, setErrorMessage] = useState("");

    const methodDescriptions: Record<string, string> = {
        bisection: "El método de bisección consiste en dividir iterativamente un intervalo donde la función cambia de signo para aproximar la raíz.",
        falseRule: "El método de la regla falsa es similar al de bisección, pero usa interpolación lineal para obtener una mejor aproximación.",
        fixedPoint: "El método del punto fijo transforma la ecuación en la forma x = g(x) y aproxima la raíz iterando g(x). Requiere que |g'(x)| < 1 para converger.",
        newton: "El método de Newton utiliza la función y su derivada para aproximar la raíz mediante tangentes.",
        secant: "El método de la secante es una variante del método de Newton que no requiere calcular la derivada explícitamente.",
        multipleRoots: "El método de raíces múltiples es una extensión del método de Newton que considera derivadas de orden superior para raíces múltiples.",
    };

    useEffect(() => {
        if (["newton", "multipleRoots"].includes(method)) {
            const { first, second } = getDerivatives(func);
            setFirstDeriv(first);
            setSecondDeriv(second);
        } else {
            setFirstDeriv("");
            setSecondDeriv("");
        }
    }, [func, method]);

    const validateInputs = () => {
        if (!func) {
            setErrorMessage("La función f(x) no puede estar vacía.");
            return false;
        }
        if (method === "fixedPoint" && !useAutoGx && !gx) {
            setErrorMessage("La función g(x) es requerida para el método de Punto Fijo si no usas g(x) automática.");
            return false;
        }
        if (isNaN(x0) || (["bisection", "falseRule", "secant"].includes(method) && isNaN(x1))) {
            setErrorMessage("Los valores de x0 y x1 deben ser numéricos.");
            return false;
        }
        if (tol <= 0) {
            setErrorMessage("La tolerancia debe ser mayor que 0.");
            return false;
        }
        if (maxIter <= 0) {
            setErrorMessage("El número máximo de iteraciones debe ser mayor que 0.");
            return false;
        }
        if (method === "fixedPoint" && useAutoGx && (isNaN(k) || k <= 0)) {
            setErrorMessage("El factor k debe ser un número positivo para g(x) automática.");
            return false;
        }
        return true;
    };

    const runMethod = () => {
        if (!validateInputs()) return;

        setErrorMessage("");
        const options = { tol, maxIter, fx: func, A, k }; // Include fx, A, and k
        let res: Iteration[] = [];

        try {
            switch (method) {
                case "bisection":
                    res = bisectionMethod(func, x0, x1, options);
                    break;
                case "falseRule":
                    res = falseRuleMethod(func, x0, x1, options);
                    break;
                case "fixedPoint":
                    res = fixedPointMethod(useAutoGx ? "" : gx, x0, options);
                    break;
                case "newton":
                    res = newtonMethod(func, x0, options);
                    break;
                case "secant":
                    res = secantMethod(func, x0, x1, options);
                    break;
                case "multipleRoots":
                    res = multipleRootsMethod(func, x0, options);
                    break;
            }

            setResults(res);

            if (generateReport) {
                const methodsToRun = [
                    { name: "Bisección", fn: () => bisectionMethod(func, x0, x1, options) },
                    { name: "Regla Falsa", fn: () => falseRuleMethod(func, x0, x1, options) },
                    {
                        name: "Punto Fijo",
                        fn: () => {
                            return fixedPointMethod(useAutoGx ? "" : gx, x0, options);
                        },
                    },
                    { name: "Newton", fn: () => newtonMethod(func, x0, options) },
                    { name: "Secante", fn: () => secantMethod(func, x0, x1, options) },
                    { name: "Raíces Múltiples", fn: () => multipleRootsMethod(func, x0, options) },
                ];

                const report = methodsToRun.map(({ name, fn }) => {
                    try {
                        return { name, results: fn() };
                    } catch (err) {
                        return { name, results: [], error: String(err) };
                    }
                });

                setReportResults(report);
            } else {
                setReportResults([]);
            }
        } catch (err) {
            setErrorMessage(`Error al ejecutar el método: ${String(err)}`);
        }
    };

    return (
        <div className="space-y-4">
            {errorMessage && (
                <div className="p-3 bg-red-100 rounded border border-red-300 text-red-800">
                    {errorMessage}
                </div>
            )}
            <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                <strong>Descripción del método:</strong>
                <p>{methodDescriptions[method] || "Selecciona un método para ver su descripción."}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block font-medium">Función f(x):</label>
                    <input
                        type="text"
                        value={func}
                        onChange={(e) => setFunc(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Ejemplo: x^3 - x - 2"
                        aria-label="Función f(x)"
                    />
                    {method === "fixedPoint" && (
                        <>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="autoGxToggle"
                                    checked={useAutoGx}
                                    onChange={() => setUseAutoGx(!useAutoGx)}
                                    className="w-4 h-4"
                                    aria-label="Usar g(x) automática"
                                />
                                <label htmlFor="autoGxToggle" className="text-sm text-gray-700">
                                    Usar g(x) = x - k * f(x) automáticamente
                                </label>
                            </div>
                            {!useAutoGx && (
                                <>
                                    <label className="block font-medium mt-2">Función g(x):</label>
                                    <input
                                        type="text"
                                        value={gx}
                                        onChange={(e) => setGx(e.target.value)}
                                        className="w-full border p-2 rounded"
                                        placeholder="Ejemplo: sin(x - A*10^(-3))"
                                        aria-label="Función g(x)"
                                    />
                                </>
                            )}
                            {useAutoGx && (
                                <>
                                    <label className="block font-medium mt-2">Factor k:</label>
                                    <input
                                        type="number"
                                        value={k}
                                        onChange={(e) => setK(parseFloat(e.target.value))}
                                        className="w-full border p-2 rounded"
                                        step="any"
                                        placeholder="Ejemplo: 0.1"
                                        aria-label="Factor k para g(x)"
                                    />
                                </>
                            )}
                        </>
                    )}
                    <div className="mt-4">
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className="text-blue-600 text-sm underline"
                            aria-label={showHelp ? "Ocultar ayuda" : "Mostrar ayuda para ingresar funciones"}
                        >
                            {showHelp ? "Ocultar ayuda" : "¿Cómo ingresar la función?"}
                        </button>
                        {showHelp && (
                            <div className="mt-2 text-sm text-gray-700 border border-gray-200 p-3 rounded bg-gray-50">
                                Usa <code>x</code> como variable. Ejemplos válidos para f(x):
                                <ul className="list-disc list-inside mt-1">
                                    <li><code>x^3 - x - 2</code></li>
                                    <li><code>sin(x) + log(x)</code></li>
                                    <li><code>exp(-x^2)</code></li>
                                </ul>
                                Para Punto Fijo, ingresa g(x) tal que x = g(x), o usa g(x) automática:
                                <ul className="list-disc list-inside mt-1">
                                    <li>Manual: Si f(x) = x^3 - x - 2, g(x) = <code>(x^3 - 2)^(1/3)</code></li>
                                    <li>Automática: Usa g(x) = x - k * f(x), ajusta k (ej: 0.1)</li>
                                </ul>
                                Puedes usar funciones de <strong>math.js</strong>: <code>abs</code>, <code>sqrt</code>, <code>cos</code>, etc.
                            </div>
                        )}
                        {["newton", "multipleRoots"].includes(method) && (
                            <div className="mt-2 text-sm text-yellow-800 border border-yellow-300 p-3 rounded bg-yellow-50">
                                <p className="font-medium">Derivadas automáticas:</p>
                                <p><strong>f'(x):</strong> {firstDeriv}</p>
                                {method === "multipleRoots" && (
                                    <p><strong>f''(x):</strong> {secondDeriv}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block font-medium">x0 / a:</label>
                    <input
                        type="number"
                        value={x0}
                        onChange={(e) => setX0(parseFloat(e.target.value))}
                        className="w-full border p-2 rounded"
                        step="any"
                        aria-label="Valor inicial x0"
                    />
                </div>
                {["bisection", "falseRule", "secant"].includes(method) && (
                    <div>
                        <label className="block font-medium">x1 / b:</label>
                        <input
                            type="number"
                            value={x1}
                            onChange={(e) => setX1(parseFloat(e.target.value))}
                            className="w-full border p-2 rounded"
                            step="any"
                            aria-label="Valor inicial x1"
                        />
                    </div>
                )}
                <div>
                    <label className="block font-medium">Tolerancia:</label>
                    <input
                        type="number"
                        value={tol}
                        onChange={(e) => setTol(parseFloat(e.target.value))}
                        className="w-full border p-2 rounded"
                        step="any"
                        aria-label="Tolerancia"
                    />
                </div>
                <div>
                    <label className="block font-medium">Máximo de Iteraciones:</label>
                    <input
                        type="number"
                        value={maxIter}
                        onChange={(e) => setMaxIter(parseInt(e.target.value))}
                        className="w-full border p-2 rounded"
                        aria-label="Máximo de iteraciones"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
                <input
                    type="checkbox"
                    id="reportToggle"
                    checked={generateReport}
                    onChange={() => setGenerateReport(!generateReport)}
                    className="w-4 h-4"
                    aria-label="Generar informe comparativo"
                />
                <label htmlFor="reportToggle" className="text-sm text-gray-700">
                    Generar informe comparativo entre métodos
                </label>
            </div>
            <button
                onClick={runMethod}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                aria-label="Ejecutar método numérico"
            >
                Ejecutar método
            </button>
            {results.length > 0 && (
                <>
                    <h3 className="text-xl font-semibold mt-4">Resultados</h3>
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto border rounded">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="bg-gray-200">
                                {Object.keys(results[0]).map((key) => (
                                    <th key={key} className="px-2 py-1 border">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((row, idx) => (
                                <tr key={idx} className="odd:bg-white even:bg-gray-100">
                                    {Object.values(row).map((val, i) => (
                                        <td key={i} className="px-2 py-1 border">
                                            {typeof val === "number" ? val.toFixed(6) : String(val)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <h4 className="font-semibold mt-4">Gráfica de aproximaciones</h4>
                    <Line
                        data={{
                            labels: results.map((r) => r.iter),
                            datasets: [
                                {
                                    label: "Aproximación",
                                    data: results.map((r) => r.x ?? r.mid ?? r.x1 ?? r.xn ?? 0),
                                    borderColor: "rgb(37, 99, 235)",
                                    fill: false,
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                x: { title: { display: true, text: "Iteración" } },
                                y: { title: { display: true, text: "Aproximación" } },
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
                                    <th className="px-2 py-1 border">Iteraciones</th>
                                    <th className="px-2 py-1 border">Error final</th>
                                    <th className="px-2 py-1 border">Aproximación</th>
                                    <th className="px-2 py-1 border">f(x)</th>
                                    <th className="px-2 py-1 border">Estado</th>
                                    <th className="px-2 py-1 border">Error</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reportResults.map(({ name, results, error }, idx) => {
                                    const last = results[results.length - 1] || {};
                                    const approx = last.x ?? last.mid ?? last.x1 ?? last.xn;
                                    return (
                                        <tr key={idx} className="odd:bg-white even:bg-gray-100">
                                            <td className="px-2 py-1 border">{name}</td>
                                            <td className="px-2 py-1 border">{results.length}</td>
                                            <td className="px-2 py-1 border">
                                                {last.error ? last.error.toFixed(6) : "—"}
                                            </td>
                                            <td className="px-2 py-1 border">
                                                {typeof approx === "number" ? approx.toFixed(6) : "—"}
                                            </td>
                                            <td className="px-2 py-1 border">
                                                {typeof last.fx === "number" ? last.fx.toFixed(6) : "—"}
                                            </td>
                                            <td className="px-2 py-1 border">{last.status || "—"}</td>
                                            <td className="px-2 py-1 border">{error || "—"}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            {(() => {
                                const validResults = reportResults
                                    .filter((m) => m.results.length > 0)
                                    .map((m) => {
                                        const last = m.results[m.results.length - 1];
                                        const approx = last.x ?? last.mid ?? last.x1 ?? last.xn;
                                        return {
                                            name: m.name,
                                            error: last.error ?? Infinity,
                                            fx: last.fx ?? Infinity,
                                            approx,
                                            iterations: m.results.length,
                                        };
                                    })
                                    .filter((m) => typeof m.approx === "number") as {
                                    name: string;
                                    error: number;
                                    fx: number;
                                    approx: number;
                                    iterations: number;
                                }[];

                                if (validResults.length === 0) return null;

                                const best = validResults.reduce((prev, curr) =>
                                    curr.error < prev.error ||
                                    (curr.error === prev.error && Math.abs(curr.fx) < Math.abs(prev.fx))
                                        ? curr
                                        : prev
                                );

                                return (
                                    <div className="mt-4 p-4 border rounded bg-green-50 text-green-800 font-semibold">
                                        Mejor método: <strong>{best.name}</strong> con error final de{" "}
                                        <code>{best.error.toFixed(6)}</code>, f(x) ={" "}
                                        <code>{best.fx.toFixed(6)}</code> y aproximación{" "}
                                        <code>{best.approx.toFixed(6)}</code> en {best.iterations} iteraciones.
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

export default MethodFormChapter1;