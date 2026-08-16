# Pak Result Checker

A fast, professional, mobile-first Pakistan education result gateway for 9th, 10th, 11th and 12th classes.

## Current build

- Province / region selector
- 25 official board entries covering Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, AJK and Federal Board
- Separate Karachi SSC (BSEK) and HSSC (BIEK) entries
- Board-specific official result links
- Class selector: 9th, 10th, 11th, 12th
- Year selector: 2018–2026
- Annual and Supplementary / 2nd Annual options
- Roll-number and student-name search modes
- Vercel serverless `/api/result` endpoint
- Board-provider architecture with safe fallback to the selected board's official result portal
- Professional responsive result card with print / save-to-PDF flow
- Reserved Google AdSense placements with publisher/slot placeholders
- Trust, About, Contact, Terms, Privacy and Disclaimer pages
- SEO metadata, Open Graph tags, canonical URL, robots.txt and sitemap.xml
- PWA manifest
- Mobile-first responsive UI

## Real-result policy

The site does **not** fabricate student marks. A result is labelled **OFFICIAL BOARD RESULT** only when an authorized provider returns the record. Many official board portals use CAPTCHA, session tokens or other verification, so this project does not bypass those protections.

When an automated provider is not configured, the user gets a direct **Official Result Portal** button for the selected board. This makes every listed board accessible without pretending that a private/unofficial database is an official API.

## Provider architecture

`User Search → /api/result → Board Provider → Normalize → Professional Result Card`

Authorized providers can be added board-by-board without changing the frontend result-card design. Provider credentials belong in Vercel environment variables, never in GitHub.

Generic provider variables follow this pattern:

`RESULT_PROVIDER_<BOARD_SLUG>_URL`

`RESULT_PROVIDER_<BOARD_SLUG>_KEY`

## Advertising / monetization

The website contains responsive ad placements and an AdSense loader, but the repository contains only placeholders. Replace the placeholder publisher ID and slot IDs in `ads.js` with the publisher's own approved AdSense credentials after the site is accepted by Google. Add the matching `ads.txt` publisher record when Google provides it.

AdSense approval and earnings are controlled by Google and are not guaranteed by the codebase. The site must remain compliant with Google's current publisher policies, privacy/consent requirements and ad-placement rules.

## Production

The repository is connected to Vercel. Pushes to `main` are intended to create production deployments when the Vercel deployment limit is available.
