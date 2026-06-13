# Introducción

Lo que viene a traducirse en español como "habilidades" para esos agentes de inteligencia artificial con los que contamos hoy en día en muchos de nuestros entornos de desarrollo de software, se trata basicamente de ficheros de texto con instrucciones estructuradas, usualmente en formato Markdown y acompañados de metadatos en formato YAML.

El propósito de los  skills  es proveerle a la AI instrucciones estructuradas para que se comporte de manera predecible en nuestros entornos de desarrollo locales. En el desarrollo de software, se busca que las herramientas sean "deterministas", un concepto que significa que el sistema funciona como una función pura: si le entregas el mismo valor o instrucción inicial, te devolverá exactamente el mismo resultado siempre, sin variaciones ni desviaciones. Sin embargo, los modelos de lenguaje o LLMs actuales no operan bajo esa lógica rígida, sino que (explicando a grandes rasgos) calculan qué término tiene más probabilidad de seguir al anterior, lo que introduce diferencias cada vez que generan código de un lenguage de programación como TypeScript, que al final es representado para los seres humanos como texto, para que podamos comunicarle nuestra intención y algoritmos a las máquinas. Al utilizar un skill, logramos acotar esas posibilidades y limitamos el margen de error del asistente, pero debido a su diseño estocástico, probabilístico, no podemos garantizar que el código devuelto sea 100% idéntico en cada ejecución.

# Orígenes y Adopción en Angular
> [`angular-skills`](https://github.com/analogjs/angular-skills).
- El ecosistema de Angular comenzó a notar bien de cerca este movimiento en torno a los agent skills gracias en buena medida a Brandon Roberts (uno de los Google Developer Experts que mantienen el núcleo de la biblioteca NgRx y también conocido en la comunidad como el creador del metaframework Analog). Brandon incorporó hace seis meses, el 23 de enero, en el github de Analog, un repositorio con una colección de 10 skills bocetados para guiar la creación de componentes modernos con signals, zoneless, inyección de dependencias empleando la función `inject()`, el buen uso de SSR, hidratación y otras bondades del Angular moderno. Todo compatible con Angular 20 y 21, que recién estrenaba su primer minor por aquellas fechas a principios de año.
- Es que la problemática era evidente: los modelos entrenados con documentación antigua sugerían NgModules o `*ngIf`. Los skills ayudan a mitigar este problema de desalineación temporal (temporal misalignment o temporal degradation) y otro peor aún: las alucinaciones inducidas por cortes temporals (temporal cutoff-induced hallucination).
- Miren, el resultado fue épico. Un par de meses después, el equipo de Angular llevó este mismo concepto y estructuración directamente al framework, haciéndo los skills de Angular algo "oficial". Bueno, oficial no del todo hasta el anuncio de Angular 22, donde el equipo de Angular los anunció como una pieza clave de su estrategia de herramientas de IA, alineado con el objetivo #1 del roadmap del framework: mejorar la experiencia de IA para los desarrolladores.

# Instalación y Configuración
- Aunque conceptualmente son archivos Markdown, su instalación es automatizada y controlada.
- Gracias al ecosistema abierto de skills.sh, ocurre una magia muy similar a la de un gestor de paquetes tradicional, como `npm` o el `pnpm`.
- Según la configuración de instalación en el repositorio local, el gestor de dependencias genera una estructura donde:
    1. Se crea un directorio local (por ejemplo `.agents/skills/` en la raíz del repositorio) donde se descarga una copia de los artefacos modulares del skill. El núcleo de este módulo es el fichero `SKILL.md` con las instruciones base, acompañado de cualquier fichero adicional de documentación o ejecutable necesario para que el agente de IA realice sus tareas.
    2. Además, se genera o actualiza en la raíz del repositorio el fichero de rastreo `skills-lock.json`. Este fichero mantiene un registro exacto del origen (ej. `angular/skills`), el tipo de proveedor (`github`), la ruta de resolución local y un `computedHash` para verificar la integridad de esos ficheros de skills durante procesos de instalación o sincronización, de tal forma que la IA trabaje exactamente con la versión oficial y no con dependencias corrompidas antes de que el orquestador exponga esas instrucciones al modelo que usemos en nuestro IDE.

# Configuración de IA en `ng new` vs. Skills
- Si han creado un proyecto recientemente con las últimas versiones del Angular CLI, habrán notado una nueva pregunta en el asistente interactivo: *"Which AI tools do you want to configure with Angular best practices? https://angular.dev/ai/develop-with-ai"*.
- Esta opción (que también se puede invocar directamente con el flag `--ai-config`) nos permite seleccionar las herramientas de IA que usemos, como Gemini, Claude Code, Copilot, JetBrains, etc.
- Al seleccionarlas, el CLI genera archivos de configuración y reglas locales en nuestro espacio de trabajo (por ejemplo, un `.gemini/GEMINI.md`, un `.cursor/rules/cursor.mdc` o un `.github/copilot-instructions.md`).
- ¿Cuál es la gran diferencia entre esto y un Skill?
    - Por un lado, las reglas de `ng new` / `--ai-config` son instrucciones estáticas del sistema a nivel de IDE o asistente de chat. Le indican reglas globales al modelo que usemos en el editor sobre cómo estructurar el código en ese proyecto.
    - En cambio, los skills son unidades de capacidad dinámicas, estructuradas y versionadas bajo demanda. No están ancladas a un IDE en particular, sino que están pensados para flujos de trabajo de agentes autónomos.
    - La ventaja clave de los skills está en el patrón de revelado progresivo (progressive disclosure), pues la IA no se come un contexto inmenso de golpe, sino que carga un índice ligero inicial y sólo lee el fichero completo cuando la tarea lo amerita. Esto optimiza la memoria de contexto y ahorra esos preciados tokens que hoy en día tanto cuestan.
    - Aunque el costo es en latencia y cierta tasa de error inducida por la recuperación de información, pues el agente requiere pasos adicionales de razonamiento para decidir cuándo abrir el archivo completo. En bases de código complejas con alta densidad de skills, esta fragmentación puede resultar en que el modelo ignore instrucciones clave, resolviendo la microtarea pero potencialmente afectando la arquitectura a gran escala del proyecto en general.

# Skills vs. Angular Coding Style Guide
> https://angular.dev/style-guide
- Ahora, recuerdan que en angular.dev existe una guía de estilos, que hace poco más de un año, cuando el lanzamiento de Angular 20, se modernizó y aligeró completamente? De eso hemos hablado con varios invitados en episodios anteriores... de que antes tenía 52 páginas al imprimirse, con estándares de 2016, y bajo la dirección de Jeremy Elbourn (que ya no se encuentra en el equipo) la guía se condensó hasta quedar en aproximadamente unas 4 páginas centradas únicamente en decisiones de diseño de software específicas de Angular.
- Por más ligera que sea la nueva guía de estilos de Angular, las guías de estilo estáticas están pensadas para humanos, y a menudo su interpretación varía dependiendo de quién (o qué agente IA) las lea.
- Los skills son ideales para guiar el comportamiento de agentes IA, pues se cargan y actúan como un marco de referencia ejecutable y dinámico.
- La idea detrás del mantenimiento de estos skills es usar un formato ultra-ligero para no saturar a los LLMs, con un sistema de metadatos que permite descubrir gracias al patrón de revelado progresivo cuál skill es el pertinente para cada tarea según el prompt o instrucciones que le enviemos al agente de IA.
- Al seguir la guía de estilos y además adoptar los skills, estamos estandarizando el "idioma" a emplear entre todos nosotros: los desarrolladores humanos que colaboran entre sí, y las herramientas automatizadas que siguen esas mismas reglas exactas para reducir la brecha entre lo que una persona quiere y lo que la IA o otra persona del mismo equipo entiende. Esto en teoría y desde mi experiencia, también en la práctica, aumenta nuestra productividad y reduce ruido, errores y costos del proyecto.

# No son solo para máquinas
- Leer los archivos `SKILL.md` es una práctica altamente recomendada para ingenieros y arquitectos de software.
- Permiten a los equipos humanos alinear sus modelos mentales y entender de primera mano la arquitectura recomendada por el framework y cómo la IA debe mantener esa línea.


# Angular Agent Skills

## angular-developer
> https://github.com/angular/skills/tree/main/angular-developer
- `angular-developer`: contiene una guía exhaustiva que instruye al agente para generar código Angular bien estructurado, eficiente y accesible siguiendo las prácticas modernas del framework:
- Obliga al agente a analizar primero la versión de Angular del proyecto para evitar sugerir características incompatibles.
- Guía la generación de componentes y servicios estructurados usando estrictamente comandos del Angular CLI.
- Fuerza al asistente a usar las APIs reactivas modernas basadas en Signals.
- Análisis del proyecto antes de elegir entre: Signal Forms, Reactive o Template-driven, promoviendo explícitamente el uso de Signal Forms para aplicaciones nuevas utilizando las versiones más recientes de Angular.
    - Enseña cómo aplicar accesibilidad usando los patrones de Angular Aria para construir componentes complejos (Acordeones, Listboxes, Autocompletado, etc.).
    - Instruye sobre estrategias de enrutamiento avanzado usando route guards, data resolvers, router lifecycle y debugging.
    - También indica al modelo sobre cómo proceder con estrategias de representación híbrida (SSR, SSG, CSR), hidratación, view transitions, unit testing con Vitest, cómo integrar Tailwind CSS, encapsular CSS, desarrollar animaciones con CSS Nativo, etc.
    - Ahora, hay que tener en cuenta que forzar el uso estricto de APIs modernas asume que todos los problemas de desarrollo en Angular requieren las soluciones más recientes. En proyectos que aún tengan retraso con actualizaciones a versiones más recientes, o aplicaciones empresariales con dependencias obsoletas, un skill oficial que rechace el uso de APIs "históricas" puede generar fricción, requiriendo mayor intervención nuestra para reoorientar o deshacer refactorizaciones "modernas" que puedan romper la arquitectura de aplicaciones legacy.

## angular-new-app
> https://github.com/angular/skills/tree/main/angular-new-app
- Se enfoca pura y exclusivamente en el scaffolding o creación de una app desde cero.
- Verifica inteligentemente en el SO si el Angular CLI está preinstalado (usando `which ng` en Mac/Linux o `where ng` / `gcm ng` en Windows).
- Si no está instalado, se ofrece a instalarlo globalmente vía `npm install -g @angular/cli`.
- Al generar el proyecto, extrae los requerimientos del usuario en un proceso interactivo con el script de creación del proyecto.
- Por cierto, las instrucciones de este skill sugieren que se configure el Angular CLI MCP, permitiendo que el agente invoque la herramienta `get_best_practices` para dejar el proyecto bien estructurado.
- Obviamente, después de usar este skill para generar el proyecto, revisa esa estructura inicial, añade cualquier biblioteca, skills e instrucciones adicionales que necesites para tu proyecto desde un inicio, y ejecuta `ng build`, `prettier`, linters, unit tests preliminares y cualquier otra herramienta que te ayude a detectar errores de antemano y escalar el proyecto adecuadamente.

## Angular Contributor Skills
> https://github.com/angular/angular/tree/main/.agent/skills
- Ubicados estratégicamente dentro del código fuente del propio framework (`angular/angular/.agent/skills`).
- A diferencia de los otros skills enfocados en quienes *usamos* el framework, estos guían a quienes *contribuyen* al código fuente de Angular.
- Instruyen al agente sobre cómo configurar el entorno local, construir el monorepo y ejecutar la compleja suite de pruebas interna.
- Además, aseguran que cualquier código generado para una Pull Request cumpla estrictamente con las convenciones de mensajes de commit, reglas de estilo internas y el riguroso flujo del equipo core.

### pr_review
- Guía sobre contexto y enfoque clave (backward compatibility, mensajes de commit)
- Workflow: revisión local (si eres el autor) vs. revisión remota (para otros PRs)
- Scripts Bash para interactuar con PRs (comentarios, propuestas de cambio)
- Requisitos: checklist, feedback constructivo, evitar comentarios de aprobación en PRs externos

### adev-writing-guide
- Guía integral para escribir documentación de Angular (adev)
- Estándares Google Technical Writing (tono conversacional, voz activa, enfoque en la audiencia, en el lector)
- Convenciones markdown específicas de Angular (bloques de código con angular-ts/angular-html, atributos de resaltado)
- Lista los componentes personalizados (docs-code, docs-card, docs-tab, docs-video, etc.)
- Contiene también información sobre la jerarquía de referencias y cuidados tipográficos que se deben tener

### reference-compiler-cli
- Se enfoca en el modelo mental y arquitectura de `packages/compiler-cli` (ngtsc)
- Explica el patrón Wrapper, describe el Sistema Traits: estado máquina (Pending → Analyzed → Resolved → Skipped)
- Detalla los subsistemas clave: Core Orchestration, Trait Compilation, Decorator Handlers, Template Type Checking
- Detalla las fases de compilación: Construction → Analysis → Resolution → Type Checking → Emit

### reference-core
- Se enfoca en la arquitectura de `packages/core`
- Directorios clave y convenciones (estado global, optimización de rendimiento y el uso de prefijos ɵ (letra griega zeta para marcar código interno al framework, lo que nunca deberías usar en tu proyecto, ya que las APIs internas están sin garantías de estabilidad entre incluso versiones menores)
- Motor de rendering (Ivy/Render3) basado en instrucciones (ɵɵelementStart, ɵɵtext, etc.)
- Conceptos: Instructions, LView (estado de vista), TView (estructura compartida), Memory Layout
- Inyección de dependencias: Module Injector (R3Injector) + Node Injector (Bloom Filters)
- Change Detection y Signals

### reference-signal-forms
- Modelo mental y arquitectura de `packages/forms/signals`
- Forms API experimental basada en signals
- Model-Driven: WritableSignal<T> como única fuente de verdad
- Proxy-Based Traversal: acceso lazy a campos anidados
- Schema-Based Logic: validación y metadatos separados de la estructura
- Directiva [formField] como puente DOM-Signal
- Componentes clave: FieldNode, ValidationState, FormField Directive, Schema

En fin, el propósito de esos constributor skills es instruir al agente sobre:
- Cómo navegar arquitecturas complejas del framework
- Patrones internos de diseño para garantizar consistencia
- Estándares de documentación
- Convenciones de código, commit messages y revisión de PRs

# Conclusión

Para concluir este episodio, la adopción de los skills oficiales de Angular permite, salvo ciertas excepciones que dependen finalmente de la naturaleza del proyecto, establecer un marco de referencia unificado que mitigue desalineación arquitectónica entre la intención del ingeniero y la salida del modelo.

Instalen estas herramientas, auditen rigurosamente el código generado para evitar regresiones técnicas usualmente provocadas por dejar correr el agente a lo loco sin supervisión, y midan el impacto real de incorporar estas herramientas de AI en su flujo de desarrollo si tienen métricas adoptadas para ello.

Nos vemos en el próximo episodio. Chao!