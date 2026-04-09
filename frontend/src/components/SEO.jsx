import { Helmet } from 'react-helmet-async'

const SEO = ({ title, description, keywords, url, image, type = 'website' }) => {
    const defaultTitle = "Jobmate — Nepal's Verified Job Portal"
    const defaultDesc = "Find verified jobs in Nawalparasi, Parasi, Butwal, Lumbini Pradesh & across Nepal. Real salaries, verified employers, AI-powered matching."
    const defaultImage = "https://jobmate-two.vercel.app/og-image.png"
    const baseUrl = "https://jobmate-two.vercel.app"

    const fullTitle = title ? `${title} | Jobmate Nepal` : defaultTitle
    const finalDesc = description || defaultDesc
    const finalImage = image || defaultImage
    const finalUrl = url ? `${baseUrl}${url}` : baseUrl

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDesc} />
            <meta name="twitter:image" content={finalImage} />
        </Helmet>
    )
}

export default SEO
