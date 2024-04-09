document.getElementById("checkButton").addEventListener("click", handleSubmit);

async function handleSubmit() {
    const title = document.getElementById("subjectLine").innerText;
    const sender = document.getElementById("sender").innerText;
    const body = document.getElementById("emailBody").innerText;
    //   contents.preventDefault();

    // Send a request to the server with the prompt
    const endpointUrl_Turbo = "https://api.openai.com/v1/chat/completions";
    var apiKey = "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";

    await fetch(endpointUrl_Turbo, {
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Check the email is phishing:\nTitle: ${title}\nSender:${sender}\nEmail Body:${body}`,
                },
            ],
            temperature: 1,
        }),
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + apiKey,
        },
    }).then((response) => {
        if (response.ok) {
            response.json().then((json) => {
                document.getElementById("subjectLine").innerText = "Result";
                document.getElementById("sender").innerText = "";
                document.getElementById("emailBody").innerText =
                    json["choices"][0]["message"]["content"];
                document.getElementById('checkButton').style.display = 'none';
            });
        }
    });
}