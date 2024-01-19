import { getCanonicalFromDocument } from "./utils/getCanonical";
import { canonicalizeStream } from "./utils/messages";
import { ALWAYS_CANONICALIZE_OPTION_NAME } from "./utils/optionsSchema";

const canonicalize = () => {
  const canonical = getCanonicalFromDocument(document);
  history.replaceState({}, document.title, canonical);
};

// Canonicalize whenever the button is clicked
canonicalizeStream.subscribe(() => {
  canonicalize();
});

(async () => {
  // Every time the page loads, check if we are supposed to automatically canonicalize
  const options = await chrome.storage.sync.get([ALWAYS_CANONICALIZE_OPTION_NAME]);
  if (options[ALWAYS_CANONICALIZE_OPTION_NAME]) {
    canonicalize();
  }
})();
