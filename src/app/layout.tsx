"use client";

import "./globals.css";
import Header from "../components/Header";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import CssBaseline from "@mui/material/CssBaseline";




const GRAPHQL_AUTH_HEADER = process.env.NEXT_PUBLIC_GRAPHQL_AUTH_HEADER ?? "";
const GRAPHQL_HOST = process.env.NEXT_PUBLIC_GRAPHQL_HOST ?? "";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("GRAPHQL_AUTH_HEADER:", GRAPHQL_AUTH_HEADER);
  console.log("GRAPHQL_HOST:", GRAPHQL_HOST);
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      watchQuery: { fetchPolicy: "no-cache" },
    },
    headers: {
      Authorization: GRAPHQL_AUTH_HEADER,
      "Content-Type": "application/json",
    },
    uri: GRAPHQL_HOST,
  });
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CLIQ (Preview)" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
        <title>Share Event</title>
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDD6O57Fgp1fmHJmb8aHmUDEMiM795Aoc4&libraries=places"
          async
        ></script>
      </head>
      <body>
        <div id="root" className="main">
          <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
          <CssBaseline />
            <div className="body_layout">
            <Header></Header>
            {children}
            </div>
            </ThemeProvider>
          </ApolloProvider>
          
        </div>
      </body>
    </html>
  );
}
