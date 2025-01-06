// Encryption utility
function encrypt(text) {
  return btoa(unescape(encodeURIComponent(text))); // Handles non-ASCII characters
}

function decrypt(text) {
  return decodeURIComponent(escape(atob(text)));
}

// Save details
document.getElementById('save-details').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const repo = document.getElementById('repo').value.trim();
  const token = document.getElementById('token').value.trim();

  if (username && repo && token) {
    // Encrypt and store details
    await chrome.storage.local.set({
      githubDetails: {
        username: encrypt(username),
        repo: encrypt(repo),
        token: encrypt(token),
      },
    });
    console.log('GitHub details saved successfully!');
    showNotification('GitHub details saved successfully!');
    loadMainAction();
  } else {
    console.log('Please fill in all the fields.');
    showNotification('Please fill in all the fields.');
  }
});

function showNotification(msg) {
  alert(msg);
}

// Load main action
function loadMainAction() {
  document.getElementById('setup-form').style.display = 'none';
  document.getElementById('main-action').style.display = 'block';
}

// Check stored details on load
document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.local.get('githubDetails');
  if (result.githubDetails) {
    loadMainAction();
  }
});

// Sync button action
document.getElementById('sync-btn').addEventListener('click', async () => {
  const result = await chrome.storage.local.get('githubDetails');
  if (result.githubDetails) {
    const { username, repo, token } = result.githubDetails;

    // Decrypt stored details
    const decryptedUsername = decrypt(username);
    const decryptedRepo = decrypt(repo);
    const decryptedToken = decrypt(token);

    // Use these details for the GitHub push logic
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          func: pushToGitHub,
          args: [decryptedUsername, decryptedRepo, decryptedToken],
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error("Script execution error:", chrome.runtime.lastError);
          } else {
            console.log("GitHub push script executed successfully.");
          }
        }
      );
    });
  } else {
    alert('GitHub details not found. Please set them up first.');
  }
});

// Function to extract content and push to GitHub
function pushToGitHub(username, repo, token) {
  const getXPathElement = (xpath) => {
    return document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  };

  const titleXPath = "/html/head/meta[9]";
  const codeXPath = "/html/body/div[1]/div[2]/div/div/div[4]/div/div/div[9]/div/div[2]/div[1]/div/div/div[1]/div[2]/div[1]/div[5]";
  const langXPath = "/html/body/div[1]/div[2]/div/div/div[4]/div/div/div[9]/div/div[1]/div[1]/div[1]/div/div/div[1]/div/button";

  const metaElement = getXPathElement(titleXPath);
  const codeElement = getXPathElement(codeXPath);
  const langElement = getXPathElement(langXPath);

  const titleContent = metaElement?.getAttribute("content") || "Title not found";
  const questionMarkIndex = titleContent.indexOf("?");
  const dashIndex = titleContent.indexOf("-");
  const title =
    questionMarkIndex !== -1 && dashIndex !== -1 && dashIndex > questionMarkIndex
      ? titleContent.substring(questionMarkIndex + 1, dashIndex).trim()
      : "Title extraction failed";

  const question = dashIndex !== -1 ? titleContent.substring(dashIndex + 1).trim() : "Question not found";
  const code = codeElement?.innerText.trim() || "Code not found";
  const language = langElement?.innerText.trim() || "Language unknown";
  const currentURL = window.location.href;

  const fileContent = `Title:\n${title}\n\n-------------------------------\n\nQuestion:\n${question}\n\n-------------------------------\n\nLanguage:\n${language}\n\n-------------------------------\n\nCode:\n${code}\n\n-------------------------------\n\nURL:\n${currentURL}`;
  const fileName = `${title.replace(/\s+/g, "_")}_leetcode.txt`;

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${fileName}`;
  const encodedContent = btoa(fileContent);

  fetch(apiUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response.status === 404) {
        // File doesn't exist, create it
        return fetch(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Adding ${fileName}`,
            content: encodedContent,
          }),
        });
      } else if (response.ok) {
        // File exists, get its SHA and update it
        return response.json().then((data) => {
          const sha = data.sha;
          return fetch(apiUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Updating ${fileName}`,
              content: encodedContent,
              sha: sha,
            }),
          });
        });
      } else {
        throw new Error("Failed to check file existence.");
      }
    })
    .then((response) => {
      if (response.ok) {
        console.log("File successfully pushed to GitHub.");
        alert("File successfully pushed to GitHub!");
      } else {
        console.error("Failed to push file to GitHub.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    });
}
