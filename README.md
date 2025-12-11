# Sentiment Core Service - Management Interface

Management interface untuk Sentiment Core Service API menggunakan Next.js.

## Fitur

- ✅ Dashboard dengan overview status service
- ✅ Health Check monitoring
- ✅ POC Endpoints:
  - Analyze Sentiment
  - Statistics dengan filtering
  - Posts List dengan pagination
- ✅ Production Endpoints:
  - Single Analyze
  - Batch Analyze (max 32 items)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:9014
```

### 3. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Project

```
sentimen-core-fe/
├── app/
│   ├── layout.tsx          # Root layout dengan navigation
│   ├── page.tsx             # Dashboard
│   ├── health/
│   │   └── page.tsx         # Health check page
│   ├── poc/
│   │   └── page.tsx         # POC endpoints page
│   └── production/
│       └── page.tsx         # Production endpoints page
├── components/
│   ├── POCAnalyze.tsx       # POC analyze component
│   ├── POCStatistics.tsx    # POC statistics component
│   ├── POCPosts.tsx         # POC posts list component
│   ├── ProductionAnalyze.tsx # Production analyze component
│   └── BatchAnalyze.tsx     # Batch analyze component
└── lib/
    └── api.ts               # API client dan types
```

## Pages

### Dashboard (`/`)
- Overview status service
- Quick access ke semua endpoints
- Health status summary

### Health Check (`/health`)
- Root endpoint status
- Health check endpoint dengan details
- Dependencies status (database, redis, model)

### POC (`/poc`)
- **Analyze Tab**: Real-time sentiment analysis
- **Statistics Tab**: Aggregated statistics dengan filtering
- **Posts Tab**: List analyzed posts dengan pagination

### Production (`/production`)
- **Single Analyze Tab**: Single content analysis
- **Batch Analyze Tab**: Batch analysis (max 32 items)

## API Configuration

Default API base URL: `http://localhost:9014`

Ubah di `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://your-api-url:9014
```

## Build untuk Production

```bash
npm run build
npm start
```

## Notes

- Tidak ada autentikasi (sesuai requirement)
- Semua endpoints menggunakan API client di `lib/api.ts`
- UI menggunakan Tailwind CSS
- TypeScript untuk type safety

