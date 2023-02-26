# chatbot
it's probably better than [bard](https://www.theverge.com/2023/2/8/23590864/google-ai-chatbot-bard-mistake-error-exoplanet-demo)

<br>

## How does it work?
It has a few simple built in commands (Say and Greet) which allow it to execute specific functions when triggered. But the bulk of it (currently) is performed through the Google Search API and the Google Knowledge Graph API.

First, the bot will check to see if one of it's commands can answer the question, in the likely circumstance that it can't, it will check the Google Knowledge Graph for a stripped string of the question looking for keywords (Filtering out strings like "who is" or "what is"). If this returns a relevant result, it will be presented with a description and a picture with the source listed.

If neither a command or the Knowledge Graph returns an answer, the bot will resort Google Search. It uses Google's search API and searches the query. By blacklisting a few websites and prioritising some others, 9 times out of 10 it gets a useful answer back. The bot **currently** uses the snippet from the webpage as the main text. If Google detects an image for that page, that will show too.

## Future Plans
- **Full page search**
<br>Instead of using snippets it would scan the whole page and look for a good answer in the pages contents. Plan is to use Readability.js to get the main content. Problem is can't read the HTML of all web pages without being blocked for security risks.
- **Hey Siri...**
<br>Wouldn't it be funny to intigrate this as a Siri alternative in [browsur](https://github.com/conjardev/browsur)
