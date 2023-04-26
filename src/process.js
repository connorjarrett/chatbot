function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function process(question) {
    // Prepare result for returning
    var result = {
        text: undefined,
        sources: [],
        otherLinks: [],
        web: undefined,
        imageAlt: undefined
    }

    var nokey = undefined

    try {
        key != undefined
    } catch(error) {
        nokey = {
            text: "<b>No keys detected!</b><br>Did you read the <a href='https://github.com/conjardev/chatbot#how-to-install'>documentation</a>?",
            sources: [],
            otherLinks: [],
            web: undefined,
            imageAlt: undefined
        }
    }

    if (nokey) {
        return nokey
    }

    // Only search Google if the key is there
    if (key.google != "GOOGLE") {
        
        // Query Google Search the question the user asked
        $.ajax({
            type: "GET",
            url:"https://www.googleapis.com/customsearch/v1",
            async: false,
            data: {
                key: key.google,
                cx: "032d94750ca9d496a",
                q: question
            },
        
            success: function(response) {
                // Collect all the items from the Google Search query
                const items = response.items
                console.log(response)
                console.log(items)

                const priority = [
                    "connorjarrett.com",
                    "www.connorjarrett.com",
                    "en.wikipedia.org",
                    "stackoverflow.com",    
                    "cade.dev",
                    "github.com",
                    "www.bbc.co.uk",
                    "www.bbc.com",
                    "abc7news.com",
                    "www.imdb.com",
                    "time.is"
                ]

                const blacklist = [
                    "www.instagram.com",
                    "www.linkedin.com",
                    "dodgingtherain.com",
                    "www.facebook.com",
                    "m.facebook.com",
                    "www.urbandictionary.com",
                    "twitter.com"
                ]

                // Filter pages by priority
                var selection = {
                    optimal: [],
                    allowed: [],
                    blocked: []
                }

                for(let i=0; i<items.length; i++) {
                    let item = items[i]

                    if (priority.includes(item.displayLink)) {
                        // If there is a wikipiedia and IMDB, prioritise the IMDB page
                        if (item.displayLink == "en.wikipedia.org" && items.find(item => {return (item.displayLink == 'www.imdb.com' && item.link.startsWith("https://www.imdb.com/name/") == false)})) {
                            selection.allowed.push(item)
                        } else {
                            if (item.link.startsWith("https://www.imdb.com/name/")) {
                                // Do not add IMDB users
                                selection.allowed.push(item)
                            } else {
                                selection.optimal.push(item)
                            }
                            
                        }
                        
                    } else if (!blacklist.includes(item.displayLink)) {
                        selection.allowed.push(item)
                    } else {
                        selection.blocked.push(item)
                    }
                }

                // Pick the final page to use based on priority
                if (selection.optimal.length > 0) {
                    var page = selection.optimal[0]
                } else if (selection.allowed.length > 0) {
                    var page = selection.allowed[0]
                } else {
                    var page = items[0]
                }

                // Get embed for page
                if (embed(page)) {
                    result = embed(page)
                }

                console.log(page)
            },
            // Error handling:
            error: function(xhr) {
                // Parse the JSON of the error
                let error = $.parseJSON(xhr.responseText)
                console.log(error)

                if (error.error.status == "RESOURCE_EXHAUSTED") {
                    // API request error
                    // Free API is limited to 100 requests per day,
                    // Provide a friendly message with solutions

                    result.text = `<b>Oh no!</b>
                    <br>
                    The API has reached the daily limit of ${error.error.details[0].metadata.quota_limit_value}. Solutions?
                    <br><br>
                    <ol>
                    <li>Wait some time (up to 24 hours) for it to reset</li>
                    <li><a href="${error.error.details[1].links[0].url}" target="_BLANK">${error.error.details[1].links[0].description}</a> (Pay Google)</li>
                    </ol>`
                } else {
                    // I don't know the error here
                    // Print out the error message and tell the user they may need to change key.js (Add API key)

                    result.text = `<b>This was unexpected</b>
                    <br>
                    "${error.error.message}"
                    <br><br>
                    You may need to adjust some files like <code>keys.js</code>
                    <br>
                    `
                }

                // Link the chrome dinosaur game with the error
                result.web = "https://offline-dino-game.firebaseapp.com"
                
            }
        })
    }

    // No result text
    if (result.text == "" || result.text == undefined) {
        result.text = "Sorry, I don't know that one. Check your spelling or grammar and try again"

        // Link the chrome dinosaur game with the error
        result.web = "https://offline-dino-game.firebaseapp.com"
    }

    // Add time for insights
    result.finished = Date.now()

    return result
}