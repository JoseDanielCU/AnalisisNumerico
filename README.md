# AnalisisNumerico
Proyecto realizado para el curso de Análisis Númerico I donde se realizó una página web que implementó gran parte de los métodos númericos aprendidos en el curso.

# Métodos Numéricos

Este repositorio contiene una aplicación web de **Métodos Numéricos** implementada en React y TypeScript, donde se exploran diversos algoritmos para resolver problemas numéricos. La aplicación está dividida en tres capítulos:

- **Capítulo 1:** Métodos para sistemas no lineales (por ejemplo, bisección, regla falsa, Newton, secante, etc.).  
- **Capítulo 2:** Métodos para sistemas lineales (por ejemplo, Jacobi, Gauss-Seidel, SOR, etc.).  
- **Capítulo 3:** Métodos de interpolación (por ejemplo, interpolantes de Newton, Vandermonde, Lagrange y splines).

Además, se implementa la opción de alternar entre el cálculo del error absoluto y relativo en la visualización de los resultados.

## Características

- **Interfaz Interactiva:** Permite ingresar matrices, vectores, puntos y otros parámetros de entrada para cada método.
- **Cálculo de Errores:** Cada método devuelve tanto error absoluto como error relativo; se puede alternar dinámicamente la visualización.
- **Informe Comparativo:** Capacidad para comparar los resultados obtenidos de distintos métodos.
- **Soporte para Varios Métodos:**  
  - Capítulo 1: Métodos iterativos para encontrar raíces en sistemas no lineales.  
  - Capítulo 2: Resolución de sistemas lineales mediante métodos iterativos.  
  - Capítulo 3: Interpolación utilizando polinomios y splines.

## Estructura del Proyecto

```
AnalisisNumerico-main/
├── src/
│   ├── Chapters/
│   │   └── Home.tsx              # Página principal y navegación entre capítulos
│   ├── Components/
│   │   ├── MethodFormChapter1.tsx  # Métodos de Raíces (Capítulo 1)
│   │   ├── MethodFormChapter2.tsx  # Métodos de Sistemas Lineales (Capítulo 2)
│   │   └── MethodFormChapter3.tsx  # Métodos de Interpolación (Capítulo 3)
│   ├── Methods/
│   │   ├── Biseccion.ts
│   │   ├── ReglaFalsa.ts
│   │   ├── Newton.ts
│   │   ├── Secante.ts
│   │   ├── RaicesMultiples.ts
│   │   ├── VanderMonde.ts
│   │   ├── SplineLineal.ts
│   │   ├── Spline Cubico.ts
│   │   └── NewtonInt.ts
│   └── Utils/
│       ├── EliminacionGaussiana.ts
│       └── DerivatePreview.ts
├── package.json
└── README.md
```

## Tecnologías Utilizadas

- **React**: Framework para construir la interfaz de usuario.
- **TypeScript**: JavaScript tipado para mayor robustez en el código.
- **Tailwind CSS**: Framework de estilos para diseñar la UI.
- **Math.js**: Biblioteca utilizada para evaluar expresiones y realizar cálculos matemáticos.

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/tu-usuario/AnalisisNumerico.git](https://github.com/JoseDanielCU/AnalisisNumerico.git)
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Ejecutar la aplicación:**

   ```bash
   npm start
   ```

   La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

## Uso

- **Navegación:** Desde la página principal (Home) se puede seleccionar el capítulo deseado.
- **Capítulo 1:** Ingresar la función y parámetros iniciales para métodos iterativos de raíces.
- **Capítulo 2:** Ingresar matrices y vectores para resolver sistemas lineales; además, se puede alternar entre error absoluto y error relativo.
- **Capítulo 3:** Introducir puntos para interpolación y elegir entre los distintos métodos disponibles.
- **Alternar Errores:** En cada capítulo se cuenta con un selector para cambiar la visualización del error (absoluto o relativo).

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto:
- Realiza un *fork* del repositorio.
- Crea tus modificaciones y abre un *pull request*.
- También puedes reportar issues para discutir mejoras o errores.

