import Link from "next/link";

export default function MovieDetails({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Movie Details</h1>
      <p>Movie ID: {params.id}</p>
      <p>Movie Name: {decodeURIComponent(params.id)}</p>
      <Link href="/">← Back to Search</Link>
    </main>
  );
} 