document.addEventListener("DOMContentLoaded", () => {
	//Filter email using TF ranking(See content.js onMessage)
    onUserSearch = (input) => { 
        chrome.tabs.query({ currentWindow: true, active: true},
            tabs => {
                chrome.tabs.sendMessage(tabs[0].id, input, addEmails)
            }
        ) 
    }   
  
	//Callback for updating UI with search results. 
	addEmails = (res) => {  
		if (res && res.emails && res.emails.length > 0){
			document.getElementById("noEmail").style.display = "none"; 
			document.getElementById("tableDiv").style.display = "block";  

			var tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0]; 
			tbodyRef.innerHTML = ""; 

			for(var i = 0; i < res.emails.length; i++){  
				var newRow = tbodyRef.insertRow();  
				var infoTextCell = newRow.insertCell(0);  
				var openTextCell = newRow.insertCell(1);  
                
				openTextCell.className = "openEmailCell";  
				infoTextCell.className = "infoCell";

				var title = document.createElement("b");
				title.innerHTML = res.emailPurpose[i]; 
 
				infoTextCell.appendChild(getImage("./title.png")); 
				infoTextCell.appendChild(title);
				infoTextCell.appendChild(document.createElement("br"));
				infoTextCell.appendChild(getImage("./obj128x128.png")); 
				infoTextCell.appendChild(document.createTextNode(res.emails[i]));
				openTextCell.appendChild(createButton(res.emails[i]));  
			}  
		}
		else{
			document.getElementById("noEmail").style.display = "block";  
			document.getElementById("tableDiv").style.display = "none";    
		}  
	} 

	createButton = (email) => { 
		var button = document.createElement("button");
		button.className = "btn btn-outline-info btn-sm button-align";

		button.addEventListener('click', function(e){  
		    window.location.href = "mailto:"+email;  
		});  
		 
		button.appendChild(getImage("./pop.png"));
		return  button;  
	}
 
	document.getElementsByName("inTxt")[0].addEventListener('keyup', function(e){ 
		onUserSearch(this.value);
    }); 

	getImage = (url) => {
		const img = document.createElement("IMG"); 
		img["src"] = url;
		return  img;  
	}
	
	onUserSearch("");
})

 