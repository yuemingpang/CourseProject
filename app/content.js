document.querySelector("html").classList.add("color")
const list = document.querySelectorAll("div")

//add style to each email element:
time = ()=>{for (var i = list.length - 1; i >= 0; i--) {
	list[i].classList.add("color")
  }
}
setInterval(time, 40)

//find all emails from the current page:
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
	//implement the email search function here:

  //Add emails and other parameters, send them to popup:
	sendResponse()

})