import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = 'Hytor - Hybrid Tutor Marketplace',
    description = 'Find the best home and online tutors for your children.',
    keywords = 'tutor, tutoring, private tutor, online tutor, home tutor, education, learning, Hytor',
    image = 'https://hytormarket.com/logo.jpeg',
    url = 'https://projectdsplay.pythonanywhere.com/',
    type = 'website',
}) => {
    const siteName = 'Hytor';
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const fallbackImage = 'https://projectdsplay.pythonanywhere.com/static/logo.jpeg';
    const metaImage = image || fallbackImage;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta itemprop="image" content={metaImage} />

            {/* Open Graph / Facebook / Telegram */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Hytor" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={metaImage} />

            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;
