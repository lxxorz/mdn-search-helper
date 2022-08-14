export const INDEX_KEY = "search_index";

export function filterIndex(value, search_index) {
  return search_index.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()));
}

export function search(value, search_index){
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

export function getItem(key) {
    return new Promise(resolve => {
      chrome.storage.local.get(key, (result) => {
        console.log(result)
        resolve(result);
      })
    })
}

export function getSearchIndex() {
  return getItem(INDEX_KEY);
}
