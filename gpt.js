document.getElementById("checkButton").addEventListener("click", handleSubmit);

async function handleSubmit() {
    const title = document.getElementById("subjectLine").innerText;
    const sender = document.getElementById("sender").innerText;
    const body = document.getElementById("emailBody").innerText;
    //   contents.preventDefault();

    // Send a request to the server with the prompt
    const endpointUrl_Turbo = "https://api.openai.com/v1/chat/completions";
    const apiKey = window.config.OPENAI_API_KEY;
    let prompt = "I need you to rate this email is suspicious of phishing or not.\n" +
        "0 to be the least suspicious and 100 to be the most suspicious.\n" +
        "I'm going to give you the sender email, subject, and content of email.\n" +
        "Please return your response in this format:\n" +
        "'Suspicious percentage: number\n" +
        "Reason: string'\n" +
        "Ok here is the email\n" +
        "Sender email: " + `${sender}` + ".\n" +
        "Subject email: " + `${title}` + ".\n" +
        "Content email: " + `${body}` + ".\n";


    await fetch(endpointUrl_Turbo, {
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt,
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