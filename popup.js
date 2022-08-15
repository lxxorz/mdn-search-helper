// Initialize button with user's preferred color
import {search, getSearchIndex, INDEX_KEY} from  "./common.js"
const select_suggestion = document.getElementById("select-suggestion");
const input_query = document.getElementById("query");



async function fillSelect(e) {
  const { value } = e.target;
  const {search_index} = await getSearchIndex();
  const options = search(value, search_index);
  if (options.length) {
    select_suggestion.className = "search-input-bottom"
    input_query.classList.add("search-input-top-focus")
  } else {
    select_suggestion.className = ""
    input_query.classList.remove("search-input-top-focus");
  }
  select_suggestion.replaceChildren(...options);
}

function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    if (timer)
      timer = clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  }
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


input_query.addEventListener("input", debounce(fillSelect));
