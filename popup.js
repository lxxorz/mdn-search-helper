// Initialize button with user's preferred color
import { fetchIndexToStorage, debug, __DEV__, mdn_storage_key, default_language_key } from "./common.js"
import { Store } from "./store.js";

const local = new Store(chrome.storage.local);

const select_language = document.getElementById("select-language");

async function  initLanguage() {
  const language = await local.getItem(default_language_key);
  const current_language = select_language.value
  debug(language, current_language)
  if(language && language !== current_language) {
    select_language.value = language;
  }
}

initLanguage();

select_language.addEventListener("input",async(e) => {
  const language = e.target.value;
  await local.setItem(default_language_key, language);
  __DEV__ && debug("change language", language);
  e.target.value = language;
  await fetchIndexToStorage(mdn_storage_key, `https://developer.mozilla.org/${language}/search-index.json`, local)
  const result = await local.getItem(mdn_storage_key)
  debug("result", result)
})