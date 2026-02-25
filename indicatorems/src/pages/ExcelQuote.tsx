export default function ExcelQuote() {
  return (
    <iframe
      src="https://bullmquote.com/"
      title="BOM to Quote"
      className="w-full h-full border-0"
      style={{ minHeight: "calc(100vh - 4rem)" }}
      allow="clipboard-read; clipboard-write"
    />
  );
}
