// utility methods go here //

// Include Readability.js library in your extension
// You can download it from: https://github.com/mozilla/readability

// Function to extract article content using Readability.js
// function extractArticleContent() {
//   // Get the document's HTML content
//   const doc = new DOMParser().parseFromString(document.documentElement.outerHTML, 'text/html');

//   // Initialize Readability with the document
//   const article = new Readability(doc).parse();

//   // Return the extracted article content
//   return article ? article.content.textContent.trim() : null;
// }

// // Usage example:
// const articleText = extractArticleContent();
// console.log(articleText);

var counter = 0;


// To fetch the text content from the current tab
async function getCurrentTabContent() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const contentPromise = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const textContent = document.documentElement.innerText;
      const url = window.location.href;
      return { textContent, url };
    },
  });
  return contentPromise[0].result;
}


// To make the API call for summarizing
async function summarizeAPI(request, userId) {
  console.log("Summarize api");
  try {
    var localhost = "http://localhost:4000";
    var devhost = "https://mkhg9ap0r7.execute-api.us-east-1.amazonaws.com";
    var livehost = "https://f399xdvxwf.execute-api.us-east-1.amazonaws.com";

    // Make a GET request to the FastAPI backend
    const response = await fetch(livehost + '/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: request.url,
        audio: "true",
        transcript: request.textContent,
        user_id: userId
      }),
    });
    const data = await response.json();
    console.log(data);
    renderSummaryResponse(data);

  } catch (error) {
    console.error('Error:', error);
    // Add error handling logic here (e.g., display an error message to the user)
  }
  console.log("Summarize api END");
}

// To format and render the response
function renderSummaryResponse(response) {
  // Hide the loader div
  document.querySelector('.loader').style.display = 'none';

  // If text_summary is present, start rendering it
  // Create para for every bullet of summary
  if (response.text_summary) {
    const summary = response.text_summary || "This article could not be summarized."
    const paragraphs = summary.split('\n').map(sentence => {
      const p = document.createElement('p');
      p.textContent = `${sentence}`;
      return p;
    });

    // Replace the article content
    const summaryDiv = document.querySelector('#articleContent #summary')
    paragraphs.forEach(p => summaryDiv.appendChild(p));
  }

  // // Make the content div visible
  const articleContent = document.getElementById('articleContent');
  if (articleContent.style.display === 'none') {
    articleContent.style.display = 'block';
  }

  // Get the height of the entire content
  const contentHeight = document.documentElement.scrollHeight;

  // Send a message to the parent window with the content height
  window.parent.postMessage({ type: 'contentHeight', height: contentHeight }, '*');

}

// To make the API call for summarizing
async function inferenceAPI(request, userId) {
  console.log("Inference api");
  try {
    var localhost = "http://localhost:4000";
    var devhost = "https://mkhg9ap0r7.execute-api.us-east-1.amazonaws.com";
    var livehost = "https://f399xdvxwf.execute-api.us-east-1.amazonaws.com";

    // Make a GET request to the FastAPI backend
    const response = await fetch(livehost + '/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: request.url,
        audio: "true",
        transcript: request.textContent,
        user_id: userId
      }),
    });
    const data = await response.json();
    console.log(data);
    renderInferenceResponse(data);

  } catch (error) {
    console.error('Error:', error);
    // Add error handling logic here (e.g., display an error message to the user)
  }
  console.log("Inference api END");
}


// To format and render the response
function renderInferenceResponse(response) {
  // Hide the loader div
  document.querySelector('.loader').style.display = 'none';

  // Insert the audio component
  if (response.audio_url) {
    setAudioSource(response.audio_url);
  }

  // Add other elements from response if present
  if (response.time_saved && response.time_saved > 10)
    response.time_saved = null;

  setElement(response.time_saved, '#timesaved', '#timesaved .timesaved');
  setElement(response.sentiment, '#sentiment', '#sentiment .bullet.blue');
  setElement(response.tone, '#tone', '#tone .bullet.brand');
  setListElement(response.key_topics, '#topics');

  // Make the content div visible if hidden
  const articleContent = document.getElementById('articleContent');
  if (articleContent.style.display === 'none') {
    articleContent.style.display = 'block';
  }

  // Make the infererence div visible if hidden
  const inference = document.getElementById('inference');
  if (inference.style.display === 'none') {
    inference.style.display = 'block';
  }


  // Get the height of the entire content
  const contentHeight = document.documentElement.scrollHeight;

  // Send a message to the parent window with the content height
  window.parent.postMessage({ type: 'contentHeight', height: contentHeight }, '*');
}



// Renders the audio component in the UI
function setAudioSource(signedUrl) {
  const audioPlayerContainer = document.querySelector('.audio-player'); // Select the audio player container

  // Create audio element
  const audioPlayer = document.createElement('audio');
  audioPlayer.controls = true;

  // Create source element
  const source = document.createElement('source');
  source.src = signedUrl;
  source.type = 'audio/mpeg';

  // Append source to audio player
  audioPlayer.appendChild(source);

  // Remove any existing children (to replace the previous audio player)
  while (audioPlayerContainer.firstChild) {
    audioPlayerContainer.removeChild(audioPlayerContainer.firstChild);
  }

  // Append the audio player to the container
  audioPlayerContainer.appendChild(audioPlayer);
}

function setElement(value, parentSelector, childSelector) {
  const child = document.querySelector(childSelector);
  const parent = document.querySelector(parentSelector);

  if (value) {
    // If time_saved is not empty
    child.textContent = value;
    parent.style.display = 'block'; // Show the div
  } else {
    // If time_saved is empty
    parent.style.display = 'none'; // Hide the div
  }
}

function setListElement(value, parentSelector) {
  const parent = document.querySelector(parentSelector);

  // Create a <ul> element
  const ulElement = document.createElement("ul");

  if (value && Array.isArray(value)) {
    // Iterate over the list of strings
    value.forEach((string) => {
      // Create an <li> element for each string
      const liElement = document.createElement("li");
      // Set the text content of the <li> element to the current string
      liElement.textContent = string;
      liElement.classList.add("topic-item"); // Replace "list-item" with your desired class name

      // Append the <li> element to the <ul> element
      ulElement.appendChild(liElement);
    });

    parent.appendChild(ulElement);
  } else {
    parent.style.display = 'none';
  }
}

// *** Methods for managing user ID ***

// Generate a random user ID
function generateUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Check if the ID exists in storage
// Function to get user ID from chrome.storage.local. Triggers generation if it doesn't exist
async function getUserId() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('userId', function (data) {
      if (data.userId) {
        resolve(data.userId);
      } else {
        var newUserId = generateUserId();
        chrome.storage.local.set({ 'userId': newUserId }, function () {
          resolve(newUserId);
        });
      }
    });
  });
}




// Event listener that starts the chrome extension's execution
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('articleContent').style.display = 'none';
  document.getElementById('inference').style.display = 'none';
  document.querySelector('.loader').style.display = 'block';

  const content = await getCurrentTabContent();
  const userId = await getUserId();
  await summarizeAPI(content, userId);
  await inferenceAPI(content, userId);

});


const steps = ['Extracting...', 'Crunching...', 'Summarizing...', 'Finishing up...', 'Transporting...', 'Here it comes...', 'Anytime now...', 'Now for sure !!!'];
let currentStep = 0;

const stepElement = document.querySelector('.loading-steps');

function updateStep() {
  stepElement.textContent = steps[currentStep];
  currentStep = (currentStep + 1) % steps.length;
}

// Change step every 2 seconds
setInterval(updateStep, 2000);
