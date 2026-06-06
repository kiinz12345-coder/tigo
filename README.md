# Random Video Chat Platform

Monetized Omegle-style platform with credits, daily tickets, admin panel, and Stripe payments.

## Deployment on Render
1. Create PostgreSQL database on Render named `random_chat_db`
2. Deploy web service (this repo) with build command: `npm install && npx prisma generate && npm run build`
3. Set environment variables (see .env.example)
4. Deploy Socket.IO server (separate service) from `server/` folder

## Features
- Gender-based matching (MALE pays, FEMALE earns)
- 2 free tickets daily
- 20 seconds free per call, then 3 credits/min for males
- Admin panel to view users & credits
- Google/Facebook login
- Stripe payments & payouts
