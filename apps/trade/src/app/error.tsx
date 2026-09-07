"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="fatal"><h1>Market terminal unavailable</h1><p>Your order was not submitted. Try loading the read-only view again.</p><button onClick={reset}>Retry</button></main>;
}
