# Pak Result Checker

A responsive, integration-ready Pakistan educational board result checker for 9th, 10th, 11th and 12th classes.

## Current MVP

- Province / region selector
- City / board selector with board-specific city labels
- Filterable board directory
- Class selector: 9th, 10th, 11th, 12th
- Year selector: 2018–2026
- Annual and Supplementary / 2nd Annual options
- Roll-number and student-name search modes
- Vercel serverless `/api/result` endpoint
- Frontend-to-API result search flow
- Mobile-first responsive UI
- Demo result modal with marks, grades, percentage and print action
- Vercel-ready deployment

## Important

The included record is **demo data only**. No unofficial scraping or private student database is used. Live results require an authorized official board source, licensed API, or another permitted data integration for each board.

The API endpoint is intentionally provider-ready: board validation and response normalization are separated from the UI so authorized providers can be added without redesigning the result page.

## Next build phase

1. Create a provider adapter interface for board-specific integrations.
2. Integrate Lahore Board through an authorized source/API.
3. Add result verification, error handling, caching and rate limiting.
4. Add all boards with board-specific field mappings.
5. Add old/new result archive handling.
6. Add SEO pages, sitemap and PWA support.
7. Add monitoring and production security controls.

## Run

This project uses a static frontend with a Vercel serverless API route. Pushes to the connected `main` branch automatically create a new Vercel production deployment.
