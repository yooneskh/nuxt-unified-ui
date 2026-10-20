
/* responsibility */

// Formats and parses dates
// with the app's default format and locale.


import { format as tempoFormat, parse } from '@formkit/tempo';


const fallbackFormat = 'YYYY/MM/DD HH:mm';
const fallbackLocale = 'en-US';


function getDateDefaults() {
  try {

    const appConfig = useAppConfig() as any;

    return {
      format: appConfig.dateFormat?.format ?? fallbackFormat,
      locale: appConfig.dateFormat?.locale ?? fallbackLocale,
    };

  }
  catch {
    return {
      format: fallbackFormat,
      locale: fallbackLocale,
    };
  }
}


export function formatDate(timestamp: number | string, format?: string, locale?: string, timestampFormat?: string) {

  const defaults = getDateDefaults();

  const resolvedFormat = format ?? defaults.format;
  const resolvedLocale = locale ?? defaults.locale;

  if (!timestampFormat) {
    try {
      return tempoFormat(new Date(Number(timestamp)), resolvedFormat, resolvedLocale);
    }
    catch {
      return '';
    }
  }
  else {
    try {
      return tempoFormat(
        parse(String(timestamp), timestampFormat, resolvedLocale),
        resolvedFormat,
        resolvedLocale,
      );
    }
    catch {
      return '';
    }
  }

}


export function parseDate(date: string, format: string, locale?: string) {

  const defaults = getDateDefaults();
  const resolvedLocale = locale ?? defaults.locale;

  try {
    return parse(date, format, resolvedLocale).valueOf();
  }
  catch {
    return undefined;
  }

}
