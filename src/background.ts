import { sendCanonicalize } from "./utils/messages";

chrome.action.onClicked.addListener((tab) => {
  sendCanonicalize(undefined, { tabId: tab.id });
});
