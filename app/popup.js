document.addEventListener("DOMContentLoaded", ()=>{

  //get the search button:
	document.querySelector("button").addEventListener("click", onclick)
	//Callback:
	onclick = ()=>{
		chrome.tabs.query({currentWindow: true, active:true},
			tabs =>{
			chrome.tabs.sendMessage(tabs[0].id, "add", addEmails)
				}
			)
	}
	let clicked = false

	if (!clicked){
				clicked = true
		//Define the callback function. Append all the emails into the list:
	  addEmails = (res)=>{
		  chrome.tabs.insertCSS(null, {file : "./popup.css"})
		  if (res.emails){

				emailList = [...new Set(res.emails)];

		    for (var i = emailList.length - 1; i >= 0; i--) {
				  let div = document.createElement("div")
				  div.textContent = `Email # ${emailList.length-i} ${emailList[i]}`
				  div.classList.add("email")
				  document.body.appendChild(div)
			  }
      //Let the user know if no email was found:
	    } else {
				let div = document.createElement("div")
				div.textContent = "No email was found in current page."
				div.classList.add("email")
				document.body.appendChild(div)
			}	
    }
  }

})