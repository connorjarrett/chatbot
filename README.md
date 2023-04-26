# chatbot
**chatbot** uses web search mixed with powerful integrations to produce a simple and informative result

---

| Table Of Contents |
| - |
| [How to install](#how-to-install) |
| [Coming Soon](#coming-soon) |
<!-- | [What is Chatbot?]() |
| [How Does it Work? ]() | -->

## How To Install
Due to security issues with exposed API keys, you're now going to have to run it yourself.

#### :desktop_computer: Clone The Repository
1. Make sure Git is installed
2. Run the command `git clone https://github.com/conjardev/chatbot.git`
3. Navigate to the "chatbot" directory that was just created

### :key: Get Your API Keys
To start, you're only going to need 1 key, and that is the Google API
<details>
    <summary><b>&#128270; Google</b></summary>
    You'll need:
    <ul>
        <li>A Google account</li>
    </ul>
    Steps:
    <ol>
        <li>Navigate to the Google <a href="https://console.cloud.google.com/">Cloud Console</a></li>
        <li>Create a project</li>
        <li>In the navigation menu, go to <code>APIs & Services > Library</code></li>
        <li>Search for "Custom Search API"</li>
        <li>Click "Enable"</li>
        <li>In the navigation menu, go to <code>APIs & Services > Credentials</code></li>
        <li>Under "API keys" click the first one</li>
        <li>Copy the key and paste it into <code>src/keys.js</code>
    </ol>
</details>
<details>
    <summary>&#127925; Spotify</summary>
    You'll need:
    <ul>
        <li>A Spotify Account</li>
    </ul>
    Steps:
    <ol>
        <li>Navigate to <a href="https://developer.spotify.com/dashboard">Spotify Developers</a></li>
        <li>Click "Create App"</li>
        <li>Set the app name and description to whatever you want</li>
        <li>You do not need to fill the <code>Website</code> field</li>
        <li>Set <code>Redirect URI</code> to any valid URL, such as "https://connorjarrett.com", it will not be used later.</li>
        <li>In your app, click "Settings"</li>
        <li>Copy the "Client ID" into <code>src/keys.js</code> under <code>spotify.clientID</code></li>
        <li>Click "View client secret" and copy it into <code>src/keys.js</code> under <code>spotify.clientSecret</code></li>
    </ol>
</details>

### :white_check_mark: Last Checks
Make sure that <code>src/keys.js.example</code> is renamed to just <code>src/key.js</code>
To run open <code>src/index.html</code> in your browser.

## Coming Soon
- <b>What's the time?</b><br>I want to make it so the time can be told for any timezone, it only currently works for whichever timezone you're in. All I need is a way to convert a string such as "London, UK" into either a timezone, a timezone difference or set of coordinates.