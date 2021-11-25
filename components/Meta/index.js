import Head from "next/head"; // HTML head

const Meta = ({ proposal }) => (
  <Head>
    {/* Primary Meta Tags */}
    {proposal ? null : (
      // If not a proposal page, inject title
      <>
        <title>Vote | Vexchange</title>
        <meta property="og:title" content="Vote.vexchange" />
        <meta property="twitter:title" content="Vote.vexchange" />
      </>
    )}

    <meta name="title" content="Vote.vexchange" />
    <meta
      name="description"
      content="Crowd Proposals for Vexchange governance"
    />

    {/* Open Graph + Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://vote.vexchange.io" />
    <meta
      property="og:description"
      content="Crowd proposals for Vexchange governance"
    />
    <meta property="og:image" content="https://vote.vexchange.io/twitter-card.png" />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://vote.vexchange.io" />
    <meta
      property="twitter:description"
      content="Crowd proposals for Vexchange governance"
    />
    <meta
      property="twitter:image"
      content="https://vote.vexchange.io/twitter-card.png"
    />

    {/* Favicon */}
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>"></link>

    {/* Fortmatic verification */}
    <meta name="fortmatic-site-verification" content="YB1r9idOuJBbDdbk" />

    {/* Fonts (Inter) */}
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />

    {/* Google Analytics */}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-SRPJSZBHN9"
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SRPJSZBHN9');
        `,
      }}
    />
  </Head>
);

export default Meta;
