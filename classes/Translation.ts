// Unfinished, is not used anywhere else inside of the bot.

import i18next from "https://deno.land/x/i18next@v21.9.0/index.js";
import Backend from "https://deno.land/x/i18next_fs_backend@v1.1.5/index.js";

const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;

i18next
  .use(Backend)
  .init({
    // debug: true,
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    fallbackLng: "en",
    preload: ['en', 'de'],
    backend: {
      loadPath: "locales/{{lng}}/{{ns}}.json",
    },
  });

export default (lng: string | undefined | null) =>
  i18next.getFixedT(lng || systemLocale);