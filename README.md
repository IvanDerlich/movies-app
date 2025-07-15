# Movie Browser App

This is a [Next.js](https://nextjs.org) project that lets you search and browse movies using the OMDB API. It demonstrates modern React patterns, server-side API integration, caching, and clean UI/UX.

## Getting Started

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Create a file called `.env.local` in the root of the project.
   - Add your OMDB API key:
     ```env
     OMDB_API_KEY=your_omdb_api_key_here
     ```
   - You can get a free OMDB API key at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the app:**
   - Go to [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

- **Search:** Enter a movie title and click "Search". The app fetches results from the OMDB API via a secure Next.js API route.
- **Filtering:** Use the dropdown to filter results by Movies, Series, or both.
- **Details:** Click a movie title to see detailed information. The details page fetches full info from OMDB using a secure backend route.
- **Caching:**
  - The backend caches OMDB responses for 1 hour to reduce API calls and improve speed.
  - The browser and any CDN will also cache responses for 1 hour, serving stale data while revalidating in the background for up to 24 hours.
- **Error Handling:**
  - User-friendly messages are shown for network errors, OMDB errors, or empty results.
- **Security:**
  - The OMDB API key is never exposed to the client; all requests go through the Next.js backend.

---

## Tech Stack
- Next.js 15 (App Router)
- React Context for state management
- OMDB API integration
- Modern caching strategies

---

## License
MIT
