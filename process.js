// Synonyms and actions
const match = [
    [["say","repeat","recite","parrot","mirror","reiterate"],"ECHO",false], 
    [["hello","good morning","good afternoon","good evening","hi","hello world"],"GREET",true],
]

function getAction(word, question = null) {
    // If the word is a match, get the action
    for (let i=0; i<match.length; i++) {
        let synonyms = match[i][0]
        
        if (synonyms.includes(word.toLowerCase())) {
            if (question && (question.toLowerCase() != word.toLowerCase()) && match[i][2] == true ) {
                return false;
            } else {
                var action = match[i][1]
            }
        }
    }

    return action
}

function breakup(question) {
    var broken = []
    let split = question.split(" ")

    var currentAction = ""
    var currentSentence = ""

    for (x=0; x<split.length; x++) {
        let word = split[x]
        
        if (getAction(word, question)) {
            broken.push({"action":currentAction,"sentence":currentSentence})
            currentAction = getAction(word, question)
            currentSentence = ""
        } else {
            currentSentence = `${currentSentence} ${word}`

            if (currentSentence[0] == " ") {
                currentSentence = currentSentence.slice(1)
            }
        }

    }

    broken.push({"action":currentAction,"sentence":currentSentence})
    
    if (broken.length > 1) {
        return broken.slice(1)
    } else {
        return broken
    }
}

function execute(action, params) {
    if (!action) {
        return null
    }

    if (action == "ECHO") {
        console.log(params)
        if (params[0] == "'" || params[0] == '"') {
            params = params.slice(1)
        }

        if (params.at(-1) == "'" || params.at(-1) == '"') {
            params = params.slice(0,-1)
        }

        return params
    } else if (action == "GREET") {
        return "Hello!"
    }
}


function process(question) {
    const broken = breakup(question)
    var out = ""

    for (i=0; i<broken.length; i++) {
        let breakAnswer = execute(broken[i]["action"], broken[i]["sentence"])

        if (breakAnswer) {
            out = out + breakAnswer
        }
    }

    // Unsure, google it
    if (!out) {
        out = ""

        // Knowledge Graph
        $.ajax({
            type: "GET",
            url:"https://kgsearch.googleapis.com/v1/entities:search",
            async: false,
            data: {
                key: "AIzaSyDA0P-tRZEytWhKqX_D_Z-Ce8hNARA3vAY",
                indent: true,
                limit: 1,
                query: question.toLowerCase().replaceAll("who is","").replaceAll("tell me about","")
            },
        
            success: function(data){
                let items = data["itemListElement"]
                console.log(items)

                for (let y=0; y<items.length; y++) {
                    let item = items[y]

                    if (item["resultScore"] > 0.001) {
                        let result = item["result"]
                        
                        console.log(result)

                        out = `
                        ${result["detailedDescription"]["articleBody"]}<sup><a href="${result["detailedDescription"]["url"]}" target="_BLANK">source</a></sup>
                        <br><br>
                        <img src="${result["image"]["contentUrl"]}">
                        `
                    }
                }
            }
        })

        if (!out) {
            // Google Search
            $.ajax({
                type: "GET",
                url:"https://www.googleapis.com/customsearch/v1",
                async: false,
                data: {
                    key: "AIzaSyDA0P-tRZEytWhKqX_D_Z-Ce8hNARA3vAY",
                    cx: "032d94750ca9d496a",
                    q: question
                },
            
                success: function(data){
                    const blockedSties = [
                        "www.instagram.com",
                        "www.linkedin.com",
                        "dodgingtherain.com",
                        "www.facebook.com",
                        "twitter.com"
                    ]

                    const prioritySites = [
                        "connorjarrett.com",
                        "stackoverflow.com",    
                        "cade.dev"
                    ]
                    
                    let priority;
                    let picked = []

                    let items = data["items"]

                    if (items) {
                        for (let x=0; x<items.length; x++) {
                            let item = items[x]

                            if (blockedSties.includes(item["displayLink"])) {
                                continue
                            } else {
                                if (prioritySites.includes(item["displayLink"])) {
                                    priority = item
                                } else {
                                    picked.push(item)
                                }
                            }
                        }

                        if (!priority) {
                            priority = picked[0]
                        }

                        console.log(priority)

                        let snippet = priority["snippet"]
                        snippet = snippet.replace(/[A-Za-z0-9]+ [0-9]+,\s[0-9]+\s\.\.\.\s/i, "")

                        out = `
                        ${snippet}<br><br>
                        [Google Search, <a href="${priority["link"]}" target="_BLANK">${priority["displayLink"].replace("www.","")}</a>]
                        `

                        let images = priority["pagemap"]["cse_image"]
                        if (images) {
                            if (images.length > 0) {
                                let image = images[0]["src"]
                                out = out + `
                                <br><br>
                                <img src="${image}">
                                `
                            }
                        }

                    } else {
                        out = "I haven't found any results for that online"
                    }
                }
            })
        }
    }

    return out
}