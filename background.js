import {getSearchIndex, filterIndex} from "./common.js"
let color = '#3aa757';
const language = "zh-cn";
const __DEV__ = true;
chrome.storage.local.set({language});
fetch(`/public/search-index/${language}.json`).then(async(response) => {
  const search_index = await response.json();
  __DEV__ && console.log("search_index", search_index)
  chrome.storage.local.set({search_index})
}).catch(e => {
  console.log("something wrong extension ", e)
})



chrome.omnibox.onInputChanged.addListener(async (value, suggestion) => {
  const {search_index} = await getSearchIndex();
  const suggestions = filterIndex(value, search_index).map(item => ({
    content: item.url,
    description: `<match>test</match>`
  }))
  suggestion(suggestions);
});