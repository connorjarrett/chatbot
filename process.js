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

    var nokey = {}

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

    if (nokey != {}) {
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

                // Add page URL to sources
                result.sources.push({
                    shortURL: page.displayLink,
                    longURL: page.link
                })

                // Get page content
                result.text = page.snippet

                if (page.pagemap) {
                    // Check for pagemap which holds rich data
                    const pagemap = page.pagemap

                    // Basic formatting:
                    // This is done for if there isn't a rich result yet for that page
                    if (pagemap.metatags) {
                        if (pagemap.metatags.length > 0) {
                            if (pagemap.metatags[0]["og:description"]) {
                                // Add page description, often more favourable than a snippet
                                // Use whichever is longest to provide the most info

                                if (page.snippet.length < pagemap.metatags[0]["og:description"].length) {
                                    result.text = pagemap.metatags[0]["og:description"]
                                } else {
                                    result.text = page.snippet
                                }
                                
                            }

                            if (pagemap.metatags[0]["twitter:site"]) {
                                // Add twitter site if linked
                                // In some rich results this gets removed.

                                result.otherLinks.push({
                                    site: "twitter",
                                    identifier: pagemap.metatags[0]["twitter:site"]
                                })
                            }

                            if (pagemap.metatags[0]["og:image"]) {
                                // Add high res image for the thumbnail
                                result.image = pagemap.metatags[0]["og:image"]
                            }
                        }
                    }

                    if (pagemap.cse_thumbnail) {
                        // Backup image
                        result.image = pagemap.cse_thumbnail[0].src
                    }

                    // Time embed:
                    // The timezone is sourced via time.is, but their website is not scraped as of their T&C's

                    if (page.link.startsWith("https://time.is/")) {
                        if (page.link == "https://time.is/") {
                            // Just time, no timezone, use the users current timezone
                            var d = new Date();
                            let time = d.getTime();
                            
                            var datevalues = [
                                d.getHours(),
                                d.getMinutes(),
                            ];

                            result.text = `Currently, in your timezone, the time is <b>${datevalues[0]}:${datevalues[1]}</b>`
                            result.image = ""
                        } else if (page.title.startsWith("Time in") && page.title.endsWith("now")) {
                            // Date in specified area
                            // Fetch the country and city
                            let location = page.title.replace("Time in","").replace("now","").split(",")

                            for (let i=0; i<location.length; i++) {
                                location[i] = location[i].trim().replaceAll(" ","_")
                            }

                            console.log(location)

                            // Add sources.
                            result.sources.push({
                                shortURL: "timeanddate.com [IMAGE]",
                                longURL: "https://www.timeanddate.com"
                            })

                            // Build response
                            // Use timeanddate.com image for beautification

                            if (location.length == 1) {
                                // Only country specified
                                result.text = `Time in ${location[0]}`
                                result.image = `https://www.timeanddate.com/scripts/cityog.php?title=Current%20time%20in&tint=0x5f9c2f&city=${location[0].replaceAll("_"," ")}`
                            } else if (location.length == 2) {
                                // City and country provided
                                result.text = `Time in ${location[0]}, ${location[1]}`
                                result.image = `https://www.timeanddate.com/scripts/cityog.php?title=Current%20time%20in&tint=0x5f9c2f&city=${location[0].replaceAll("_"," ")}&country=${location[1].replaceAll("_"," ")}&image=${location[0].toLowerCase().replaceAll("_","-")}1`
                            } else {
                                // Provice given, but we will ignore it
                                result.text = `Time in ${location[0]}, ${location[location.length-1]}`
                                result.image = `https://www.timeanddate.com/scripts/cityog.php?title=Current%20time%20in&tint=0x5f9c2f&city=${location[0].replaceAll("_"," ")}&country=${location[location.length-1].replaceAll("_"," ")}&image=${location[0].toLowerCase().replaceAll("_","-")}1`
                            }
                        } else {
                            // If not a time based page, just use the snippet
                            result.text = page.snippet
                        }
                    }

                    // Wikipedia:
                    // Find the article title via the hcard and then use the API and the wtf_wikipedia parser to get a result
                    if (page.link.startsWith("https://en.wikipedia.org/wiki/")) {
                        if (pagemap.hcard) {
                            var metadata = pagemap.hcard[0]

                            /*
                            Temporeraly disabled, as the API seems to return most results anyway

                            if (metadata.url) {
                                if (isURL(metadata.url)) {
                                    result.otherLinks.push({
                                        site: "web",
                                        identifier: metadata.url
                                    })
                                }
                            }
                            */

                            // Clear the text field
                            result.text = ""
                        }

                        // Query the Wikipedia API with the name of the article by  filtering the URL
                        $.ajax({
                            method: "GET", 
                            url: `https://en.wikipedia.org/w/rest.php/v1/page/${page.link.replace(/https:\/\/[A-Za-z0-9]+\.wikipedia\.org\/wiki\//i, "")}`,
                            async: false,
                            success: function(wikiresponse) {
                                // Get the source of the article and parse from Wikitext to JSON
                                const str = wikiresponse.source
                                const doc = wtf(str).json()

                                console.log(doc)
                                
                                // Add a header, use the page title if the article does not return one
                                // Always capitalise the first character
                                result.text = `<b>${doc.title ? doc.title.charAt(0).toUpperCase() + doc.title.slice(1) : page.title.replace(" - Wikipedia","")}</b><br><br>`

                                // Create a result based off of the first paragraph of text
                                // Loop through all the sentences in the first section & paragraph
                                for (let x=0; x<doc.sections[0].paragraphs.length; x++) {

                                    // Make sure the paragraph isn't empty
                                    if (doc.sections[0].paragraphs[x].sentences.length > 0) {
                                        
                                        // Select the first filled paragraph
                                        var openingSentences = doc.sections[0].paragraphs[x].sentences
                                        for (let i=0; i<(openingSentences.length<1 ? openingSentences.length : 1); i++) {
                                            // Loop through at most the first 2 sentences and add those to the result
                                            result.text += `${openingSentences[i].text} `
                                        }

                                        break
                                    }
                                }
                                

                                // Add extra page info
                                result.text += "<br><br><details><summary>Learn More</summary><ul>"

                                // Loop through every section on the page
                                for (let i=0; i<doc.sections.length; i++) {
                                    let section = doc.sections[i]

                                    // Filter out some sections like References & External Links, or ones without any text or name
                                    if (["", "References", "External links"].includes(section.title) || section.paragraphs == undefined) {
                                        continue
                                    }

                                    let sectionContents = ""

                                    for (let x=0; x<(section.paragraphs[0].sentences.length < 3 ? section.paragraphs[0].sentences.length : 3); x++) {
                                            // Get the first 4 sentences from each paragraph
                                            sectionContents += `${section.paragraphs[0].sentences[x].text} `
                                    }

                                    // Add each paragraph to a dropdown
                                    if (sectionContents.trim() != "") {
                                        result.text += `
                                        <li><details>
                                            <summary>${section.title}</summary>
                                            <i>${sectionContents}</i>
                                        </details></li>
                                        `
                                    }
                                }

                                // Close off the initial dropdown
                                result.text += "</ul></details><br>"

                                // Fetch the infobox
                                var infobox = doc.sections[0].infoboxes

                                // Check if there is a page infobox
                                if (infobox) {
                                    infobox = infobox[0]

                                    // Check for image caption to use as image ALT text
                                    if (infobox.caption) {
                                        result.imageAlt = infobox.caption.text
                                    } else if (infobox.image_caption) {
                                        result.imageAlt = infobox.image_caption.text
                                    }

                                    // If there are coordinates add them as a google maps link
                                    if (infobox.coordinates) {
                                        // Filter out the °N and °W and clear up blank space
                                        var coords = infobox.coordinates.text.replaceAll("°N","").replaceAll("°W","").replaceAll(" ","").split(",")

                                        var lat = coords[0]
                                        var long = coords[1]

                                        // Push other link and force Google Maps icon
                                        // Also set to satelite and mid-high zoom
                                        result.otherLinks.push({
                                            site: "web",
                                            identifier: `www.google.com/maps/@${lat},${long},17.33z/data=!3m1!1e3`,
                                            icon: "https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico" 
                                        })
                                    }

                                    // Check for website detected
                                    if (infobox.website) {
                                        if (isURL(infobox.website.text)) {
                                            var websiteFound = false
                                            // Search to see if the website has already been linked
                                            for (let i=0; i<result.otherLinks.length; i++) {
                                                if (result.otherLinks[i].identifier == infobox.website.text) {
                                                    websiteFound = true
                                                }
                                            }

                                            // Push it if that website is not already linked
                                            if (!websiteFound) {
                                                result.otherLinks.push({
                                                    site: "web",
                                                    identifier: infobox.website.text
                                                })
                                            }
                                        }
                                    }

                                    // Wikipedia + Spotify integration:
                                    // Make sure the Spotify API keys are filled out and check if there is an artist and song name listed
                                    if (infobox.name && infobox.artist && key.spotify.clientID != "CLIENT_ID" && key.spotify.clientSecret != "CLIENT_SECRET") {
                                        
                                        // Create search object with the name, artist, and album if applicible
                                        // If no album is listed we assume it IS an album, this changes our search query
                                        let search = {
                                            name: infobox.name.text,
                                            artist: infobox.artist.text,
                                            album: infobox.album ? infobox.album.text : undefined
                                        }

                                        // First, query the Spotify Token API with our credentials to get a token.
                                        // I don't know why they choose to do this as none of the results returned are personally identifiable
                                        $.ajax({
                                            async: false,
                                            method: "POST",
                                            url: "https://accounts.spotify.com/api/token",
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            data: {
                                                grant_type: "client_credentials",
                                                client_id: key.spotify.clientID,
                                                client_secret: key.spotify.clientSecret
                                            },
                                            success: function(data) {
                                                let token = data.access_token

                                                // With our newly aquired token, search the Spotify API
                                                // We're going to search "TITLE - ALBUM (if applicible) - ARTIST"
                                                // If we think it is an album, we will filter for albums, if not, we will filter for songs.
                                                
                                                $.ajax({
                                                    url: "https://api.spotify.com/v1/search",
                                                    async: false,
                                                    data: {
                                                        q: `${search.name} ${search.album ? `- ${search.album}` : ""} - ${search.artist}`,
                                                        type: infobox.album ? "track" : "album"
                                                    },
                                                    headers: {
                                                        "Authorization": `Bearer ${token}`
                                                    },

                                                    success: function(spotifyResult) {
                                                        // Get the first result
                                                        let items = spotifyResult.tracks ? spotifyResult.tracks.items : spotifyResult.albums.items
                                                        let item = items[0]

                                                        if (item.type == "track") {
                                                            // Song format
                                                            // List:
                                                            //  > Song name
                                                            //  > Artists involved (With links)
                                                            //  > Album
                                                            //  > Preview audio

                                                            result.text = `<b>${item.name}</b> <i>- ${$.map(item.artists, function(v){return `<a target="_BLANK" href="${v.external_urls.spotify}">${v.name}</a>`;}).join(", ")}</i>
                                                            <br>From <i>${item.album.name}</i>
                                                            `

                                                            result.audio = item.preview_url
                                                        } else if (item.type == "album") {
                                                            // Album format
                                                            // List
                                                            //  > Album name
                                                            //  > Artists involved (With links)
                                                            //  > Total tracks
                                                            //  > First 10 tracks (With links)
                                                            result.text =   `<b>${item.name}</b> <i>starring ${$.map(item.artists, function(v){return `<a target="_BLANK" href="${v.external_urls.spotify}">${v.name}</a>`;}).join(", ")}</i>
                                                            <br><br><details><summary>${item.total_tracks} tracks:</summary>
                                                            `
                                                        
                                                            // Fetch the tracks from the album
                                                            $.ajax({
                                                                url: `https://api.spotify.com/v1/albums/${item.id}/tracks`,
                                                                async: false,
                                                                data: {
                                                                    id: item.id,
                                                                    limit: 10
                                                                },
                                                                headers: {
                                                                    "Authorization": `Bearer ${token}`
                                                                },
            
                                                                success: function(tracks) {
                                                                    // Create an ordered list
                                                                    result.text += "<ol>"

                                                                    // Loop through every track
                                                                    for (let i=0; i<tracks.items.length; i++) {
                                                                        let track = tracks.items[i]

                                                                        // Add it with it's name and URL
                                                                        result.text += `<li><a href="${track.external_urls.spotify}" target="_BLANK">${track.name}</a></li>`
                                                                    }

                                                                    // If there are more, add a link to them
                                                                    if (tracks.next) {
                                                                        result.text += `<a href="${item.external_urls.spotify}" target="_BLANK">And more...</a>`
                                                                    }

                                                                    // Close the list off
                                                                    result.text += "</ol>"

                                                                }
                                                            })

                                                            // Close the dropdown
                                                            result.text += "</details>"

                                                            // Set the image of the result to the album/song cover art
                                                            result.image = item.images[0].url
                                                        }
                                                        
                                                        // Push the spotify result to the first of the sources and other links
                                                        result.sources.unshift({
                                                            shortURL: "spotify.com",
                                                            longURL: item.external_urls.spotify
                                                        })

                                                        result.otherLinks.push({
                                                            site: "web",
                                                            identifier: item.external_urls.spotify,
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })

                        // Indent Hell ^^^
                        // Bad practices at their finest.
                    }

                    // News Integration:
                    // We use 2 news sites, BBC (Worldwide & UK) and ABC 7
                    if (page.link.startsWith("https://www.bbc.com/news/") || page.link.startsWith("https://www.bbc.co.uk/news/")) {
                        // BBC News
                        // This is mostly UK news, not as common is international queries
                        // It is returns less data than ABC

                        // Add the article title, description and source
                        result.text = `<b>${pagemap.metatags[0]["og:title"]}</b> - BBC News ${pagemap.metatags[0]["article:section"]}
                        <br><br>
                        ${pagemap.metatags[0]["og:description"]}
                        `
                    
                        // Add images with alt
                        result.image = pagemap.metatags[0]["og:image"]
                        result.imageAlt = pagemap.metatags[0]["og:image:alt"]

                        // Push the article with a fixed icon to the "Other Links" section
                        result.otherLinks.push({
                            site: "web",
                            identifier: page.link,
                            icon: "https://static.files.bbci.co.uk/core/website/assets/static/icons/apple-touch/bbc/apple-touch-icon-57x57-precomposed.d3f10798d1329dd00d21.png"
                        })
                    } else if (page.link.startsWith("https://abc7news.com/")) {
                        // ABC 7 News
                        // This is more international, but I am unable to test this fully.
                        // Returns the most data, including videos!

                        // Check for a "Published Time", this should give us a good indication on whether it is actually an article or not
                        if (pagemap.metatags[0]["article:published_time"]) {

                            // For the basic data attach the article title, the source and description
                            // Very similar to the BBC news
                            result.text = `<b>${pagemap.metatags[0].title}</b> - ${pagemap.metatags[0]["og:site_name"]}
                            <br><br>
                            ${pagemap.metatags[0]["og:description"]}
                            `

                            // Check for a video embedded
                            if (pagemap.videoobject) {
                                /*
                                I wanted to pick a random video, but after later testing, decided to instead chose the first as that seemed
                                to be more like a news report rather than B-Roll

                                let video = pagemap.videoobject[Math.floor(Math.random() * pagemap.videoobject.length)]
                                */

                                // Instead, pick the first video
                                let video = pagemap.videoobject[0]
                                console.log(pagemap.videoobject)

                                // If the video exists
                                if (video) {
                                    
                                    // Remove the image and add a video and a thumbnail to the result
                                    result.image = ""
                                    result.video = video.contenturl
                                    result.videoThumbnail = video.thumbnail
                                }
                            }

                            // Push the article to the links section
                            result.otherLinks.push({
                                site: "web",
                                identifier: page.link,
                            })
                        }
                    }

                    // Github (Users and Repos):
                    if (page.link.startsWith("https://github.com/")) {
                        
                        if (pagemap.person && pagemap.softwaresourcecode == undefined) {
                            // Make sure it is a GitHub user and not repository

                            // Check for the person's socials and add them
                            if (pagemap.person[0].social) {
                                // Clear the result, which would just be @Github
                                result.otherLinks = []

                                // The social is just Twitter on github
                                result.otherLinks.push({
                                    site: "twitter",
                                    identifier: pagemap.person[0].social
                                })
                            }

                            // Check for a linked website and push it
                            if (pagemap.person[0].url) {
                                result.otherLinks.push({
                                    site: "web",
                                    identifier: pagemap.person[0].url
                                })
                            }

                            // Call the Github API with the person's username
                            // With this we can get all the real data
                            $.ajax({
                                url: `https://api.github.com/users/${pagemap.person[0].additionalname}`,
                                async: false,
                                success: function(userData) {
                                    console.log(userData)

                                    // Set the image to the user profile picture
                                    result.image = userData.avatar_url

                                    // Build the result using:
                                    //  > The username
                                    //  > The user's name
                                    //  > The user's follwers
                                    //  > The user's following
                                    //  > Their bio
                                    //  > Their listed company
                                    //  > Up to 3 of their public repos

                                    result.text = `<b>${userData.name}</b> <i>@${userData.login}</i><br>
                                    ${userData.followers} followers | ${userData.following} following
                                    <br><br>
                                    <i>"${userData.bio}"</i>
                                    ${userData.company ? `<br><br>Currently @${userdata.company}` : ""}
                                    <br><br>
                                    ${userData.public_repos} public repositories ${userData.public_repos > 0 ? "including...<br>":""}
                                    `

                                    // Call the Github Repos API to get up to 3 of their repos
                                    $.ajax({
                                        url: userData.repos_url,
                                        async: false,
                                        success: function(repos) {
                                            console.log(repos)
                                            // Only incldue up to 3
                                            var count = repos.length < 3 ? repos.length : 3

                                            for (let i=0; i<count; i++) {
                                                // Add the repo as a link
                                                result.text += `<a href="${repos[i].svn_url}">${repos[i].name}</a><br>`
                                            }

                                            // if there are more, indicate that
                                            if (count < repos.length) {
                                                result.text += "... and more"
                                            }
                                        }
                                    })
                                }
                            })
                        } else if (pagemap.softwaresourcecode) {
                            // It is a Github repository
                            
                            // Get the author and reponame from the page metadata
                            var author = pagemap.softwaresourcecode[0].author
                            var repo = pagemap.softwaresourcecode[0].name

                            // Call the Github Repos API using the username and reponame
                            $.ajax({
                                url: `https://api.github.com/repos/${author}/${repo}`,
                                async: false,
                                success: function(repoInfo) {
                                    // Add the basic info first
                                    //  > Repo Name
                                    //  > Author name
                                    result.text = `<b>${repoInfo.name}</b><br>
                                    <i>by ${repoInfo.owner.login}</i>
                                    <br><br>
                                    `

                                    // Some basic README titles to search
                                    var readmes = [
                                        "README.md",
                                        "README.MD",
                                        "readme.md"
                                        // Any other capitlisation combination will not be included.
                                        // This is needed because github's search is case sensitive
                                    ]

                                    var readme = undefined
                                    var readmeSelection = ""

                                    // Loop through all listed README combinations
                                    for (let i=0; i<readmes.length; i++) {

                                        // Call the files API to see if the README file exists
                                        $.ajax({
                                            url: repoInfo.contents_url.replace("{+path}",readmes[i]),
                                            async: false,
                                            success: function(r) {
                                                // If the file does exist, fetch its contents

                                                $.ajax({
                                                    url: r.download_url,
                                                    async: false,
                                                    success: function(readmeContents) {
                                                        // Set the markdown to the readme variable
                                                        readme = readmeContents.split("\n")
                                                    }
                                                })
                                            }
                                        })

                                        // Once one has been chosen, continue
                                        if (readme) {
                                            break;
                                        }
                                    }

                                    if (readme) {
                                        // Remove all nil/blank entires (Empty lines) from the readme
                                        readme = readme.filter(Boolean)

                                        // If the first line is a title, ignore it.
                                        if (readme[0].startsWith("#")) {
                                            // Filter title
                                            readme.splice(0, 1)
                                        }

                                        // Pick at least 2 lines.
                                        for (let i=0; i<(readme.length<1 ? readme.length : 1); i++) {
                                            // Include until next heading
                                            // This should create a basic description only
                                            if (!readme[i].startsWith("#")) {
                                                readmeSelection += `${readme[i]}<br>`
                                            } else {
                                                break
                                            }
                                        }

                                        if (!readmeSelection.startsWith("<") || !readmeSelection.startsWith("[![")) {
                                            // Use Showdown to convert from Markdown to HTML
                                            var converter = new showdown.Converter();

                                            // Escape the HTML
                                            // Curse all the people that use HTML tags in their readme because it made this 10000x harder
                                            
                                            html = escapeHtml(converter.makeHtml(readmeSelection).replace(/ *\<[^)]*\> */g, ""))
                                            //                                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                            //                                                   This filters out all content
                                            //                                                   between triangle brackets <>

                                            console.log(html)

                                            if (html == "") {
                                                // If no readme, use the repo description
                                                result.text += `${repoInfo.description.charAt(0).toUpperCase() + repoInfo.description.slice(1)}<br>`
                                            }

                                            result.text += `${html}<br>`
                                        } else {
                                            // If no readme, use the repo description
                                            result.text += `${repoInfo.description.charAt(0).toUpperCase() + repoInfo.description.slice(1)}<br>`
                                        }
                                    } else {
                                        // If no readme, use the repo description
                                        result.text += `${repoInfo.description.charAt(0).toUpperCase() + repoInfo.description.slice(1)}<br>`
                                    }

                                    
                                    // Add the repo URL to the links section
                                    result.otherLinks.push({
                                        site: "web",
                                        identifier: repoInfo.svn_url
                                    })
                                }
                            })
                        }
                    }

                    // YouTube Embeds:
                    if (page.link.startsWith("https://www.youtube.com/watch?v=")) {

                        // Unset the image
                        result.image = undefined

                        // Set the browser to the provided embed url
                        result.web = pagemap.videoobject[0].embedurl

                        // Build response using:
                        //  > Video name (Filtering out #shorts)
                        //  > Video description (Filtering out #shorts)
                        result.text = `<b>${pagemap.videoobject[0].name.replaceAll("#shorts","")}</b>
                        <br>
                        ${pagemap.videoobject[0].description.replaceAll("#shorts","")}
                        `

                        // Add video link to the links section
                        result.otherLinks.push({
                            site: "web",
                            identifier: page.link
                        })
                    }

                    // IMDb:
                    if (page.link.startsWith("https://www.imdb.com/title/")) {
                        // set the image to the high resolution image
                        result.image = pagemap.metatags[0]["og:image"]

                        // Query the free IMDb api courtesy of tuhinpal
                        // https://github.com/tuhinpal/imdb-api

                        // Official IMDb api requires a whole lisencing process
                        // Not anything anyone wants to do just to try out a chatbot

                        // Make sure it has a page
                        if (pagemap.metatags[0].pageid || pagemap.metatags[0]["imdb:pageconst"]) {

                            $.ajax({
                                async: false,
                                url: `https://imdb-api.projects.thetuhin.com/title/${pagemap.metatags[0]["imdb:pageconst"] ? pagemap.metatags[0]["imdb:pageconst"] : (pagemap.metatags[0].pageid ? pagemap.metatags[0].pageid : "")}`,
                                success: function(titleInfo) {
                                    console.log(titleInfo)

                                    result.otherLinks = [{
                                        site: "web",
                                        identifier: titleInfo.imdb
                                    }]

                                    // Filter the type into a more human readable format
                                    let type = ""

                                    if (titleInfo.contentType == "TVSeries") {
                                        type = "TV Series"
                                    } else if (titleInfo.contentType == "Movie") {
                                        type = "Movie"
                                    }

                                    // Build the main result body using
                                    //  > Content title
                                    //  > Content type
                                    //  > Year
                                    //  > Rating
                                    //  > Awards won
                                    //  > Seasons (TV Shows)
                                    //  > Actors
                                    //  > Plot summary

                                    result.text = `<b>${titleInfo.title}</b> <i>${type}</i><br>
                                    <i>${titleInfo.year} | ${titleInfo.rating.star} stars${titleInfo.award ? ` | ${titleInfo.award.wins} awards won` : ""}${titleInfo.all_seasons ? ` | ${titleInfo.all_seasons.length} seasons` : ""}${titleInfo.runtime ? ` | ${titleInfo.runtime}` : ""}</i>
                                    <br><hr>
                                    Starring: ${titleInfo.actors.join(", ")}
                                    <hr>
                                    <details open><summary><b>Plot:</b></summary>
                                    ${titleInfo.plot}
                                    </details>
                                    <hr>
                                    `

                                    // Search for all seasons
                                    if (titleInfo.contentType == "TVSeries" && titleInfo.all_seasons) {
                                        result.text += "<details><summary>Seasons</summary><ul>"
                                        for (let i=0; i<titleInfo.all_seasons.length; i++) {
                                            $.ajax({
                                                async: false,
                                                url: `https://imdb-api.projects.thetuhin.com${titleInfo.all_seasons[i]["api_path"]}`,
                                                success: function(season) {
                                                    console.log(season)
                                                    result.text += `<li><a href="${season.imdb}" target="_BLANK">${season.name}</a> ${season.episodes ? `- ${season.episodes.length} episodes`: ""}</li>`
                                                }
                                            })
                                        }
                                        result.text += "<ul></details><hr>"
                                    }

                                    // Search for soundtrack on spotify
                                    // Still very much in beta due to no listing for soundtrack title
                                    // Only available for movies for now

                                    if (key.spotify.clientID != "CLIENT_ID" && key.spotify.clientSecret != "CLIENT_SECRET" && titleInfo.contentType == "Movie") {

                                        // Use the user authentication to get a token from the Spotify API
                                        $.ajax({
                                            async: false,
                                            method: "POST",
                                            url: "https://accounts.spotify.com/api/token",
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            data: {
                                                grant_type: "client_credentials",
                                                client_id: key.spotify.clientID,
                                                client_secret: key.spotify.clientSecret
                                            },
                                            success: function(data) {
                                                let token = data.access_token

                                                // Using said token, search Spotify for albums named "[FILM TITLE] (Music from the Motion Picture)"
                                                $.ajax({
                                                    url: "https://api.spotify.com/v1/search",
                                                    async: false,
                                                    data: {
                                                        q: `${titleInfo.title} (Music from the Motion Picture)`,
                                                        type: "album"
                                                    },
                                                    headers: {
                                                        "Authorization": `Bearer ${token}`
                                                    },

                                                    success: function(spotifyResult) {
                                                        // Get the first search result
                                                        let items = spotifyResult.tracks ? spotifyResult.tracks.items : spotifyResult.albums.items
                                                        let item = items[0]

                                                        console.log(item)

                                                        // Only accept if the album name has the film title in it
                                                        if (item.name.toLowerCase().includes(titleInfo.title.toLowerCase())) {
                                                            // Add soundtrack to result body with
                                                            //  > Album artists (With links)
                                                            //  > Album tracks (First 25, With links)

                                                            result.text += `<details><summary><b>Soundtrack</b> [Beta]<b>:</b></summary><br>
                                                            Featuring: <i>${$.map(item.artists, function(v){return `<a target="_BLANK" href="${v.external_urls.spotify}">${v.name}</a>`;}).join(" &bull; ")}</i>
                                                            <br>
                                                            `
                                                        
                                                            // Query Spotify Tracks API for first 25 tracks
                                                            $.ajax({
                                                                url: `https://api.spotify.com/v1/albums/${item.id}/tracks`,
                                                                async: false,
                                                                data: {
                                                                    id: item.id,
                                                                    limit: 25
                                                                },
                                                                headers: {
                                                                    "Authorization": `Bearer ${token}`
                                                                },
            
                                                                success: function(tracks) {
                                                                    // Create orderd list
                                                                    result.text += "<ol>"

                                                                    // Loop through all tracks
                                                                    for (let i=0; i<tracks.items.length; i++) {
                                                                        let track = tracks.items[i]

                                                                        // Add track with link to list
                                                                        result.text += `<li><a href="${track.external_urls.spotify}" target="_BLANK">${track.name}</a></li>`
                                                                    }

                                                                    // If there are more, add a link to where they can be found
                                                                    if (tracks.next) {
                                                                        result.text += `<a href="${item.external_urls.spotify}" target="_BLANK">And more...</a>`
                                                                    }

                                                                    // Close the list
                                                                    result.text += "</ol>"
                                                                }
                                                            })

                                                            // Close the dropdown
                                                            result.text += "</details>"


                                                            // Push Spotify to the Sources and Other Links
                                                            result.otherLinks.push({
                                                                site: "web",
                                                                identifier: item.external_urls.spotify
                                                            })

                                                            result.sources.push({
                                                                shortURL: "spotify.com",
                                                                longURL: item.external_urls.spotify
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }

                        // Ident Hell pt 2 ^^^^^^
                        // I'm clearly not as good at this as I thought I was
                    }

                    // Stack Overflow Questions + Answers:
                    if (page.link.startsWith("https://stackoverflow.com/questions/")) {
                        // Build the basic question result with
                        //  > Question title
                        //  > Asker
                        //  > Question content
                        //  > Answer and Upvote count

                        result.text = `<b>${pagemap.question[0].name}</b><br>
                        <i>asked by ${pagemap.person[0].name}</i>
                        <br><hr>
                        ${pagemap.question[0].text}
                        <hr>
                        <i>${pagemap.question[0].answercount} answers | ${pagemap.question[0].upvotecount} upvotes</i>
                        `

                        // If there are answers, include them
                        if (pagemap.answer && parseInt(pagemap.question[0].answercount) > 0) {
                            // Pick the first answer
                            let suggestedAnswer = pagemap.answer[0]

                            // Assume the answer author, however, this seems to be able to be thrown off so this may have to get scrapped or improved
                            let answerAuthor = pagemap.person[1].name

                            // Add answer content including
                            //  > Answer author
                            //  > Answer text
                            //  > Answer upvotes
                            //  > Answer comments
                            result.text += `<br><br><br><details>
                            <summary>Try this answer</summary>
                            <b>Answer from ${answerAuthor}:</b>
                            <br>
                            ${suggestedAnswer.text}
                            <br><hr>
                            <i>${suggestedAnswer.upvotecount} upvotes | ${suggestedAnswer.commentcount} comments</i>
                            </details><br>`
                        }

                        // If the image is just the logo, don't incude it
                        if (pagemap.question[0].image == "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a") {
                            result.image = ""
                            
                        }

                        // Push the site to the links section
                        result.otherLinks.push({
                            site: "web",
                            identifier: page.link
                        })
                    }    
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

    return result
}