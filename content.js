chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    if (!tabs || tabs.length === 0) {
        console.error("No active tab found.");
        return;
    }
    let url = tabs[0].url;
    // Show error message if the currently open URL is not an email URL
    let errMsgTag = document.getElementById("emailNotOpenErr");
    if (!url.match(/^https:\/\/mail\.google\.com\/mail\/u\/\d+\/(\?.+)?#.+(\/.*)?\/.{32}/)) {
        errMsgTag.innerText = "You need to have an email open in your browser";
        document.getElementById("emailBody").style.backgroundColor = 'white';
        document.getElementById("emailContentDiv").style.maxHeight = 0;
        document.getElementById("checkButton").style.visibility = 'hidden';
        return;
    }
    // Clear the error message if it exists
    errMsgTag.innerText = "";
    // Get and parse email raw html
    const emailHTML = await getEmailPageRawHTML();
    let { subjectLine, emailSender, emailBody } = getEmailContents(emailHTML);
    // displays the email contents on the extension ui
    document.getElementById("subjectLine").innerText = "Subject: " + subjectLine;
    document.getElementById("sender").innerText = "From: " + emailSender;
    document.getElementById("emailBody").innerText = emailBody;
});


async function getEmailPageRawHTML() {
    let results = await chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
        let activeTabId = tabs[0].id;
        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: _DOMtoString,
        });
    });
    let el = document.createElement("html");
    el.innerHTML = results[0].result;
    return el;
}

function _DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
}

// Gets the subject line, email sender, and email body
function getEmailContents(emailHTML) {
    let subjectLine = emailHTML.querySelector(".hP").innerText.trim();
    let emailSender = emailHTML.querySelector("span[email].gD").getAttribute("email").trim();
    let emailBody = emailHTML.querySelector(".a3s.aiL").innerText.trim();
    return { subjectLine, emailSender, emailBody };
}
