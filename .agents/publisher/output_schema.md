# youtube_description_es.md / youtube_description_en.md
[NO MARKDOWN FORMATTING IN CONTENT - ONLY PLAIN TEXT AND LINKS]
Generate two separate files, one in Spanish and one in English.

{{ Concise, evergreen intro paragraph introducing the release/topic, guest (with credentials, e.g. GDE in Angular), and a direct technical/mathematical hook or curiosity to engage the audience. Avoid ephemeral time anchors like "la semana pasada" or "last week". }}

## Temas que abordamos:
00:00:00 Bienvenida a {{Guest Name}}
hh:mm:ss Patrocinador: {{Sponsor Name}} (omit if no sponsor)
hh:mm:ss {{Concise Chapter title 1}}
hh:mm:ss {{Concise Chapter title 2}}
hh:mm:ss {{Final topic}} y cierre

## Conecta con el invitado:
{{Guest Name}}: {{LinkedIn URL}} | {{GitHub URL}}

## Patrocinador:
{{Sponsor Name}}: Visita {{Tracking Link}} para descargar la aplicación en iOS o Android. (omit section if no sponsor)

Angularidades en LinkedIn: https://www.linkedin.com/company/angularidades/

[English version should translate this naturally]:
## Topics we cover:
00:00:00 Welcome {{Guest Name}}
hh:mm:ss Sponsor: {{Sponsor Name}}
hh:mm:ss {{Concise Chapter title 1}}
hh:mm:ss {{Final topic}} and Wrap-Up

## Connect with our guest:
{{Guest Name}}: {{LinkedIn URL}} | {{GitHub URL}}

## Sponsor:
{{Sponsor Name}}: Visit {{Tracking Link}} to download the iOS or Android app.

Angularidades on LinkedIn: https://www.linkedin.com/company/angularidades/

*Rules:*
- GENERATE BOTH SPANISH AND ENGLISH FILES.
- STRICT SECTION ORDER:
  1. Intro hook paragraph (evergreen, no ephemeral anchors)
  2. ## Temas que abordamos: / ## Topics we cover:
  3. ## Conecta con el invitado: / ## Connect with our guest: (use plural "los invitados" / "our guests" only if multiple guests)
  4. ## Patrocinador: / ## Sponsor: (only if the episode has a sponsor)
  5. Angularidades en LinkedIn: / Angularidades on LinkedIn:
- EVERGREEN HOOK: Do NOT use time-anchored phrases like "la semana pasada", "last week", or "ayer". Frame intros as timeless milestones (e.g. "Ya tenemos con nosotros a...", "Angular X.Y is officially here...").
- CONCISE CHAPTER TITLES: Keep chapter names short, punchy, and title-like, focusing directly on the feature/API name (e.g. "Router Resources", "hidden() en Signal Forms", "Bloques @boundary", "CSS Nesting nativo"). Start with "Bienvenida a..." / "Welcome..." and end with "... y cierre" / "... and Wrap-Up".
- SINGLE-LINE GUEST LINKS: Do NOT mention the guest's name on multiple lines. Format all guest profile links on a single line separated by pipe: `{{Guest Name}}: {{LinkedIn Link}} | {{GitHub Link}}`.
- DEDICATED SPONSOR SECTION: If a sponsor is present, place it under `## Patrocinador:` / `## Sponsor:` with the platform-appropriate tracking link and call-to-action.
- NEVER hallucinate URLs. If guest last names or LinkedIn/GitHub URLs are not provided, stop and ASK the user for them.
- No markdown formatting in description content (only plain text and URLs; headings use standard `##`).
- For Chapters: Extract precise timestamps directly from the SRT/SBV. Chapters reflect the exact second a topic begins. Do not round or infer times.

---
# spotify_description_es.md
[OPTIMIZED FOR SPOTIFY & PODCAST SHOW NOTES - SPANISH ONLY - NO EMOJIS - NO MARKDOWN HEADERS (NO ##)]
Generate only one file in Spanish (Spotify does not support multilingual localized episode descriptions).

{{ Concise, evergreen intro paragraph (1-2 sentences) introducing the topic and guest with credentials. Must fit comfortably above Spotify's mobile fold. Avoid ephemeral time anchors like "la semana pasada" or "last week". }}

Patrocinador:
{{Sponsor Name}}: Visita {{Spotify Tracking Link}} para descargar la aplicación en iOS o Android. (omit section if no sponsor)

Temas que abordamos:
00:00:00 Bienvenida a {{Guest Name}}
hh:mm:ss Patrocinador: {{Sponsor Name}} (omit if no sponsor)
hh:mm:ss {{Concise Chapter title 1}}
hh:mm:ss {{Concise Chapter title 2}}
hh:mm:ss {{Final topic}} y cierre

Conecta con el invitado:
{{Guest Name}}: {{LinkedIn URL}} | {{GitHub URL}}

Angularidades en LinkedIn: https://www.linkedin.com/company/angularidades/

*Rules:*
- GENERATE SPANISH FILE ONLY (spotify_description_es.md). Spotify/RSS feeds do not have multilingual localized descriptions.
- STRICT SECTION ORDER:
  1. Intro hook paragraph (concise, 1-2 sentences, above the fold)
  2. Patrocinador: (immediately after intro so listeners see it without scrolling past 20 chapters)
  3. Temas que abordamos:
  4. Conecta con el invitado: (use plural "Conecta con los invitados" if multiple guests)
  5. Angularidades en LinkedIn: https://www.linkedin.com/company/angularidades/
- NO EMOJIS: Do NOT include emojis in Spotify descriptions. Keep section titles plain and clean.
- SPOTIFY TRACKING LINK: Use the Spotify-specific UTM tracking link from `metadata.json` (`sponsor.trackingLinks.spotify`), NOT the YouTube or LinkedIn link.
- NO MARKDOWN HEADERS: Do NOT use `##` or `#` headers. Spotify does not render markdown headings (they show as literal `##`). Use clean plain text labels without `#`.
- CLICKABLE TIMESTAMPS: Use `hh:mm:ss` or `mm:ss` timestamps. Spotify automatically renders standard timestamps as interactive seek buttons in the player.
- EVERGREEN HOOK: Do NOT use time-anchored phrases like "la semana pasada", "last week", or "ayer".
- SINGLE-LINE GUEST LINKS: Combine profile links on one line: `{{Guest Name}}: {{LinkedIn Link}} | {{GitHub Link}}`.

---
# linkedin_post_es.md
[SPANISH ONLY]
Generate only one file in Spanish (linkedin_post_es.md).
```
{{ same evergreen pitch of the description, developed organically }}

Temas que abordamos durante la conversación:
✔️ {{Point 1}}
✔️ {{Point 2}}
✔️ {{Point 3}}

🛍️ Conoce más sobre {{Sponsor}}, patrocinador de este episodio: {{LinkedIn Tracking URL}} (omit if no sponsor)

🎧 Escucha el episodio #{{episode_number}} en YouTube (con subtítulos revisados en español e inglés): https://youtu.be/{{videoId}}, Spotify o en tu plataforma de podcast favorita.
```
*Rules:*
- GENERATE SPANISH FILE ONLY (linkedin_post_es.md). Do NOT generate English LinkedIn posts.
- Intro: organic, fluid narrative based directly on the YouTube description evergreen hook, connecting the release and guest naturally. Avoid academic clichés or overly wordy definitions.
- Mention guest's name and episode number. Use bullet points (✔️).
- Include sponsor line with LinkedIn UTM tracking link if a sponsor exists for the episode.
- Must mention "(con subtítulos revisados en español e inglés)" and the YouTube link `https://youtu.be/{{videoId}}`.

---
---
---
# youtube_captions_es.sbv
**[CRITICAL INSTRUCTION - YOUTUBE SYNC COMPATIBILITY]**
Technically reviewed, cleaned, and corrected Spanish transcript.
FORMAT: Valid SBV (SubViewer) format, strictly maintaining the exact same timestamps from the original recording captions file.
- DO NOT add speaker tags (e.g., "Name:").
- DO NOT remove timestamps or change pacing.
- Correct grammatical, semantic, and phonetic transcription mistakes from YouTube ASR.
- Correct and standardize people's names (hosts, guests, community members).
- Correct technical typos and terminology based on official Angular docs and `@angular-developer` skill (e.g. "box" -> "bugs", "Cloud Room" -> "Cloud Run", "Signals", "SSR", "hydration").
- Strictly preserve internal line breaks (`\n`) within each block.
- Multilingual caption translations (English, etc.) are deferred to YouTube's auto-translation engine.

---
---
# youtube_title_es.txt / youtube_title_en.txt
Generate two separate files, one in Spanish and one in English.

ES Format:
Despliegue de Angular SSR con {{Guest1 Name}} y {{Guest2 Name}} - Episodio {{episode_number}}

EN Format:
{{Technical Topic}} with {{Guest1 Name}} and {{Guest2 Name}} - Episode {{episode_number}}

*Rules:*
- ES title MUST start with "Despliegue de Angular SSR con" (or suitable technical hook).
- Include full names of guests.
- Use Title Case for English titles.
- Keep titles under 100 characters if possible.

---
# youtube_tags.txt
Comma-separated technical tags based on the episode content for YouTube.

```
angular, ssr, hybrid rendering, {{tag1}}, {{tag2}}
```
*Rules:*
- Output as a single line of comma-separated values.
- Include 5-10 relevant technical tags.
