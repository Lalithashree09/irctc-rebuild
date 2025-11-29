# IRCTC Rebuild - Next-Gen Rail Travel Platform

A modern, full-stack rebuild of the Indian Railways booking platform, featuring a futuristic "Cyberpunk Rail" aesthetic, real-time search, and comprehensive station/train data.

![Project Preview](public/preview.png) *Add a screenshot here if available*

## 🚀 Features

*   **Futuristic UI/UX**: Glassmorphism, animated backgrounds, and smooth transitions using Framer Motion.
*   **Comprehensive Search**:
    *   **All India Stations**: Database of ~9,000 stations covering all 28 states.
    *   **Smart Autocomplete**: Search by Station Name or Code (e.g., "NDLS", "KSR Bengaluru").
    *   **Train Search**: Find trains by Name or Number.
*   **Booking Flow**:
    *   Real-time availability check (simulated).
    *   Passenger details form.
    *   PNR Generation and Booking Confirmation.
*   **User Dashboard**: View booking history and status.
*   **Admin Dashboard**: Manage trains, view bookings, and monitor revenue.
*   **Tech Stack**:
    *   **Framework**: Next.js 14 (App Router)
    *   **Language**: TypeScript
    *   **Styling**: CSS Modules (Custom Design System, No Tailwind)
    *   **Database**: SQLite (with Prisma ORM)
    *   **Auth**: NextAuth.js

## 🛠️ Getting Started

### Prerequisites

*   Node.js 18+
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/irctc-rebuild.git
    cd irctc-rebuild
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret-key-here"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Initialize Database**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Seed Database** (Optional but recommended for initial data)
    ```bash
    npx prisma db seed
    ```
    *Note: The application also uses JSON datasets in `src/data/` for search performance.*

6.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

*   `src/app`: Next.js App Router pages and API routes.
*   `src/components`: Reusable UI components (Hero, Navbar, Autocomplete, etc.).
*   `src/lib`: Utility functions and Prisma client instance.
*   `src/data`: JSON datasets for Stations and Trains.
*   `prisma`: Database schema and seed scripts.
*   `scripts`: Node.js scripts for data transformation.

## 🚄 Data Sources

*   **Stations**: Comprehensive list of Indian Railway stations sourced from open datasets.
*   **Trains**: Extensive list of trains running across India.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
