import { getCanonicalFromDocument } from "./utils/getCanonical";
import { canonicalizeStream } from "./utils/messages";
import { ALWAYS_CANONICALIZE_OPTION_NAME } from "./utils/optionsSchema";

const canonicalize = () => {
  const canonical = getCanonicalFromDocument(document);
  history.replaceState(history.state, document.title, canonical);
};

// Canonicalize whenever the button is clicked
canonicalizeStream.subscribe(() => {
  canonicalize();
});

(async () => {
  // This script runs after every page has completed loading.
  // Check if we are supposed to automatically canonicalize,
  // and do it if appropriate
  const options = await chrome.storage.sync.get([ALWAYS_CANONICALIZE_OPTION_NAME]);
  if (options[ALWAYS_CANONICALIZE_OPTION_NAME]) {
    canonicalize();
  }
})();
