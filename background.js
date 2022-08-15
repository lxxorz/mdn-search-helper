import {getSearchIndex, filterIndex} from "./common.js"
import {escapeHtml} from './tools.js'
const __DEV__ = true;
const default_language = "zh-cn";
chrome.storage.local.set({language: default_language});

fetch(`/public/search-index/${default_language}.json`).then(async(response) => {
  const search_index = await response.json();
  __DEV__ && console.log("search_index", search_index)
  chrome.storage.local.set({search_index})
}).catch(e => {
  console.log("something wrong extension ", e)
})


chrome.omnibox.onInputChanged.addListener(async (user_input, suggestion) => {
  const {search_index} = await getSearchIndex();
  const suggestions = filterIndex(user_input, search_index).map(item => ({
    content: "https://developer.mozilla.org"+item.url,
    description: `<match>${escapeHtml(item.title)}</match>`
  }))
  suggestion(suggestions);
});


chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  chrome.tabs.create({active: true, url: text})
})
