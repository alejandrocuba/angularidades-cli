Damián Siré 

---
Damián, ya tenemos por acá a la segunda de cinco versiones menores que vamos a estar recibiendo cada dos meses durante este ciclo de actualizaciones correspondiente a la versión 22.

En este episodio vamos a enfocarnos en las novedades que nos trae este nuevo release que fue gestionado por Jessica Janiuk, encargada en esta ocasión del lanzamiento de la 22.2.

Muchísimas gracias por haber aceptado la invitación a conversar hoy por acá.

---
Por cierto, especialmente para quienes no hayan visto el contenido técnico sobre desarrollo de software que estuviste publicando activamente durante la época de la pandemia, voy a presentarte rápidamente a quienes nos están escuchando:
- Eres originalmente de Montevideo, Uruguay
- Eres ingeniero de software, licenciado en Matemáticas
- Fuiste co-organizador del ****Montevideo Javascript Meetup y del Angular MVD
- GDE in Angular

Es un honor tenerte hoy con nosotros en Angularidades.

---

Es de esperar que dentro de pocos días aparezca (si no ha aparecido ya, pues estamos grabando...) que salga el segundo parche, teniendo la versión 22.2.2, que en matemáticas recreativas se considera un repdigit es un número formado por la repetición de un mismo dígito (es decir, un monodígito).

11.1.1 -> hace 5 años y medio 27 de enero de 2021

La v33.3.3, con la nueva frecuencia de lanzamientos -> dentro de 11 años (si de aquí a allá con el desarrollo de la AI tiene sentido que continúen existiendo este tipo de frameworks de JS, al menos como lo conocemos hoy en día).

- La llegada del control flow de errores con `@boundary` y más mejoras en el compilador
- Introdución de Router Resources reactivos en el enrutador
- Mejoras en la integración de Angular con el protocolo WebMCP.

# Preguntas

1. Para arrancar y sentar el contexto del framework, en Angular 22.2 se incorpora en dev preview el soporte para el bloque `@boundary` en el lenguaje de plantillas. (quienes desarrollen en React van a encontrar enseguida similaridad con los Error Boundaries, pues de ello esta nueva caracteristica de Angular ha sido inspirada en ellos) Hasta ahora dependíamos fundamentalmente del `ErrorHandler` global o de soluciones muy creativas basadas en directivas.

`@boundary` mejora el control en tiempo de ejecución al permitir aislar fallos de renderizado en subárboles de componentes sin comprometer la aplicación completa.

- Manejo condicional de errores con la cláusula `when`
- Se puede intentar resetear mediante la función implícita $reset() que incluye el bloque de `@error`. Cuando se invoca a `$reset()`, esa vista se vuelve a ejecutar, reintentando el renderizado del bloque.

💡 Una vista en Angular es una porción de la plantilla de un componente que puede actualizarse de forma independiente

💡 Cambio de modelo mental: pasar de un fallo catastrófico no capturado que deja la app en estado indefinido a una degradación elegante y declarativa con bloques `@boundary` y `@error (let err)`.

2. En el compilador de plantillas, un cambio esperado desde hace mucho tiempo es que ahora se permite acceder a propiedades `private` del componente. Durante años teníamos que relajar los modificadores de acceso a `protected` o `public` para lograrlo. ¿Qué impacto tiene esta flexibilización en la arquitectura del componente, y cómo beneficia la minificación y mangling de código en producción?

💡 Encapsulamiento real:
Antes usábamos protected solo para complacer al compilador de Angular, pero eso abría la puerta a que cualquier clase que heredara del componente pudiera tocar o romper ese estado interno. Con private, lo que es interno se queda adentro y no se fuga.

💡 Menos código y menos bundle (Mangling):
Cuando una propiedad es private, los minificadores de producción (como esbuild o Terser) tienen la seguridad de que nadie fuera del componente la está usando. Eso les permite renombrarla a una sola letra (por ejemplo, cambiar userProfileStatus por a), reduciendo el peso final del JavaScript.

3. En el `compiler-cli`, se introdujo un nuevo diagnóstico extendido con la opción `strictUnclaimedEventNames` (estricta detección de nombres de eventos no reclamados) para detectar eventos enlazados o outputs mal escritos. Se introduce esta opción que informa sobre bindings de eventos en elementos cuyo nombre no coincide con ningún output de las directivas coincidentes ni con un evento nativo del DOM. Muy util para proyectos donde no exista un linting estricto ni una revisión de código exhaustiva.

💡 Contextualizar cómo el compilador antes trataba los eventos desconocidos como eventos nativos del DOM que no emitían error estricto, dejando fallos silenciosos donde el handler nunca se disparaba.

4. En el paquete `@angular/router`, se exponen ahora los "Router Resources" como API pública (`router_resource`), además de añadir un método `reload` en recursos vinculados a `ActivatedRoute`. Considerando el avance de la reactividad asíncrona con `resource` y `rxResource` (interop con RxJS), ¿cómo sustituyen los Router Resources a los resolvers tradicionales que suelen bloquear y retrasar la navegación entre rutas?

💡 Destacar el desacoplamiento: los antiguos resolvers retenían la navegación síncronamente hasta que los datos resolvían, mientras que Router Resources permiten transiciones inmediatas de interfaz mientras la data fluye de manera reactiva e independiente dentro del grafo de señales.

💡 Los Router Resources se cargan en paralelo, evitando las típicas cascadas secuenciales entre rutas padre e hijo.

💡 Esta funcionalidad se activa mediante `withRouterResources` en la configuración del router.

5. En este minor release también se ha estabilizado la función de limpieza automática de inyectores (`stabilize auto cleanup injectors feature`) en el Router.

💡 Abordar la gestión de memoria y el ciclo de vida de servicios locales provistos en subrutas `providers: [...]` cuando una rama de la ruta se destruye o reemplaza.

6. En el área de formularios reactivos basados en señales (los Signal Forms), se habilitó el soporte para campos ocultos permanentes (`permanent hidden fields in signal forms`). En un modelo declarativo donde el formulario refleja el estado de las señales, ¿por qué es necesario un mecanismo específico para campos ocultos y cómo asegura la integridad del modelo de datos enviado al backend?

💡 Discutir la persistencia de identificadores internos, tokens CSRF o metadatos de auditoría que deben acompañar la estructura de datos del formulario sin requerir representación visual en el DOM.

7. El compilador optimizó los bloques `@defer` al aislar el chequeo de tipos para bloques con claves (`keyed defer blocks`) y deduplicar imports diferidos a través de múltiples bloques. Desde la perspectiva de rendimiento web y métricas Core Web Vitals (como LCP e INP), ¿cuánto influye esta optimización en la generación de chunks y la eficiencia de carga bajo demanda?

💡 Explicar cómo la deduplicación de imports diferidos compartidos previene la sobrecarga de fragmentos JavaScript redundantes y mejora el árbol de dependencias emitido por el bundler.

8. Uno de los añadidos más vanguardistas (con relación a la experiencia de AI para desarrolladores) acá en Angular 22.2 es la compatibilidad con anotaciones en declaraciones de herramientas WebMCP y los flags `readOnlyHint` y `untrustedContentHint` en Signal Forms. Damián, tú que exploras de cerca la convergencia de Angular con IA, ¿qué es WebMCP y qué significa técnicamente que una aplicación Angular pueda exponer herramientas y formularios tipados dentro del contexto de inyección para agentes de IA?

💡 Explicar que WebMCP estandariza cómo los agentes de IA descubren e invocan capacidades dentro de una aplicación web cliente ejecutándose dentro del Angular Injection Context, evitando técnicas frágiles de raspado (scraping) del DOM y aplicando salvaguardas de seguridad para contenido no confiable.

9. Finalmente, en el manejo de estilos, se refinó el encapsulado para reglas de CSS anidadas. Dado que el CSS nativo moderno soporta nesting directamente en los navegadores, ¿hacia dónde va la estrategia de `ViewEncapsulation` de Angular para convivir con los nuevos estándares de la plataforma web sin depender de preprocesadores?

💡 Conectar con la filosofía de Angular de abrazar la plataforma web moderna nativa, reduciendo la necesidad de transformaciones pesadas mientras se mantiene el aislamiento de estilos de componentes.

--
Nos ha quedado:
- Estadísticas del bundle: en la versión 22.2 se genera un fichero para el build del navegador (`browser-stats.json`) y otro para el build del servidor (`server-stats.json`) (si tu aplicación tiene SSR). Esto facilita el análisis del tamaño del bundle de cada build por separado con herramientas omo esbuild-visualizer.

- Vitest 5

10. Antes de concluir el episodio, ¿hay algo más que no hayamos mencionado durante la conversación sobre lo que quieras comentar?






