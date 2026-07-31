# Introducción

Permíteme presentarte ante quienes aún no te conocen:

- Eres originalmente de Colombia y desde hace varios años radicas en Cochabamba, Bolivia.
- Eres desarrollador de software e instructor de cursos sobre Angular. Publicas artículos técnicos y material en tu canal de YouTube, que acumula ya más de 200 videos con contenido de muy alta calidad.
- Eres parte de la comunidad de Angular Bolivia, fundada en 2017 por Luis Avilés en Cochabamba
- Tienes el reconocimiento por Google como GDE en Angular y Tecnologías Web, por Microsoft como MVP

# Guión

Nico, pues Angular 22.1, que según el nuevo ciclo de lanzamiento que al menos durante los próximos 11 meses continuará adoptando el Sistema de Versionado Semántico, acá tenemos la 1ra de 5 versiones “minor”, precursoras de lo que en junio del año que viene va a ser iterado a la versión 23… o quizás “Angular 2027”, ¿quién sabe?

1. ¿Qué te parece todo esto relacionado a la nueva frecuencia de lanzamiento de versiones de Angular? ¿A quién favorece y a qué tipo de proyectos puede resultarle difícil adaptarse?
    1. reduce drásticamente la fatiga de actualización (*upgrade fatigue*) y el costo operativo de auditoría
    2. Un núcleo con *breaking changes* congelados durante 12 meses brinda estabilidad de contexto a LLMs y linters
    3. **para quienes mantienen bibliotecas del ecosistema:** Disminuye la carga de mantenimiento continuo y la necesidad de publicar versiones mayores de compatibilidad cada seis meses.  
    4. Si un equipo interpreta la cadencia anual como una excusa para no actualizar el proyecto durante 12 meses, pierde la ventaja de la adopción incremental, acumulando el impacto de 4 a 6 versiones menores de golpe.
2. No se está reduciendo la capacidad del equipo de entregar nuevos features, sino incrementando el tiempo entre cambios abruptos que ocurren con la oportunidad de lanzar un “major” solo una vez al año, incrementando por consiguiente el LTS de las versiones.
3. Hay que tener cuidado con los articulos y videos elaborados usando AI con desalineaciones temporales o alucinaciones…
4. New features/fixes:
    1. `HttpClient.jsonp`, `HttpClientJsonpModule`, and related JSONP classes/functions are deprecated. Use standard HTTP requests instead. If an external API only supports JSONP, use a backend proxy or move to an endpoint supporting CORS. Angular intends to remove JSONP in a future version.
    2. the i18n translation and locale inlining in the ESBuild pipeline to use `oxc-parser` and `magic-string` instead of `@babel/core`. (Oxc: *A high-performance JavaScript / TypeScript parser* written in Rust)
    3. Support css variable namespacing in properties (#68846). Running multiple Angular applications on the same page can cause CSS variables to leak between them. One application may set `--primary-color`, and another embedded application can accidentally inherit it. In the `ApplicationConfig` provide `provideCssVarNamespacing`. Then you can continue writing regular CSS variables. Angular transforms them using the configured namespace prepending the prefix. Only styles declared through `styles` or `styleUrls` in Angular components are transformed. Global stylesheets remain unchanged. Variables beginning with `--global--` are deliberately excluded.
    4. Mejoras de rendimiento en el control flow.
    5. More control over the HTTP transfer cache: Angular’s HTTP transfer cache stores server responses during SSR so the browser doesn’t immediately request the same data again during hydration. Angular 22.1 adds two options: `includeRequestsWithCredentials` and `includeNonCacheableRequests`.
    6. Adds deep linking from Performance panel to DevTools
    Introduces unique, IDs for component instances during profiling.
    Embeds these instance IDs into custom `angular-devtools://component/ID` URLs for component and lifecycle hook events recorded in Chrome's Performance panel. This allows users, when deep linking is enabled, to click on a component event in the timeline summary and navigate directly to that specific component instance in the Angular DevTools extension.
    7. add custom set option to linkedSignal. `linkedSignal` now accepts a custom `set` callback. It lets you redirect writes to the original source signal instead of replacing the linked signal’s internal value. This is useful for editable derived values, form-like state and properties extracted from larger parent signals.
    8. new schematic: add migration from injectable to service
    9. fix: correctly detect then/else keywords in control flow migration
5. Antes de concluir el episodio, ¿hay algo más que no hayamos mencionado durante la conversación sobre lo que quieras comentar?