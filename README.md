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
- Reserved ad placements with optional Google AdSense configuration
- SEO metadata, Open Graph tags, canonical URL, robots.txt and sitemap.xml
- PWA manifest
- Privacy and result-disclaimer pages
- Mobile-first responsive UI

## Real-result policy

The site does **not** fabricate student marks. A result is labelled **OFFICIAL BOARD RESULT** only when an authorized provider returns the record. Many official board portals use CAPTCHA, session tokens or other verification, so this project does not bypass those protections.

When an automated provider is not configured, the user gets a direct **Official Result Portal** button for the selected board. This makes every listed board accessible without pretending that a private/unofficial database is an official API.

## Provider architecture

`User Search → /api/result → Board Provider → Normalize → Professional Result Card`

Authorized providers can be added board-by-board without changing the frontend result-card design.

## Advertising

Ad containers are present but disabled by default. To enable Google AdSense, use the site's own approved publisher ID and ad-slot IDs in `ads.js` and set `enabled: true`. Never use another publisher's credentials or fake ad units.

## Production

The repository is connected to Vercel. Pushes to `main` are intended to create production deployments when the Vercel deployment limit is available.
