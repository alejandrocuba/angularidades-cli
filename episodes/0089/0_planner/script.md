# Introducción

En el episodio de hoy, nos acompañan dos Angular GDEs… Antonio de Tegucigalpa 

- Hablaremos sobre los retos de ejecutar Angular en modo híbrido, cómo evitar romper la aplicación en el servidor, y cómo posicionar de frente a frente a dos herramientas de la infraestructura de la nube de Google:
    - por un lado la abstracción administrada de Firebase App Hosting
    - y por el otro el control granular que ofrece Google Cloud Run

—

Pero bueno, antes de eso un poco de contexto:

- Durante años el ecosistema de Angular estuvo dominado por CSR
- sin embargo, con la estabilización de SSR y el mecanismo de Hidratación Incremental, la frontera entre el frontend y el backend se han difuminado
- El código de nuestra UI que antes vivía exclusivamente en el navegador, hoy nor permite obtener recursos de cómputo en la nube.

# Preguntas

1. Para los equipos que han construido SPAs con Angular durante años, ¿cuál es el argumento técnico para migrar a SSR, asumiendo que el SEO no es una prioridad para su negocio interno?
    - esta pregunta nos va a hacer hablar sobre Core Web Vitals y otras métricas de rendimiento percibido, además de la distribución de carga de cómputo.
2. Firebase App Hosting utiliza la infraestructura de Cloud Run por debajo de la fachada. Si un equipo está evaluando dónde desplegar su aplicación de Angular SSR, ¿cuál es el factor técnico o la limitación arquitectónica que los debería obligar a abandonar la comodidad de App Hosting y construir en Cloud Build y servir directamente con Cloud Run?
3. Angular moderno soporta nativamente el Hybrid Rendering, permitiendo tener rutas estáticas pre-renderizadas (SSG) y rutas “dinámicas” (SSR o puro CSR) en un mismo proyecto. ¿Cómo ustedes deciden cuáles rutas van a generarse en tiempo de construcción y cuáles bajo demanda para optimizar la carga del servidor y la UX?
    - Ayuda a la audiencia a entender que no tienen que renderizar dinámicamente toda la aplicación, y les da pistas sobre cómo usar las herramientas que Angular provee para ahorrar costos en la nube.
4. Debugging: al pasar de una app tradicional a SSR, un console.log o un error no manejado ya no aparece en las herramientas de desarrollo del navegador, sino que se va a Cloud Logging. ¿Cómo uds estructuran la observabilidad en sus aplicaciones de Angular con hybrid rendering para obtener trazas que les permitan rastrear un error desde el contenedor en Cloud Run hasta la sesión del usuario en el frontend?
    - Esta pregunta toca un problema operativo del que no se habla mucho hasta que la aplicación se rompe en producción. La idea es ofrecer un cambio de mentalidad de "depuración local" a "monitoreo de sistemas distribuidos" en GCP.
5. Los LLM suelen generar código asumiendo acceso directo al DOM (window o document), lo cual no está disponible en el server. ¿Cómo  contextualizamos a una IA para que comprenda las dinámicas de una aplicación de Angular SSR y nos genere código seguro para correrlo en la plataforma del servidor?
6. Antes de concluir la conversación, ¿hay algo más que no hayamos mencionado durante la conversación sobre lo que quieras comentar?
