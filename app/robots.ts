import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // 비공개/API 경로는 수집 제외
        },
        sitemap: 'https://saramsahoe.org/sitemap.xml',
    };
}