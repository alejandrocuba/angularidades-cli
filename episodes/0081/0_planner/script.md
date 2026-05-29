Si la cadencia de lanzamiento de versiones de Angular se mantiene como está, acá nos verán cada 6 meses.

"La versión estable"

# Introducción

Permíteme presentarte ante quienes aún no te conocen:

- Eres de Buenos Aires, Argentina
- Eres conferencista, escritor de artículos técnicos y profesor de varios cursos relacionados con JS y rendimiento web
- Eres mentor de Google Startups
- Eres CTO en Pulppo
- Tienes la distinción GDE (Google Developer Expert) que ofrece Google en tres categorías: Angular, Tecnologías Web y Firebase, y además tienes los reconocimientos de Nx Champion y NativeScript Developer Expert.

# Guión

0. Lo que no cambia:
    - A pesar de que directivas estructurales clásicas como `*ngIf`, `*ngFor` y `*ngSwitch` entraron en estado de obsolescencia (deprecation) con la llegada del nuevo Control Flow (`@if`, `@for`, `@switch`), el equipo de Angular ha decidido extender su periodo de vida y posponer su eliminación final del framework. Esto otorga a la comunidad y a los proyectos empresariales un margen de tiempo mucho más amplio para efectuar la transición usando el esquemático automatizado (`ng generate @angular/core:control-flow`), evitando así rupturas abruptas al actualizar a la v22 en bases de código masivas.

1. El Core y plantillas
    - Las APIs de Signal Forms han sido promovidas a la API pública estable, permitiendo un mejor manejo de formularios al apoyarse de forma nativa en el control granular de las señales y con menor costo en la sincronización de las vistas con el estado del formulario.
    - Integración de la regla `debounce()` de manera nativa en Signal Forms, eliminando la necesidad de depender de RxJS (`debounceTime`) para retrasar validaciones síncronas o asíncronas y evitando peticiones innecesarias en cada pulsación.
    - El operador de navegación segura (`?.`) en las plantillas de componentes ha sido mejorado para aplicar exitosamente el type narrowing sobre variables, reduciendo errores de tipado sobre variables que admiten valores nulos.
    - Soporte oficial para arrancar (`bootstrap`) aplicaciones de Angular directamente dentro de un *shadow root*, un avance masivo para arquitecturas de micro-frontends y Web Components.

2. Inyección de Dependencias
    - Nuevo decorador `@Service`, marcando un cambio en el core para proveer servicios de manera más explícita y semántica que con @Injectable, que ha estado desde los inicios de Angular, por lo que tiene demasiado overhead. Lo que @service ofrece es la capacidad de definir un singleton en la raíz y punto. Sin useClass, useValue, ni inyección en constructores.
    - Se agregó la nueva función de utilidad `injectAsync` en el core para resolver dependencias de forma asíncrona, facilitando arquitecturas con carga diferida (es decir, ahora hay lazy loading en dependency injection).

3. Enrutamiento
    - Angular ahora permite configurar nativamente el `unmatchedInputBehavior` en el enrutador para decidir qué ocurre cuando la URL intenta pasar propiedades (vía `componentInputBinding`) que no coinciden con ningún `@Input()` del componente.
    - Se resolvió un dolor de cabeza clásico cambiando el comportamiento por defecto de `paramsInheritanceStrategy` a `'always'`. Ahora los componentes hijos heredan automáticamente todos los parámetros de las rutas padres sin configuración extra.

4. Red
    - La monitorización de progreso en el `HttpClient` es ahora más granular con la inclusión de las opciones `reportUploadProgress` y `reportDownloadProgress`, llevando a la obsolescencia la configuración original `reportProgress`.

5. SSR
    - Para SSR se añade la capacidad de cachear recursos para los componentes, dando soporte para emitir valores síncronos en los `Resources` basados en streams.
    - La hidratación incremental ahora está habilitada de manera predeterminada en el `platform-browser`, lo cual mejora drásticamente los Core Web Vitals en aplicaciones SSR al evitar la destrucción y recreación completa del DOM.

6. Tooling
    - Se introduce el `provideWebMcpTools`, que es un wrapper de la función experimental `declareWebMcpTool`, que permite definir herramientas del MCP directamente en un provider, en vez de dejarlo encontrar el contexto de ejecución.
    - El ecosistema de construcción (`compiler-cli`) recibe oficialmente soporte y compatibilidad completa con Node.js 26, que va a ser la última del esquema tradicional de lanzamientos pares LTS / impares experimentales. A partir de Node 27 (el próximo año), habrá un único lanzamiento mayor con frecuencia anual, donde TODAS las versiones serán LTS. Así que será tarea de Angular mantenerse actualizado cada año con NodeJS de una forma menos enredada.

7. Limpieza
    - Se retira el soporte para selectores ShadowDOM que son considerados legacy. Y por consiguiente, sus polyfills de CSS.
    - En cuanto a limpieza técnica y breaking changes: se removió el soporte para versiones de TypeScript inferiores a la 6.0, se eliminaron por completo las APIs depreciadas `ComponentFactoryResolver` y `ComponentFactory`, y la interfaz `CanMatchFn` ahora exige obligatoriamente el parámetro `currentSnapshot`.

8. Antes de concluir el episodio, ¿hay algo más que no hayamos mencionado durante la conversación sobre lo que quieras comentar?