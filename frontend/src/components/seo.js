import React from "react";
import { Helmet } from "react-helmet-async";

// Single place that renders everything inside <head> (Practical 18, Steps 4-6).
// Every page passes its own title / description, so the tags are dynamic.

export const SITE_NAME = "Todo App";
export const SITE_URL =
  process.env.REACT_APP_SITE_URL || "https://venerable-entremet-f4ed6f.netlify.app";
export const DEFAULT_DESCRIPTION =
  "A full-stack todo list built with Django REST Framework and React: " +
  "sign up, add tasks, mark them complete and keep everything in sync.";

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/logo512.png",
  type = "website",
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Django + React`;
  const canonical = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Steps 4-5: title, description, robots, canonical */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Step 6: Open Graph (Facebook, LinkedIn, ...) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      {/* Step 6: Twitter / X card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default Seo;
