
import React, { useEffect } from 'react';
import { useTranslation } from '../i18n/I18nContext';

export const SEOHead: React.FC = () => {
  const { t, language } = useTranslation();

  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = language;

    // Update Title
    document.title = t('seo.title');

    // Helper to update meta tags safely
    const setMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        // If it doesn't exist, create it (simplified handling for common types)
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
           element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        } else if (selector.startsWith('meta[property=')) {
           element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Meta Description
    setMeta('meta[name="description"]', t('seo.description'));
    setMeta('meta[property="og:description"]', t('seo.description'));
    setMeta('meta[property="twitter:description"]', t('seo.description'));

    // Update Keywords
    setMeta('meta[name="keywords"]', t('seo.keywords'));

    // Update OG Title
    setMeta('meta[property="og:title"]', t('seo.title'));
    setMeta('meta[property="twitter:title"]', t('seo.title'));

    // Update Locale
    let localeStr = 'en_US';
    if (language === 'es') localeStr = 'es_ES';
    if (language === 'pt') localeStr = 'pt_BR';
    if (language === 'ja') localeStr = 'ja_JP';
    setMeta('meta[property="og:locale"]', localeStr);

  }, [language, t]);

  return null;
};
