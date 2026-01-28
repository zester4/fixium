import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogType?: string;
    ogImage?: string;
    twitterHandle?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    ogType = 'website',
    ogImage = '/images/hero-3d.png',
    twitterHandle = '@Fixium',
}) => {
    const siteTitle = 'Fixium — Device Repair Companion';
    const fullTitle = title ? `${title} | Fixium` : siteTitle;
    const siteDescription = description || 'AI-powered device repair guidance. Take a photo, get expert step-by-step instructions for fixing consumer electronics.';
    const siteUrl = window.location.origin;
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : `${siteUrl}${window.location.pathname}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={siteDescription} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
            <meta name="twitter:site" content={twitterHandle} />
        </Helmet>
    );
};
