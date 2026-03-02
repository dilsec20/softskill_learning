# SpeakUp — English Communication Coach 🎤

A professional desktop PWA for CSE students to master English communication and ace job interviews.

## Features
- 🗺️ **12-Week Learning Path** — structured course from phonetics to interview mastery
- 💼 **AI Interview Simulator** — paste your CV and get personalised mock interviews
- 🎤 **Pronunciation Practice** — record yourself and score your pronunciation
- 💬 **Conversation AI** — practice real scenarios (HR, standup, client calls)
- 📚 **Vocabulary Builder** — 25 professional/CSE words with flashcards & quiz
- ⚡ **Daily Challenge** — 5-minute daily exercises with XP rewards
- 📈 **Progress Tracker** — XP, streaks, level system, achievement badges

## Tech Stack
- Pure HTML + CSS + Vanilla JavaScript (no framework, no build step)
- Gemini AI API (free tier — Gemma 3 27B + Gemini 2.5 Flash fallback)
- Web Speech API for voice recognition & text-to-speech
- Chart.js for progress charts
- PWA with service worker

## Setup
1. Clone the repo
2. Open `index.html` in Chrome (or deploy to any static host)
3. Add your [Gemini API key](https://aistudio.google.com) in Settings ⚙️

## Deploy on Render
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Static Site
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` — click **Deploy**
5. Your app is live! 🚀

## API Key (Free Tier)
Get a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey).  
The app uses **Gemma 3 27B** (14,400 req/day free) as primary model with Gemini 2.5 Flash as fallback.
