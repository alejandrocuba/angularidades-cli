# 01_description.md (English and Spanish)
```
{{ 1-2 direct technical questions engaging the listener's curiosity about specific pain points discussed }}

{{Call to action: "Learn directly from" / "Aprende directamente de"}} {{guest}} ({{handle/nickname}}), {{role/bio}}. {{Context: From [Location], Guest breaks down [Topic]... describing briefly how they solve [Problem] or their story}}.

{{Key Points Header: "Key Points:" / "Puntos clave:"}}
* {{Concise Title 1}}
* {{Concise Title 2}}
* {{Concise Title N}}

{{Guest Name}} en {{Platform}}: {{Link if available}}
{{Call to action: "Follow us on LinkedIn" / "Síguenos en LinkedIn"}}: https://www.linkedin.com/company/angularidades/
```
*Rules:*
- Maintain professional, concise, technical tone.
- Highlight frameworks, methodologies, concrete advice.
- Key Points must be short, descriptive, specific. Between 3-7 words, noun phrases (Title Case), suitable for YouTube Chapters.
- Hook Questions: Focus on technical pain points or misconceptions (e.g., "Why does your build fail silently?").

---
# 02_linkedin.md (English)
```
{{ same pitch of the description }}

Temas que abordamos durante la conversación:
✔️ {{Point 1}}
✔️ {{Point 2}}
✔️ {{Point 3}}

🎧 Escucha el episodio #{{episode_number}} en YouTube: {{link}} o en tu plataforma de podcast favorita.
```
*Rules:*
- Intro: factual, concise, relevant for technical audience.
- Mention guest's name and episode number. Use bullet points (✔️).

---
# 03_chapters.txt (English and Spanish)
**[CRITICAL INSTRUCTION - SOURCE ISOLATION]**
ONLY generate this if `youtube.srt` or a YouTube transcript file is provided.
EXCLUSIVELY use the YouTube transcript/SRT file. IGNORE timestamps from other sources. DO NOT hallucinate.
Check the final timestamp of the SRT file. If a "Key Point" happens after the SRT file ends, DO NOT include that chapter.
Timestamps must reflect the EXACT second (HH:MM:SS) the topic begins. If a topic falls outside the SRT length, skip it.

```
Temas que abordamos:

00:00:00 Intro
hh:mm:ss {{Chapter title 1}}
hh:mm:ss {{Chapter title 2}}
```
*Rules:*
- Extract precise timestamps directly from the SRT.
- Chapters reflect the exact second a topic begins. Do not round or infer times.
- If YouTube file is absent, do not use the Riverside transcript as a fallback.

---
# 04_transcript_en.md
**[CRITICAL INSTRUCTION - SOURCE ISOLATION]**
ONLY generate this if `youtube.srt` or a YouTube transcript file is provided.
The technically reviewed, corrected, and perfectly translated English transcript.
Ensure it reads natively and accurately reflects the technical context of the discussion.

---
# 05_transcript_es.md
**[CRITICAL INSTRUCTION - SOURCE ISOLATION]**
ONLY generate this if `youtube.srt` or a YouTube transcript file is provided.
The technically reviewed, corrected, and naturally flowing Spanish transcript.
Use neutral, professional technical Spanish. Avoid literal, unnatural translations of technical idioms.
