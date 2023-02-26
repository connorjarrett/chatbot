var messageHistory = []

function escapeHtml(unsafe) {
    unsafe = unsafe.replaceAll("<br>","%LINEBREAK%")

    let safe =  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
    
    safe = safe.replaceAll("%LINEBREAK%","<br>")
    
    return safe
 }

function send(message,from) {
    // message = escapeHtml(message)
    message = `<p>${message}</p>`

    if (from != "user" && from != "bot") {
        console.error("Invalid Sender, only 'user' or 'bot' is accepted")
        return false
    }

    messageHistory.push({"from":from,"message":message})

    let bubble = document.createElement("span")
    bubble.classList = "bubble"
    bubble.dataset.sender = from
    bubble.innerHTML = message

    $(".messages-container")[0].appendChild(bubble)
    $(".messages-container").scrollTop($(".messages-container")[0].scrollHeight)

    let button = $(".submit")[0]
    if (!hasBotGone()) {
        button.classList.add("unavailable")
    } else {
        button.classList.remove("unavailable")
    }
}

function askReply(question) {
    // Add typing bubble
    let bubble = document.createElement("span")
    bubble.classList = "bubble typing"
    bubble.dataset.sender = "bot"
    $(".messages-container")[0].appendChild(bubble)
    $(".messages-container").scrollTop($(".messages-container")[0].scrollHeight)

    var reply = "this is a reply to that"
    console.log(`Asking reply for '${question}'`)

    // Process Response
    reply = process(question)


    // Remove  typing bubble
    setTimeout(function(){
        bubble.remove()
        send(reply, "bot")
    },15*Math.min(Math.max(question.length, 150), 2500))
}

function hasBotGone() {
    var hasBotGone = true

    $(".messages-container .bubble:not(.typing)").each(function(index){
        if (index == $(".messages-container .bubble:not(.typing)").length - 1) {
            let sender = ($(this)[0].dataset.sender)
            
            if (sender == "user") {
                hasBotGone = false
            }
        }
    })

    return hasBotGone
}

$("form").submit(function(e){
    e.preventDefault();

    let data = $("form").serializeArray()
    let message = data[0]["value"]


    if (!message || !hasBotGone()) {
        return false
    }

    $("#message-box")[0].value = ""
    send(message,"user")
    askReply(message)
})