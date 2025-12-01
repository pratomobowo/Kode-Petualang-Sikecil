<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Kode Petualang Cilik 🚀

Aplikasi pembelajaran coding interaktif untuk anak-anak. Belajar berpikir kritis sambil bermain!

View your app in AI Studio: https://ai.studio/apps/drive/10tceSpGRPJoC2mA-Byfn3d0EKkaZ3JV0

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `VITE_GEMINI_API_KEY` in `.env.local`:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Gemini API key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🚢 Deploy to Coolify (Nixpacks)

This project is ready to deploy to Coolify with Nixpacks!

### Steps:

1. **Push your code to GitHub** (already done ✅)

2. **In Coolify Dashboard:**
   - Create a new application
   - Select "GitHub" as source
   - Choose this repository
   - Select "Nixpacks" as build pack
   - Set environment variable:
     - `VITE_GEMINI_API_KEY` = your Gemini API key

3. **Deploy!** 🎉

### Configuration:

- Build command: `npm run build` (auto-detected)
- Start command: `npm start` (auto-detected)
- Port: 3000 (configurable via `PORT` env var)
- Node version: 20 (configured in `.nixpacks.toml`)

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite 6
- **AI:** Google Gemini API
- **Icons:** Lucide React

## 📝 License

Private project for educational purposes.

