// replace all escape characters
export function escapeHtml(text) {
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

export function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    if (timer)
      timer = clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}