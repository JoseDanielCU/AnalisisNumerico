// src/pages/Home.tsx
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg text-center space-y-8">
            <h1 className="text-5xl font-extrabold text-blue-700">Métodos Numéricos</h1>
            <p className="text-gray-500 text-lg">
                Selecciona un capítulo para empezar a explorar los métodos.
            </p>
            <div className="flex flex-col space-y-5">
                <Link
                    to="/chapter1"
                    className="bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    aria-label="Capítulo 1 - Métodos de Raíces"
                >
                    Capítulo 1 - Métodos de Raíces
                </Link>
                <Link
                    to="/chapter2"
                    className="bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    aria-label="Capítulo 2 - Sistemas Lineales"
                >
                    Capítulo 2 - Sistemas Lineales
                </Link>
                <Link
                    to="/chapter3"
                    className="bg-purple-600 text-white py-3 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
                    aria-label="Capítulo 3 - Interpolación"
                >
                    Capítulo 3 - Interpolación
                </Link>
            </div>
        </div>
    );
};

export default Home;
