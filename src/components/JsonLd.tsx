/** Renders a JSON-LD structured data script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (our own data, not user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
