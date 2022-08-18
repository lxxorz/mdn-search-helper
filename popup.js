// Initialize button with user's preferred color
import {search, getSearchIndex} from  "./common.js"
import {debounce} from "./tools"

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


input_query.addEventListener("input", debounce(fillSelect));
