# Security and Privacy Policy

## Credential Handling
- **DO NOT COMMIT** under any circumstances API keys (OpenAI, Gemini, Anthropic, Riverside) to this repository.
- Ensure that your `.env` environment is always in your global or local `.gitignore` file.

## Data Privacy
- Review the raw transcripts (`inputs/`) before processing them.
- If a guest mentions confidential information, passwords, or PII (Personally Identifiable Information) that should be edited from the final episode, remove it from the text transcript BEFORE running the agent to prevent it from leaking into the generated summaries or metadata.

## Reporting a Vulnerability

If you discover a security vulnerability in Angularidades, please DO NOT open a public issue.

Instead, please report it privately to the maintainers to give us time to fix the issue before making it public.

- Email the core maintainers directly or use GitHub's private vulnerability reporting feature.
- Provide a detailed summary of the vulnerability, including step-by-step instructions on how to reproduce it.

### Our Process
1. **Acknowledgment**: You should receive an acknowledgment of your report.
2. **Investigation**: We will investigate the issue and keep you informed of our progress.
3. **Patch**: We will develop, test, and release a fix.

We appreciate your help in keeping our project secure.