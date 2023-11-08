import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* Meta tags for PWA */}
          <meta
            name='application-name'
            content='PWA App'
          />
          {/* ... other meta tags ... */}
          <link
            rel='manifest'
            href='/manifest.json'
          />
          {/* ... other links ... */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
