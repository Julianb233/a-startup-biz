/**
 * Next.js Sitemap Generator
 * Generates dynamic sitemap.xml for SEO
 */

import type { MetadataRoute } from 'next';
import { getAllRoutes } from '@/lib/site-config/routes';
import { PageCategory } from '@/lib/site-config/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://astartupbiz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const allRoutes = getAllRoutes();

  // Filter out admin and auth routes from public sitemap
  const publicRoutes = allRoutes.filter(
    (route) =>
      route.category !== PageCategory.ADMIN &&
      route.category !== PageCategory.AUTH &&
      !route.requiresAuth
  );

  // Map routes to sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return sitemapEntries;
}
