var messageHistory = []

function escapeHtml(unsafe) {  
    let safe =  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#039;");
    
    return safe
 }

function send(message,from, manualscale) {
    // message = escapeHtml(message)
    message = `<div>${message}</div>`

    if (from != "user" && from != "bot") {
        console.error("Invalid Sender, only 'user' or 'bot' is accepted")
        return false
    }

    messageHistory.push({"from":from,"message":message})

    let bubble = document.createElement("span")
    bubble.classList = "bubble"
    bubble.dataset.sender = from
    bubble.style.scale = 0

    if (manualscale) {
        bubble.style.display = "none"
    }

    bubble.innerHTML = message

    $(".messages-container")[0].appendChild(bubble)
    $(".messages-container").scrollTop($(".messages-container")[0].scrollHeight)

    let button = $(".submit")[0]
    if (!hasBotGone()) {
        button.classList.add("unavailable")
    } else {
        button.classList.remove("unavailable")
    }

    // Scale to full size
    if (!manualscale) {
        bubble.style.scale = ""
    }

    return bubble
}

function buildReply(replyObject, hideInsights) {
    var reply = ""
    
    console.log(replyObject)

    if (replyObject.text) {
        reply += `<span class="main">${replyObject.text}</span>`
    }

    if (replyObject.image) {
        reply += `<img src="${replyObject.image}" alt="${replyObject.imageAlt}" onclick="enlarge('${replyObject.image}')">`
    } else if (replyObject.web) {
        reply += `<iframe src="${replyObject.web}" ${replyObject.web.startsWith("https://www.youtube.com/embed") ? "style='aspect-ratio: 16/9'" : ""}></iframe>`
    } else if (replyObject.video) {
        reply += `<video controls playsinline ${replyObject.videoThumbnail ? `poster="${replyObject.videoThumbnail}"` : ""}><source src="${replyObject.video}" type="video/mp4"></video>`
    }

    if (replyObject.audio) {
        reply += `<audio controls><source src="${replyObject.audio}" type="audio/mpeg"></audio>`
    }
    
    if (replyObject.otherLinks.length > 0) {
        reply += '<details class="toggle-box" open><summary>Relevant Links</summary><ul class="other-links">'

        for (let i=0; i<replyObject.otherLinks.length; i++) {
            let link = replyObject.otherLinks[i]
            
            let site = link.site
            let identifier = link.identifier

            reply += "<li>"

            if (site == "twitter") {
                reply += `<a target="_BLANK" href="https://twitter.com/${identifier.replace("@","")}"><img src="media/twitter.png"></img></a>`
            } else if (site=="web") {
                identifier = identifier.replace("https://","").replace("http://","")

                reply += `<a target="_BLANK" href="https://${identifier}"><img src="${link.icon ? link.icon : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${identifier.replace("http://","").replace("https://","")}&size=32`}"></img></a>`
            }

            reply += "</li>" 

        }

        reply += '</ul></details>'
    }

    if (replyObject.sources.length > 0) {
        reply += `<details class="toggle-box sources-box"><summary>Source${replyObject.sources.length > 1 ? "s" : ""}</summary>`

        for (let i=0; i<replyObject.sources.length; i++) {
            let source = replyObject.sources[i]
            
            reply += `<a target="_BLANK" href="${source.longURL}">${source.shortURL}</a>`

        }

        reply += "</details>"
    }

    if (!hideInsights) {
        reply += `<details class="toggle-box" style="margin: 0;"><summary>Insights</summary>
            <b>Time to process: </b>${replyObject.finished - replyObject.started}ms<br>
            <b>Artificial time: </b>${replyObject.artificialTime}ms
        </details><br>`
    }

    reply += "<sub><a href='https://github.com/connorjarrett/chatbot/issues'>Is something not right?</a></sub>"

    return reply
}

function askReply(question) {
    // Set time for insights
    const artificialTime = 15*Math.min(Math.max(question.length, 150), 2500)
    let started = Date.now()

    // Add typing bubble
    let bubble = document.createElement("span")
    bubble.classList = "bubble typing"
    bubble.dataset.sender = "bot"
    bubble.style.scale = 0

    $(".messages-container")[0].appendChild(bubble)

    // Scale to full size
    setTimeout(function(){
        bubble.style.scale = ""
    }, 1)
    

    var reply = "this is a reply to that"
    console.log(`Asking reply for '${question}'`)

    // Process Response
    
    function fetchReply() {
        return new Promise((resolve) => {
            resolve(process(question))
        });
    }

    async function getReply() {
        var replyObject = await fetchReply()
        replyObject.started = started
        replyObject.artificialTime = artificialTime

        const reply = buildReply(replyObject)

        var replyBubble = send(reply, "bot", true)

        // Remove typing bubble
        setTimeout(function(){
            bubble.style.scale = 0
            bubble.style.opacity = 0
            replyBubble.style.display = ""
            setTimeout(function(){
                bubble.remove()
                
                replyBubble.style.scale = ""
                $(".messages-container").scrollTop($(".messages-container")[0].scrollHeight)
            },200)
            
        }, artificialTime)
    }

    getReply()
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
    // Handle question answers
    e.preventDefault();

    let data = $("form").serializeArray()
    let message = data[0]["value"]


    if (!message || !hasBotGone()) {
        // Make sure the user has
        //   - Written in the box
        //   - Waited for the bot to reply

        return false
    }

    // Clean user input
    $("#message-box")[0].value = ""
    
    // Show user message
    send(escapeHtml(message),"user")

    // Ask reply from bot
    setTimeout(function(){
        askReply(message)
    },100)
})

// Starting messages
if ($("#message-box").length > 0) {
    setTimeout(function(){
        send("Hi! I'm here to answer your questions &#128522;","bot")

        setTimeout(function(){
            send("<p>Please send your feedback <a href='https://github.com/connorjarrett' target='_BLANK'>here</a> and expect bugs!</p>","bot")
        },500)
    },100)
}

// Image enlarger
function enlarge(src) {
    const enlargeBox = document.createElement("div")
    enlargeBox.classList = "enlarged"

    const bg = document.createElement("img")
    bg.classList = "bg"
    bg.src = src
    $(bg).on("click", function(){
        enlargeBox.remove()
    })

    const main = document.createElement("img")
    main.classList = "main"
    main.src = src

    enlargeBox.appendChild(bg)
    enlargeBox.appendChild(main)
    document.body.appendChild(enlargeBox)

    console.log(src)
}