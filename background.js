import "./common.js"
import { filterIndex, fetchIndexToStorage, default_language, __DEV__, debug, mdn_storage_key, default_language_key } from "./common.js"
import { escapeHtml } from './tools.js'
import { Store } from "./store.js"
const local = new Store(chrome.storage.local);

chrome.runtime.onInstalled.addListener(() => {
  local.setItem(default_language_key, default_language);
})

/**
 *
 * @param {string} prefix indicate data source
 * @param {string} text the item that match the user input
 * @param {string} keyword user input
 */
function suggestionFormatter(prefix, text, keyword) {
  const format_text = escapeHtml(text)
    .replace(keyword, `<dim>${keyword}</dim>`);
  return `<dim>${prefix}</dim><match>${format_text}</match>`
}

function searchMDN() {
  chrome.omnibox.onInputChanged.addListener(async (user_input, suggestion) => {
    if (!user_input)
      return;
    let { search_index } = await local.getItem(mdn_storage_key);

    if (!search_index) {
      const language = await local.getItem(default_language_key);
      fetchIndexToStorage(mdn_storage_key, `https://developer.mozilla.org/${language}/search-index.json`, local)
    }

    search_index = (await local.getItem(mdn_storage_key));

    const suggestions = filterIndex(user_input, search_index).map(item => ({
      content: "https://developer.mozilla.org" + item.url,
      description: suggestionFormatter("[MDN]", item.title, user_input)
    }))
    __DEV__ && debug("suggestions: ", suggestions)
    suggestion(suggestions);
  });
}

chrome.omnibox.onInputEntered.addListener(async (text) => {
  // if no corresponding suggestion, then show the input as search keyword and jump to mdn.
  const url_regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  let url = "";
  const language = await local.getItem(default_language_key);
  __DEV__ && debug("omnibox language", language);
  if (!url_regex.test(text)) {
    url = `https://developer.mozilla.org/${language}/search?q=${text}`;
  } else {
    url = text;
  }
  __DEV__ && debug(url);
  chrome.tabs.create({ active: true, url: url })
})

searchMDN();