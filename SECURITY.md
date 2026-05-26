# Security Policy

> [!IMPORTANT]
> This document outlines the security posture, vulnerability reporting, and incident response procedures for this project. Maintainers and contributors must adhere to these practices to protect user data and ensure system integrity.

## Supported Versions

Only the latest release on the primary development branch is actively supported with security updates. We do not maintain security patches for older major or minor versions.

## Dependency Management

To prevent supply-chain vulnerabilities:
* Automated dependency scanning must be enabled (e.g., GitHub Dependabot or Snyk).
* No pull request containing dependencies with known high or critical severity CVEs (Common Vulnerabilities and Exposures) should be merged.
* Dependencies should be regularly updated to their latest stable patches.

## Vulnerability Reporting

If you find a security vulnerability, **please do not open a public issue.** 

Instead, report it privately to ensure we can resolve the issue before it is publicly disclosed.

### Reporting Channels
* Email the maintainers directly.
* Or submit a report privately through GitHub's Private Vulnerability Reporting feature in the **Security** tab of the repository.

### What to Include
When reporting a vulnerability, please provide a detailed description including:
* The affected version or component.
* Step-by-step instructions to reproduce the issue (including proof-of-concept scripts or steps, if applicable).
* The potential impact of the vulnerability.

### Our Process
1. **Acknowledgment**: We will acknowledge receipt of your report within [X] business days.
2. **Investigation**: We will investigate the issue and coordinate with you to gather details.
3. **Remediation**: We will build and test a patch, then release it in a timely manner.
