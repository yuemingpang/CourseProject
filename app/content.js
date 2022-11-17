var previousElement = null;
var emails = [];
var emailPurpose = [];

//Haddle email search events from popup.js
chrome.runtime.onMessage.addListener((query, sender, sendResponse) => { 
	//Clear search results
	if(query  == ""){   
		if(emails != null && emails.length == 0){
			getEmailFromHtml();     
		}
		sendResponse({ emails: emails, emailPurpose: emailPurpose }) 
	}  
	else 
	{ 
		//Rank results and return response to popup.js for rendering. 
		let score = scoreSearch(query);
		let sortScore = sortObject(score);
		let tempEmail = [];
		let tempPurpose = [];

		for (const element of sortScore) {
			let index = element[0];
			tempEmail.push(emails[index]);
			tempPurpose.push(emailPurpose[index]); 
		} 
		sendResponse({emails: tempEmail, emailPurpose: tempPurpose}) 
	}   
}) 

//Search HTML for emails
function getEmailFromHtml() { 
	var allElements = document.querySelectorAll("*");
    for (let i = 0; i < allElements.length - 1; i++) {
        var element = allElements[i];
        const matchedEmails = element.innerHTML.match(/^\S+@\S+\.\S+$/);

        if (matchedEmails != null) {
			var email = matchedEmails[0].replace(/<\/?[^>]+(>|$)/g, "");
            emails.push(email);
            emailPurpose.push(getEmailPurpose(i, allElements, email));
        }
    }
}

// Extract email purpose
function getEmailPurpose(curr, arr, currEmail) {
    for (let i = curr; i >= 0; i--) {
        var strValue = arr[i].textContent;
        if (strValue == "") {
            continue;
        }
        if (strValue.match(/\d+/g)) {
            continue;
        }
        if (strValue.match(/\S+@\S+\.\S+$/)) {
            //Check if purpose is inline with email
            var parentText = arr[i].parentNode.textContent;
            if (parentText.includes(currEmail)) {
                const parentParts = parentText.split(/\r?\n/);
                for (let j = 0; j < parentParts.length - 1; j++) {
                    if (parentParts[j].includes(currEmail)) {
                        let emailParts = parentParts[j].split(currEmail);
                        if (emailParts != null && emailParts[0]) {
                            let prefix = emailParts[0];
                            return clean(prefix, currEmail);
                        }
                    }
                }
            }
            continue;
        }
        return (clean(strValue, currEmail));
    }
}

//Sanitize string.
function clean(txt, email) {
    txt = txt.replace(/\s+/g, ' ');
    txt = txt.replace(email, '');
	txt = txt.replace(/<\/?[^>]+(>|$)/g, "");
    return txt.replace(/[^a-z0-9 ]/gi, '').trim();
}

//TF Ranking 
function scoreSearch(query) { 

    var qLen = query.split(" ");
    var score = {};

    //Create score index with all zeros;
    for (let j = 0; j < emails.length; j++) {
        score[j] = 0;
    }

    //Calculate TF
    for (let i = 0; i < qLen.length; i++) {
        for (let j = 0; j < emails.length; j++) {
            let emailWithName = emails[j] + " " + emailPurpose[j];
            emailWithName = emailWithName.trim().toLowerCase();
            let queryTerm = qLen[i].trim().toLowerCase();

            if (emailWithName.includes(queryTerm)) {
                score[j] = score[j] + 1;
            }
        }
    }
    return score;
}
 
//Sort Ranking
function sortObject(objs) {
    let sortable = [];

    for (var score in objs) { 
		if(objs[score] > 0){
			sortable.push([score, objs[score]]);
		} 
    }

    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    return sortable;
}