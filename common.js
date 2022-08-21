import { Store } from "./store.js";
export const INDEX_KEY = "search_index";
export const __DEV__ = true;
export const debug = console.debug;
export const default_language = "zh-cn";
export const mdn_storage_key = "mdn_storage_key";
export const default_language_key = "default_language_key"

const local = new Store(chrome.storage.local);

// /**
//  *
//  * @param {string} key
//  * @param {string} url
//  */
export function fetchIndexToStorage(key, url, storage) {
  // fetch index data from mdn
  return fetch(url)
    .then(async (response) => {
      const search_index = await response.json();
      storage.setItem(key, search_index);
    }).catch(e => {
      console.log("something wrong extension ", e)
    })
}

export function filterIndex(value, search_index) {
  return search_index.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()));
}

export function search(value, search_index) {
  const options = []
  const filter_index = filterIndex(value, search_index);
  if (value.length) {
    for (const index of filter_index) {
      const select = document.createElement("div");
      const a = document.createElement("a");
      a.textContent = index.title;
      a.href = "https://developer.mozilla.org" + index.url;
      a.onclick = e => chrome.tabs.create({ active: true, url: e.target.href })
      select.appendChild(a);
      options.push(select);
    }
  }
  return options
}

function eventHandlerInContent(element, event, handler) {
  element.addEventListener(event, async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve, reject) => {
      const wrapHandler = () => {
        resolve();
        handler();
      }
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: wrapHandler,
      });
    })
  });
}