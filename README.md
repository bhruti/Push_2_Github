# Push 2 GitHub Extension (works with Chrome, Edge, Brave)

A browser extension that automates the process of pushing your LeetCode solutions to a GitHub repository. It includes the question title, description, solution code, Solution Language and the Question URL and organizes files by question name.

---

## Features
- Automatically extracts question titles, descriptions, and your solution code from the LeetCode editor.
- Pushes the extracted content to your GitHub repository.

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/leetcode-to-github-extension.git
   cd leetcode-to-github-extension
   ```

2. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`.
   - Enable **Developer mode** (top-right corner).
   - Click **Load unpacked** and select the project directory.


---

## Usage

1. Open any LeetCode problem in your browser and sign in to your account.
2. Write your solution in the LeetCode editor.
3. Click the extension icon in Browser's toolbar and select **Push 2 GitHub**. Youwill see something like below.
   
   ![image](https://github.com/user-attachments/assets/aeaa1723-6735-42c7-b3bb-6b907eaedcfe)
   
4. Fill your github userid, reponame and the access token and click save.
5. Your details are saved and henceforth you will see screen like below.
   
   ![image](https://github.com/user-attachments/assets/9e377482-e8d0-46e1-891e-f3bbda0fc87c)
   
   You can directly push you codes to yor repo with previously saved details.
6. The solution will be saved in your GitHub repository in the following format in a text file.
   ```
     - Title        : Question title
     - Description  : Question Description
     - Code         : Your Solution
     - Language     : Language of yor solution
     - URL          : Link of the question
   ```

---

## Folder Structure

```
Push 2 Github/
├── manifest.json        # Chrome extension manifest file
├── popup.html           # Extension's popup HTML
├── popup.js             # JavaScript for functionality
├── popup.css           # Styling for popup
├── logo.png            # Stores GitHub repository details
└── README.md            # Project documentation

```

---

## Prerequisites

- A GitHub account with a repository.
- A personal access token with `repo` permissions (generate [here](https://github.com/settings/tokens))
- Basic familiarity with LeetCode and Chrome extensions
- 
---

## Credits

Developed by [Bhruti](https://github.com/bhruti).
