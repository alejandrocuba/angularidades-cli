Damián Siré 

- Eres originalmente de Montevideo, Uruguay
- Eres ingeniero de software, licenciado en Matemáticas
- Fuiste co-organizador del ****Montevideo Javascript Meetup y del Angular MVD
- Hace unos años estuviste muy activo como creador de contenido técnico en tu canal de YouTube
- GDE in Angular

Es un honor tenerte hoy con nosotros en Angularidades.

En este episodio nos enfocaremos en las novedades del nuevo release de Angular 22.2. Jessica Janiuk fue la encargada en esta ocasión del lanzamiento del minor release.
- La llegada del control flow de errores con `@boundary` y más mejoras en el compilador
- Introdución de Router Resources reactivos en el enrutador
- Mejoras en la integración de Angular con el protocolo WebMCP.

# Preguntas

1. Para arrancar y sentar el contexto del framework, en Angular 22.2 se incorporaron las APIs programáticas de `ErrorBoundary` en el core junto al soporte para el bloque `@boundary` en el lenguaje de plantillas. Hasta ahora dependíamos fundamentalmente del `ErrorHandler` global o de soluciones basadas en directivas ad-hoc. Desde el punto de vista arquitectónico, ¿cómo transforma `@boundary` la resiliencia en tiempo de ejecución al permitir aislar fallos de renderizado en subárboles de componentes sin comprometer la aplicación completa?

💡 Cambio de modelo mental: pasar de un fallo catastrófico no capturado que deja la app en estado indefinido a una degradación elegante y declarativa con bloques `@boundary` y `@error (let err)`.

2. En el compilador de plantillas, un cambio muy esperado y relevante es que ahora se permite a las plantillas acceder a propiedades `private` del componente. Durante años la comunidad debió relajar modificadores de acceso a `protected` o `public` exclusivamente para complacer al compilador de vistas. ¿Qué impacto tiene esta flexibilización en el encapsulamiento de clases, y cómo beneficia la minificación y mangling de código en producción con herramientas como esbuild o Terser?

💡 Analizar la diferencia entre visibilidad a nivel de TypeScript y tiempo de compilación frente a la privacidad de miembros en tiempo de ejecución (incluyendo campos privados `#field`), eliminando la fricción de exponer miembros innecesariamente fuera de la clase.

3. En el `compiler-cli`, se introdujo la opción `strictUnclaimedEventNames` para detectar bindings de eventos u outputs mal escritos. Se introduce una opción de type-checking opt-in que informa sobre bindings de eventos en elementos con directivas coincidentes cuyo nombre no coincide con ningún output de las directivas coincidentes ni con un evento nativo del DOM. Muy util para proyectos donde no exista un exhaustivo code review ni linting estricto.

💡 Contextualizar cómo el compilador antes trataba los eventos desconocidos como eventos nativos del DOM que no emitían error estricto, dejando fallos silenciosos donde el handler nunca se disparaba.

4. En el paquete `@angular/router`, se exponen ahora los "Router Resources" como API pública (`router_resource`), además de añadir un método `reload` en recursos vinculados a `ActivatedRoute`. Considerando el avance de la reactividad asíncrona con `resource` y `rxResource`, ¿cómo sustituyen los Router Resources a los resolvers tradicionales que solían bloquear las transiciones entre páginas?

💡 Destacar el desacoplamiento: los antiguos resolvers retenían la navegación síncronamente hasta que los datos resolvían, mientras que Router Resources permiten transiciones inmediatas de interfaz mientras la data fluye de manera reactiva e independiente dentro del grafo de señales.

5. En este release también se estabilizó la función de limpieza automática de inyectores (`stabilize auto cleanup injectors feature`) en el Router y se expuso `containsTree` en la API pública. ¿Cómo aborda el Router de Angular el ciclo de vida de los inyectores contextuales (`EnvironmentInjector`) y qué riesgos de retención de memoria (memory leaks) se mitigan al navegar entre rutas con proveedores locales?

💡 Abordar la gestión de memoria y el ciclo de vida de servicios locales provistos en subrutas `providers: [...]` cuando una rama de la ruta se destruye o reemplaza.

6. En el área de formularios reactivos basados en señales (`@angular/forms`), se habilitó el soporte para campos ocultos permanentes (`permanent hidden fields in signal forms`). En un modelo declarativo donde el formulario refleja el estado de las señales, ¿por qué es necesario un mecanismo específico para campos ocultos y cómo asegura la integridad del modelo de datos enviado al backend?

💡 Discutir la persistencia de identificadores internos, tokens CSRF o metadatos de auditoría que deben acompañar la estructura de datos del formulario sin requerir representación visual en el DOM.

7. El compilador optimizó los bloques `@defer` al aislar el chequeo de tipos para bloques con claves (`keyed defer blocks`) y deduplicar imports diferidos a través de múltiples bloques. Desde la perspectiva de rendimiento web y métricas Core Web Vitals (como LCP e INP), ¿cuánto influye esta optimización en la generación de chunks y la eficiencia de carga bajo demanda?

💡 Explicar cómo la deduplicación de imports diferidos compartidos previene la sobrecarga de fragmentos JavaScript redundantes y mejora el árbol de dependencias emitido por el bundler.

8. Uno de los añadidos más vanguardistas en Angular 22.2 es la compatibilidad con anotaciones en declaraciones de herramientas WebMCP (Web Model Context Protocol) y los flags `readOnlyHint` y `untrustedContentHint` en formularios basados en señales. Damián, tú que exploras de cerca la convergencia de Angular con IA, ¿qué es WebMCP y qué significa técnicamente que una aplicación Angular pueda exponer herramientas y formularios tipados dentro del contexto de inyección para agentes de IA?

💡 Explicar que WebMCP estandariza cómo los agentes de IA descubren e invocan capacidades dentro de una aplicación web cliente ejecutándose dentro del Angular Injection Context, evitando técnicas frágiles de raspado (scraping) del DOM y aplicando salvaguardas de seguridad para contenido no confiable.

9. Finalmente, en el manejo de estilos, se refinó el encapsulado para reglas de CSS anidadas. Dado que el CSS nativo moderno soporta nesting directamente en los navegadores, ¿hacia dónde va la estrategia de `ViewEncapsulation` de Angular para convivir con los nuevos estándares de la plataforma web sin depender de preprocesadores?

💡 Conectar con la filosofía de Angular de abrazar la plataforma web moderna nativa, reduciendo la necesidad de transformaciones pesadas mientras se mantiene el aislamiento de estilos de componentes.

10. Antes de concluir el episodio, ¿hay algo más que no hayamos mencionado durante la conversación sobre lo que quieras comentar?
