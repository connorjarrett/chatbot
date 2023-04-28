google.charts.load('current', {'packages':['corechart']});
    
    var testdata = [["Count","Response Time (ms)"]]

    $.ajax({
        url: "demo/tests.json",
        async: false,
        success: function(data){
            let mean = 0

            for (let i=0; i<data.length; i++) {
                testdata.push([i, data[i]["process-time"]/1000])
                mean += data[i]["process-time"]
            }

            $("#response_time_mean").html(Math.ceil(mean/data.length/5)*5)
        }
    })

google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable(testdata);
    var options = {
        curveType: 'function',
        animation: {
            "startup": true,
            duration: 1500,
            easing: 'out',
        },
        legend: "none",
        hAxis: { textPosition: 'none' },
        vAxis: {
            scaleType: 'linear'
        },
        tooltip: {
            trigger: 'none'
        },
        chartArea: {'width': '100%', 'height': '100%'},
        trendlines: { 0: {}, 1:{}}
    };
    var chart = new google.visualization.LineChart(document.getElementById('response_time_chart'));

    chart.draw(data, options);
}

$(window).resize(drawChart);

const demosets = {
    search: {
        question: "Who is the cofounder of Apple?",
        exampleOf: "Search",
        result: {
            "text": "<b>Stephen Gary Wozniak</b><br><br>Stephen Gary Wozniak (born August 11, 1950), also known by his nickname \"Woz\", is an American technology entrepreneur, electronics engineer, computer programmer, philanthropist, and inventor. <br><br><details><summary>Learn More</summary><ul>\n                            <li><details>\n                                <summary>Pre-Apple</summary>\n                                <i>In 1969, Wozniak returned to the San Francisco Bay Area after being expelled from the University of Colorado Boulder in his first year for hacking the university's computer system. </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Apple formation and success</summary>\n                                <i>\"Wozniak designed Apple's first products, the Apple I and II computers and he helped design the Macintosh — because he wanted to use them and they didn't exist.\" \"Between Woz and Jobs, Woz was the innovator, the inventor. Steve Jobs was the marketing person.\" \"Everything I did at Apple that was an A+ job and that took us places, I had two things in my favor ... I had no money [and] I had had no training.\" </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Plane crash and temporary leave from Apple</summary>\n                                <i>On February 7, 1981, the Beechcraft Bonanza A36TC which Wozniak was piloting (and not qualified to operate ) crashed soon after takeoff from the Sky Park Airport in Scotts Valley, California. The airplane stalled while climbing, then bounced down the runway, broke through two fences, and crashed into an embankment. Wozniak and his three passengers—then-fiancée Candice Clark, her brother Jack Clark, and Jack's girlfriend, Janet Valleau—were injured. </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>UC Berkeley and US Festivals</summary>\n                                <i>Later in 1981, after recovering from the plane crash, Wozniak re-enrolled at UC Berkeley to complete his Electrical Engineering and Computer Sciences degree that he started there in 1971 (and which he would finish in 1986). Because his name was well known at this point, he enrolled under the name Rocky Raccoon Clark, which is the name listed on his diploma,  although he did not officially receive his degree in electrical engineering and computer sciences until 1987. </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Return to Apple product development</summary>\n                                <i>Starting in the mid-1980s, as the Macintosh experienced slow but steady growth, Apple's corporate leadership, including Steve Jobs, increasingly disrespected its flagship cash cow Apple II seriesand Wozniak along with it. The Apple II divisionother than Wozniakwas not invited to the Macintosh introduction event, and Wozniak was seen kicking the dirt in the parking lot. Although Apple II products provided about 85% of Apple's sales in early 1985, the company's January 1985 annual meeting did not mention the Apple II division or its employees, a typical situation that frustrated Wozniak. </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Final departure from Apple workforce</summary>\n                                <i>Even with the success he had helped to create at Apple, Wozniak believed that the company was hindering him from being who he wanted to be, and that it was \"the bane of his existence\". He enjoyed engineering, not management, and said that he missed \"the fun of the early days\". As other talented engineers joined the growing company, he no longer believed he was needed there, and by early 1985, Wozniak left Apple again, stating that the company had \"been going in the wrong direction for the last five years\". </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Post-Apple</summary>\n                                <i>After his career at Apple, Wozniak founded CL 9 in 1985, which developed and brought the first programmable universal remote control to market in 1987, called the \"CORE\". </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Inventions</summary>\n                                <i>Wozniak is listed as the sole inventor on the following Apple patents: </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Philanthropy</summary>\n                                <i>In 1990, Wozniak helped found the Electronic Frontier Foundation, providing some of the organization's initial funding and serving on its founding Board of Directors. He is the founding sponsor of the Tech Museum, Silicon Valley Ballet and Children's Discovery Museum of San Jose. Also since leaving Apple, Wozniak has provided all the money, and much onsite technical support, for the technology program in his local school district in Los Gatos. </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Honors and awards</summary>\n                                <i>Because of his lifetime of achievements, multiple organizations have given Wozniak awards and recognition, including: </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Honorary degrees</summary>\n                                <i>For his contributions to technology, Wozniak has been awarded a number of Honorary Doctor of Engineering degrees, which include the following: </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>In media</summary>\n                                <i>Steve Wozniak has been mentioned, represented, or interviewed countless times in media from the founding of Apple to the present. Wired magazine described him as a person of \"tolerant, ingenuous self-esteem\" who interviews with \"a nonstop, singsong voice\". </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Views on artificial superintelligence</summary>\n                                <i>In March 2015, Wozniak stated that while he had originally dismissed Ray Kurzweil's opinion that machine intelligence would outpace human intelligence within several decades, Wozniak had changed his mind: I agree that the future is scary and very bad for people. If we build these devices to take care of everything for us, eventually they'll think faster than us and they'll get rid of the slow humans to run companies more efficiently. Wozniak stated that he had started to identify a contradictory sense of foreboding about artificial intelligence, while still supporting the advance of technology. </i>\n                            </details></li>\n                            \n                            <li><details>\n                                <summary>Personal life</summary>\n                                <i>Wozniak lives in Los Gatos, California. He applied for Australian citizenship in 2012, and has stated that he would like to live in Melbourne, Australia in the future. Wozniak has been referred to frequently by the nickname \"Woz\", or \"The Woz\"; he has also been called \"The Wonderful Wizard of Woz\" and \"The Second Steve\" (in regard to his early business partner and longtime friend, Steve Jobs). </i>\n</details></li>\n</ul></details><br>",
            "sources": [
              {
                "shortURL": "en.wikipedia.org",
                "longURL": "https://en.wikipedia.org/wiki/Steve_Wozniak"
              }
            ],
            "otherLinks": [
              {
                "site": "web",
                "identifier": "woz.org"
              }
            ],
            "imageAlt": "Wozniak in 2017",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Steve_Wozniak_by_Gage_Skidmore_3_%28cropped%29.jpg/1200px-Steve_Wozniak_by_Gage_Skidmore_3_%28cropped%29.jpg",
            "finished": 1682539951971,
            "started": 1682539951040,
            "artificialTime": 2250
        }
    },

    music: {
        question: "Tell me about 'The Chronic' by Dr Dre",
        exampleOf: "Music",
        result: {
            "text": "<b>The Chronic</b> <i>starring <a target=\"_BLANK\" href=\"https://open.spotify.com/artist/6DPYiyq5kWVQS4RGwxzPC7\">Dr. Dre</a></i>\n                                                <br><br><details><summary>16 tracks:</summary>\n                                                <ol><li><a href=\"https://open.spotify.com/track/0LskV3ejYLWa6Ew2d4tcf4\" target=\"_BLANK\">The Chronic (Intro)</a></li><li><a href=\"https://open.spotify.com/track/21NA5Zggba7pyACm25h6k4\" target=\"_BLANK\">Fuck Wit Dre Day (And Everybody's Celebratin')</a></li><li><a href=\"https://open.spotify.com/track/36yUCSB9OaMz0RMUQDOSpT\" target=\"_BLANK\">Let Me Ride</a></li><li><a href=\"https://open.spotify.com/track/4hk5l9HA43xFO0fFOh2hTt\" target=\"_BLANK\">The Day The Niggaz Took Over</a></li><li><a href=\"https://open.spotify.com/track/5Tbpp3OLLClPJF8t1DmrFD\" target=\"_BLANK\">Nuthin' But A \"G\" Thang</a></li><li><a href=\"https://open.spotify.com/track/1SZqIkhIYVM4H2gDUfOqtk\" target=\"_BLANK\">Deeez Nuuuts</a></li><li><a href=\"https://open.spotify.com/track/77tHKMBRVkxOugr1Z3N4et\" target=\"_BLANK\">Lil' Ghetto Boy</a></li><li><a href=\"https://open.spotify.com/track/5I6w5Y3RIfzZ9tpdMPXfcu\" target=\"_BLANK\">A Nigga Witta Gun</a></li><li><a href=\"https://open.spotify.com/track/4uxRsPpOJwRu7CykJBqdt8\" target=\"_BLANK\">Rat-Tat-Tat-Tat</a></li><li><a href=\"https://open.spotify.com/track/38RzqEAX9ctRbneaXCMJJI\" target=\"_BLANK\">The $20 Sack Pyramid</a></li><a href=\"https://open.spotify.com/album/2V5rhszUpCudPcb01zevOt\" target=\"_BLANK\">And more...</a></ol></details>",
            "sources": [
              {
                "shortURL": "spotify.com",
                "longURL": "https://open.spotify.com/album/2V5rhszUpCudPcb01zevOt"
              },
              {
                "shortURL": "en.wikipedia.org",
                "longURL": "https://en.wikipedia.org/wiki/The_Chronic"
              }
            ],
            "otherLinks": [
              {
                "site": "web",
                "identifier": "https://open.spotify.com/album/2V5rhszUpCudPcb01zevOt"
              }
            ],
            "image": "https://i.scdn.co/image/ab67616d0000b2739710731c9d7baec635f1bab1",
            "finished": 1682539753761,
            "started": 1682539752291,
            "artificialTime": 2250
        }
    },
    movies: {
        question: "Tell me about the Wolf Of Wall Street",
        exampleOf: "Movies & TV",
        result: {
            "text": "<b>The Wolf of Wall Street</b> <i>Movie</i><br>\n<i>2013 | 8.2 stars | 37 awards won | 3h</i>\n<br><hr>\nStarring: Leonardo DiCaprio, Jonah Hill, Margot Robbie\n<hr>\n<details open><summary><b>Plot:</b></summary>\n                        Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.\n                        </details>\n                        <hr>\n                        <details><summary><b>Soundtrack</b> [Beta]<b>:</b></summary><br>\n                                                Featuring: <i><a target=\"_BLANK\" href=\"https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of\">Various Artists</a></i>\n                                                <br>\n                                                <ol><li><a href=\"https://open.spotify.com/track/44dmYUaOqniIWMizpDr3GX\" target=\"_BLANK\">Mercy, Mercy, Mercy - Live</a></li><li><a href=\"https://open.spotify.com/track/5QlVbuE3TxDSxQHmZ0n033\" target=\"_BLANK\">Dust My Broom</a></li><li><a href=\"https://open.spotify.com/track/53tQITnpy7PzZphMRYA9Y8\" target=\"_BLANK\">Bang! Bang!</a></li><li><a href=\"https://open.spotify.com/track/0j6by8oXYJm3lGZnS0flrM\" target=\"_BLANK\">Movin' Out (Anthony's Song)</a></li><li><a href=\"https://open.spotify.com/track/5h7CtpZi66o0c5eQmVoCtp\" target=\"_BLANK\">C’est Si Bon</a></li><li><a href=\"https://open.spotify.com/track/45IQyiqL2gy6TuI8a33iSU\" target=\"_BLANK\">Goldfinger</a></li><li><a href=\"https://open.spotify.com/track/4DoCtqBG8UvPNpoy6HUy6A\" target=\"_BLANK\">Pretty Thing</a></li><li><a href=\"https://open.spotify.com/track/5LlZuepWNNIxWmXgWXUhtL\" target=\"_BLANK\">Moonlight In Vermont - Live</a></li><li><a href=\"https://open.spotify.com/track/6Zo3QapMvKMceJPHTHNs19\" target=\"_BLANK\">Smokestack Lightning</a></li><li><a href=\"https://open.spotify.com/track/6NKhY15Y8QaN67bBGxRA2b\" target=\"_BLANK\">Hey Leroy, Your Mama's Callin' You</a></li><li><a href=\"https://open.spotify.com/track/3DGn7SH3cwRN0sr9r0fHcU\" target=\"_BLANK\">Double Dutch</a></li><li><a href=\"https://open.spotify.com/track/13Y7t257dzRhvbTFqbucAp\" target=\"_BLANK\">Never Say Never</a></li><li><a href=\"https://open.spotify.com/track/2xZOE8xDU6KUzYIDsLspps\" target=\"_BLANK\">Meth Lab Zoso Sticker</a></li><li><a href=\"https://open.spotify.com/track/7ANTHlYy9lEeG3jpHwHjZB\" target=\"_BLANK\">Road Runner</a></li><li><a href=\"https://open.spotify.com/track/49RVXQQfC9ljmR8LQEzOte\" target=\"_BLANK\">Mrs. Robinson</a></li><li><a href=\"https://open.spotify.com/track/7Lt2u980DQvxEdxwvphUR5\" target=\"_BLANK\">Cast Your Fate To The Wind</a></li></ol></details>",
            "sources": [
              {
                "shortURL": "www.imdb.com",
                "longURL": "https://www.imdb.com/title/tt0993846/plotsummary/"
              },
              {
                "shortURL": "spotify.com",
                "longURL": "https://open.spotify.com/album/7JBLWG747XPJhxuatryC6r"
              }
            ],
            "otherLinks": [
              {
                "site": "web",
                "identifier": "https://www.imdb.com/title/tt0993846"
              },
              {
                "site": "web",
                "identifier": "https://open.spotify.com/album/7JBLWG747XPJhxuatryC6r"
              }
            ],
            "image": "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_FMjpg_UX1000_.jpg",
            "finished": 1682539621270,
            "started": 1682539617998,
            "artificialTime": 2250
        }
    },

    news: {
        question: "Tell me about the man that climbed Salesforce Tower",
        exampleOf: "News",
        result: {
            "text": "<b>Man free climbs 1,070-foot Salesforce Tower in San Francisco</b> - ABC7 San Francisco\n<br><br>\nThe man who scaled San Francisco's Salesforce Tower, a rock climber who calls himself the \"Pro-Life Spiderman,\" was posting on Instagram as he ascended.\n",
            "sources": [
              {
                "shortURL": "abc7news.com",
                "longURL": "https://abc7news.com/man-climbing-salesforce-tower-sf-person-scaling-building-san-francisco-news/11814580/"
              }
            ],
            "otherLinks": [
              {
                "site": "twitter",
                "identifier": "@abc7newsbayarea"
              },
              {
                "site": "web",
                "identifier": "https://abc7news.com/man-climbing-salesforce-tower-sf-person-scaling-building-san-francisco-news/11814580/"
              }
            ],
            "image": "",
            "video": "https://content.uplynk.com/ext/4413701bf5a1488db55b767f8ae9d4fa/050322-kgo-11p-maison-deschamps-vid.m3u8?ad._v=2&ad.preroll=1&ad.fill_slate=1&ad.ametr=1&rays=ihgfedc",
            "finished": 1682536338160,
            "started": 1682536337319,
            "artificialTime": 2250
          }
    }
}

const demo = {
    build(container) {
        if (!container.dataset.demo) {return false}
        
        if (!demosets[container.dataset.demo]) {
            return false
        }

        const question = demosets[container.dataset.demo].question
        const result = demosets[container.dataset.demo].result

        const iframeExisted = container.getElementsByTagName("iframe").length == 0 ? false : true
        const iframe = container.getElementsByTagName("iframe").length == 0 ? document.createElement("iframe") : container.getElementsByTagName("iframe")[0]
       
        iframe.srcdoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/moz-readability@0.2.1/Readability.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
            <script src="https://unpkg.com/wtf_wikipedia"></script>

            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0" />
            <link rel="stylesheet" href="src/style.css">
        </head>
        <body>
            <style>
                body, .messages-container {
                    width: 100%;
                    height: 100vh;
                    margin: 0;
                }

                .messages-container {
                    overflow-y: scroll;
                }

                .bubble:last-child  {
                    margin-bottom: 0;
                }

                .bubble {
                    max-width: 100%;
                }

                form {
                    width: 80%;
                    max-width: unset;
                }

                #restart {
                    background-color: rgb(65, 65, 65);
                    padding: 5px 25px 5px 25px;
                    border-radius: 100vmin;
                    color: white;

                    cursor: pointer;

                    transform: translateY(15px);
                    opacity: 0;
                    transition: all 700ms;
                }

                #restart img {
                    height: 1em;
                }
            </style>

            <div class="messages-container">
                <span class="bubble" data-sender="user" id="question" style="scale:0; display:none"><div>${question}</div></span>
                <span class="bubble typing" id="typing" data-sender="bot" style="scale:0; display:none"></span>
                <span class="bubble" id="response" data-sender="bot" style="scale:0; display:none"><div></div></span>
            </div>

            <span id="restart"><img src="demo/media/restart.svg" alt="Restart Symbol"></span>

            <form>
                <input type="text" id="m" style="width: 100%;" disabled placeholder="Ask me anything">
                <button type="submit" class="submit" tabindex="-1" disabled></button>
            </form>

            <script src="src/embeds.js"></script>
            <script src="src/chat.js"></script>

            <script>
                $("#response").html(buildReply(${JSON.stringify(result)}, true))
            </script>
        </body>
        </html>
        `

        if (!iframeExisted) {
            container.appendChild(iframe)
        }

        demo.init(container)
    },

    init(container) {
        if (!container.dataset.demo) {return false}
        
        if (!demosets[container.dataset.demo]) {
            return false
        }

        const cover = document.createElement("div")
        cover.classList = "cover"

        const title = document.createElement("h4")
        title.innerHTML = `Chatbot x ${demosets[container.dataset.demo].exampleOf}`

        $(cover).click(function(){
            const c = this 

            c.style.opacity = "0"
            c.style.pointerEvents = "none"

            setTimeout(function(){
                demo.run(container)
                c.remove()
            }, 600)
        })

        cover.appendChild(title)
        container.appendChild(cover)

    },

    run(container) {
        if (!container.dataset.demo) {return false}
        
        if (!demosets[container.dataset.demo]) {
            return false
        }


        const iframe = container.getElementsByTagName("iframe")[0]

        if (!iframe) {return false}
         
        const question = demosets[container.dataset.demo].question
        const messageBox = $(iframe).contents().find('html').find('body').find('form').find('#m')
        const submitButton = $(iframe).contents().find('html').find('body').find('form').find('.submit')

        const qBubble = $(iframe).contents().find('html').find('body').find('.messages-container').find('#question')
        const tBubble = $(iframe).contents().find('html').find('body').find('.messages-container').find('#typing')
        const aBubble = $(iframe).contents().find('html').find('body').find('.messages-container').find('#response')

        const restart = $(iframe).contents().find('html').find('body').find('#restart')

        // console.log($(iframe).contents().find('html').find('body').find('form'))

        if(messageBox.length < 1 || submitButton.length < 1 || qBubble.length < 1 || tBubble.length < 1 || aBubble.length < 1 || restart.length < 1) {return false}

        $(restart[0]).click(function(){
            demo.build(container)
        })

        for (let i=0; i<question.length; i++) {
            setTimeout(function(){
                messageBox[0].value += question[i]
                messageBox[0].scrollLeft = messageBox[0].scrollWidth
            },i*75)
        }

        setTimeout(function(){
            messageBox[0].value = ""
            submitButton[0].classList = "submit unavailable"

            qBubble[0].style.display = ""
            setTimeout(function(){
                qBubble[0].style.scale = ""
            }, 10)
            
            setTimeout(function(){
                tBubble[0].style.display = ""
                setTimeout(function(){
                    tBubble[0].style.scale = ""
                }, 10)

                setTimeout(function(){
                    tBubble[0].style.scale = "0"
                    setTimeout(function(){
                        tBubble[0].style.display = "none"
                    }, 600)
                }, 1500)

                setTimeout(function(){
                    aBubble[0].style.display = ""
                    setTimeout(function(){
                        aBubble[0].style.scale = ""
                    }, 10)

                    setTimeout(function(){
                        restart[0].style.transform = "translateY(5px)"
                        restart[0].style.opacity = "1"
                    }, 650)
                }, 1600)
            }, 250)
        },(75*question.length) + 50)
    }
}

$(".demo").each(function(){
    demo.build(this)
})