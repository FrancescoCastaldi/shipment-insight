# Shipment Insight 📦

> A lightweight, client-side shipment tracking dashboard for GLS parcels. Built with Next.js, deployed on GitHub Pages.

![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue)
![Next.js](https://img.shields.io/badge/built%20with-Next.js%2015-black)

## ✨ Features

- **Shipment Dashboard** — View all your GLS shipments in a clean table layout
- **Add & Track** — Add new shipments with tracking numbers and courier info  
- **One-Click Tracking** — Open the courier's tracking page directly from the dashboard
- **Support Ticket Reference** — Quick access to your GLS ServiceNow ticket
- **Email Assistant** — Pre-formatted email templates for requesting shipment updates
- **Local-First** — All data stored in your browser's localStorage (no server needed)

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/FrancescoCastaldi/shipment-insight.git
cd shipment-insight

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.

**Live:** [https://francescocastaldi.github.io/shipment-insight/](https://francescocastaldi.github.io/shipment-insight/)

### Build for static export

```bash
npm run build
```

The static files are generated in the `out/` directory.

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | Pure CSS |
| Storage | Browser localStorage |
| Deployment | GitHub Pages + Actions |

## 📁 Project Structure

```
├── app/
│   ├── components/       # React components
│   │   ├── Dashboard.tsx     # Main dashboard layout
│   │   ├── StatsCards.tsx    # Summary statistics
│   │   ├── SpedizioniList.tsx # Shipment list (mobile)
│   │   ├── SpedizioneCard.tsx # Individual shipment card
│   │   ├── AddForm.tsx       # New shipment form (modal)
│   │   ├── EmailPanel.tsx    # Email composition panel
│   │   └── TicketRef.tsx     # Support ticket reference
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Entry page
├── lib/
│   └── storage.ts            # LocalStorage data layer
├── public/                   # Static assets
├── .github/workflows/        # CI/CD
└── README.md
```

## 📄 License

MIT © Francesco Castaldi
