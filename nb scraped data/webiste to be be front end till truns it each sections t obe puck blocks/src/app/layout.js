import './globals.css';

export const metadata = {
  title: "Nature's Boon — Personal Care Excellence",
  description: "Nature's Boon is a trusted manufacturer and supplier of high quality personal care products. OEM, Private Label, and Contract Manufacturing since 2006.",
  keywords: 'personal care manufacturer, private label cosmetics, OEM manufacturing, Nature Boon, Ludhiana',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
