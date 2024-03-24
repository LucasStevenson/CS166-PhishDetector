chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    if (!tabs || tabs.length === 0) {
        console.error("No active tab found.");
        return;
    }
    let url = tabs[0].url;
    // Show error message if the currently open URL is not an email URL
    let errMsgTag = document.getElementById("emailNotOpenErr");
    if (!url.match(/^https:\/\/mail\.google\.com\/mail\/u\/.*\/#inbox\/.*/)) {
        errMsgTag.innerText = "You need to have an email open in your browser";
        return;
    }
    // Clear the error message if it exists
    errMsgTag.innerText = "";
    // Get and parse email raw html
    const emailHTML = await getEmailPageRawHTML();
    let subjectLine = emailHTML.querySelector(".hP").innerText.trim();
    let emailSender = emailHTML.querySelector(".go").innerText.trim().slice(1, -1);
    let emailBody = emailHTML.querySelector(".a3s.aiL").innerText.trim();
    document.getElementById("subjectLine").innerText = subjectLine;
    document.getElementById("sender").innerText = emailSender;
    document.getElementById("emailBody").innerText = emailBody;
});


async function getEmailPageRawHTML() {
    let results = await chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
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
