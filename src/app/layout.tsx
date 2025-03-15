"use client";

import "./globals.css";
import Header from "../components/Header";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Script from "next/script";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HOST,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { fetchPolicy: "no-cache" },
    watchQuery: { fetchPolicy: "no-cache" },
  },
  headers: {
    Authorization: process.env.NEXT_PUBLIC_GRAPHQL_AUTH_HEADER || "",
    "Content-Type": "application/json",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body>
        <div id="root" className="main">
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ToastContainer />
              <div className="body_layout">
                <Header />
                {children}
              </div>
            </ThemeProvider>
          </ApolloProvider>
        </div>
        
        {/* Load Google Maps API via next/script */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
