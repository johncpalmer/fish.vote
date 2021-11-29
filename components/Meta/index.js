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
