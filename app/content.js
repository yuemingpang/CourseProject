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
	const regularExpression = new RegExp('[a-zA-Z0-9+_.-]{3,20}@[a-zA-Z0-9]{3,20}\.[a-z]{2,3}', 'g')
	const match = document.documentElement.innerHTML.match(regularExpression)
	const content = document.body.style.backgroundColor

  //Add emails and other parameters, send them to popup:
	sendResponse({emails: match,
	    color : content
	})

    emails : match
})