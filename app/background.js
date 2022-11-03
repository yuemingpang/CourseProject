window.emailsList = {}

//save the email list in background:
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
window.emailsList[request.url] = request.emails
})

//show the popup of the extension:
chrome.browserAction.onClicked.addListener(tabs=>{
	chrome.tabs.create({url:"popup.html"})
})