import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from '../lib/i18n';

export default getRequestConfig(async () => {
    const locale = defaultLocale;
    const messages = await import(`../messages/${locale}.json`);

    return {
        locale,
        messages: messages.default
    };
});
