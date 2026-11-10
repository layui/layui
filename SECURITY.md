# Security Policy

## Supported Versions

The following versions are currently supported with security updates:

| Version                | Supported          |
| ---------------------- | ------------------ |
| 3.x                    | :x:                |
| 2.x (2.10.0 and later) | :white_check_mark: |
| < 2.10.0               | :x:                |

Layui 3 on `main`, including alpha releases, is still under development. Its
implementation may change substantially before a stable release, and it is not
currently covered by our regular security advisories or security updates. We do
not recommend using development or pre-release versions in production.

## Reporting a Vulnerability

Please focus security testing and reports on the versions listed as supported
above. Include the affected version, reproduction details, and potential impact
in your report.

To report a vulnerability privately, use
[GitHub private vulnerability reporting](https://github.com/layui/layui/security/advisories/new).
Please do not disclose the details in a public issue.

### Scope

Security issues are in scope when an attacker can trigger them through a
component's normal behavior.

We do not consider XSS or injection vulnerabilities in scope when they can only
occur because an application intentionally supplies untrusted content to an
option documented to interpret that content as HTML, a template, or executable
code. Applications are responsible for escaping or sanitizing such content.
Reports in this category will be closed as out of scope.
