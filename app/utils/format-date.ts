import { format as tempoFormat, parse } from '@formkit/tempo';


export function formatDate(timestamp: number | string, format = 'YYYY/MM/DD HH:mm', locale = 'en-US', timestampFormat?: string) {

  if (!timestampFormat) {
    try {
      return tempoFormat(new Date(Number(timestamp)), format, locale);
    }
    catch {
      return '';
    }
  }
  else {
    try {
      return tempoFormat(
        parse(String(timestamp), timestampFormat, locale),
        format,
        locale,
      );
    }
    catch {
      return '';
    }
  }

}

export function parseDate(date: string, format: string, locale = 'en-US') {
  try {
    return parse(date, format, locale).valueOf();
  }
  catch {
    return undefined;
  }
}
