import {getSearchIndex, filterIndex} from "./common.js"
import {escapeHtml} from './tools.js'
import {Store} from "./store.js"
const local = new Store(chrome.storage.local);

const __DEV__ = true;
const debug = console.debug;
const default_language = "zh-cn";

local.setItem({language: default_language});


fetch(`/public/search-index/${default_language}.json`)
  .then(async(response) => {
    const search_index = await response.json();
    __DEV__ && debug("search_index", search_index)
    local.setItem({search_index})
  }).catch(e => {
    console.log("something wrong extension ", e)
  })

function searchMDN() {
  chrome.omnibox.onInputChanged.addListener(async (user_input, suggestion) => {
    const {search_index} = await getSearchIndex();
    const suggestions = filterIndex(user_input, search_index).map(item => ({
      content: "https://developer.mozilla.org"+item.url,
      description: `<match><dim>[MDN]</dim> ${escapeHtml(item.title)}</match>`
    }))
    suggestion(suggestions);
  });
}

chrome.omnibox.onInputEntered.addListener(async (text) => {
    // if no corresponding suggestion, then show the input as search keyword and jump to mdn.
    const url_regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    let url = "";

    if (!url_regex.test(text)) {
      url = `https://developer.mozilla.org/${default_language}/search?q=${text}`;
    }
    __DEV__ &&  debug(url);
    chrome.tabs.create({active: true, url: url})
})

searchMDN();
