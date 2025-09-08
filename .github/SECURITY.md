# Security Policy

## Overview

This BIP39 mnemonic tool handles sensitive cryptographic material and requires the highest security standards. This document outlines our security practices and how to report vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Practices

### Cryptographic Security
- Uses industry-standard cryptographic libraries (bitcoinjs, noble-crypto)
- All entropy generation uses cryptographically secure random number generators
- Private keys and seeds are handled securely in memory
- No sensitive data is transmitted over networks
- All cryptographic operations are performed client-side

### Code Security
- TypeScript for type safety and reduced runtime errors
- Comprehensive test coverage including security-focused tests
- Automated dependency vulnerability scanning
- Code review required for all changes
- Linting and static analysis on all commits

### Build Security
- Reproducible builds using pnpm with lock files
- Automated security audits in CI/CD pipeline
- Signed releases with SHA256 checksums
- Source code transparency (100% open source)

## Reporting a Vulnerability

**DO NOT** report security vulnerabilities through public GitHub issues.

Instead, please report vulnerabilities through one of the following methods:

1. **GitHub Security Advisories** (preferred)
   - Go to the Security tab of this repository
   - Click "Report a vulnerability"
   - Fill out the security advisory form

2. **Email**
   - Send an email to: security@bip39tool.com
   - Include a detailed description of the vulnerability
   - Include steps to reproduce if applicable
   - Include your contact information

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability (e.g., cryptographic, input validation, etc.)
- Full paths of source file(s) related to the manifestation
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if available)
- Impact assessment

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Status Updates**: Weekly until resolved
- **Resolution**: Target within 90 days for critical vulnerabilities

### Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our investigation
- Once fixed, we will coordinate disclosure with you
- We will credit you in our security advisories (unless you prefer to remain anonymous)

## Security Best Practices for Users

### For Maximum Security
1. **Use Offline**: Download and run the tool offline on an air-gapped computer
2. **Verify Checksums**: Always verify SHA256 checksums of downloaded files
3. **Use Trusted Hardware**: Use a clean, malware-free computer
4. **Secure Storage**: Write down mnemonics on paper, store in a safe place
5. **Never Share**: Never share mnemonics, seeds, or private keys

### Red Flags
**Never use this tool if:**
- You're running it on a compromised computer
- You're using it over an untrusted network
- The file checksums don't match
- The browser shows security warnings
- You're being asked to enter your mnemonic on any website

## Cryptographic Dependencies

This tool relies on these audited cryptographic libraries:

- **bip39**: JavaScript implementation of BIP39
- **bip32**: BIP32 hierarchical deterministic wallets
- **bitcoinjs-lib**: Bitcoin cryptographic primitives  
- **tiny-secp256k1**: Optimized secp256k1 elliptic curve
- **@noble/hashes**: Modern cryptographic hashing
- **@noble/secp256k1**: Pure JavaScript secp256k1

## Security Audits

- Code is continuously monitored for vulnerabilities
- Dependencies are automatically scanned and updated
- Regular security reviews of cryptographic implementations
- Community security review through open source transparency

## Bug Bounty

While we don't currently offer a formal bug bounty program, we greatly appreciate security researchers who responsibly disclose vulnerabilities. Significant findings may be eligible for recognition and swag.

---

Thank you for helping keep the BIP39 tool and its users safe!