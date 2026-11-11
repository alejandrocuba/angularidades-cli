# youtube_description_es.md / youtube_description_en.md
[NO MARKDOWN FORMATTING IN CONTENT - ONLY PLAIN TEXT AND LINKS]
Generate two separate files, one in Spanish and one in English.

{{ 1-2 direct technical questions engaging the listener's curiosity }}
(Start by asking a specific and relevant question to the audience, like: "Are you considering using Analog for your next full-stack Angular project?")

Aprende directamente de {{guest1}} y {{guest2}}, {{role/bio}}. Desde el {{Location}}, desglosan {{Topic}} y cómo resuelven {{Problem}}.
[English version should translate this naturally]

## Temas que abordamos:
00:00:00 Intro
hh:mm:ss {{Chapter title 1}}
hh:mm:ss {{Chapter title 2}}

## Conecta con los invitados:
{{Guest 1 Name}}: {{Link}}
{{Guest 2 Name}}: {{Link}}

Angularidades en LinkedIn (Angularidades on LinkedIn): https://www.linkedin.com/company/angularidades/

*Rules:*
- GENERATE BOTH SPANISH AND ENGLISH FILES.
- NEVER hallucinate URLs. If guest last names or LinkedIn URLs are not provided, stop and ASK the user for them.
- No markdown formatting.
- Group guests naturally in the intro sentence.
- Use Title Case for section headers, not CAPS.
- Simple line breaks between sections.
- For Chapters:
  - Extract precise timestamps directly from the SRT/SBV file. Chapters reflect the exact second a topic begins. Do not round or infer times.
  - The first chapter MUST start at `00:00:00 Intro` (or `00:00 Intro`).
  - **Brevity & Scannability (YouTube UX Best Practices):** Chapter titles MUST be concise, punchy, and scannable: **2 to 5 words** (strictly **under 40 characters**).
  - **No Compound Descriptions:** NEVER write long sentences, subtitle explanations, or compound clauses with colons (e.g. AVOID `Topic: how to do X and why Y matters`). Long titles get truncated with ellipses (`...`) on mobile devices and YouTube scrubber bars.

---
# linkedin_post_es.md / linkedin_post_en.md
Generate two separate files, one in Spanish and one in English.
```
{{ same pitch of the description }}

Temas que abordamos durante la conversación:
✔️ {{Point 1}}
✔️ {{Point 2}}
✔️ {{Point 3}}

🎧 Escucha el episodio #{{episode_number}} en YouTube (audio en español con subtítulos en inglés): {{link}}, Spotify o en tu plataforma de podcast favorita.
```
*Rules:*
- GENERATE BOTH SPANISH AND ENGLISH FILES.
- English version must mention: "Spanish audio with subtitles". Spanish version must mention "Audio en español con subtítulos".
- Intro: factual, concise, relevant for technical audience.
- Mention guest's name and episode number. Use bullet points (✔️).

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
