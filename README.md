# NOTE
Make sure to get your own Gemini 2.0 Flash API key and input it into  the text in popup.js.

# Usages
StudyBR aims to provide a seamless study experience by combining focus management, quick note-taking, and AI-powered page summarization. Whether you're reviewing a webpage, need a break between tasks, or just want to keep track of your notes, StudyBR makes it easy.

## Pomodoro Timer
A customizable Pomodoro timer to help users focus on their work in intervals.

## AI Page Summarizer
Automatically summarizes web page content or user-input text using AI-powered summarization.

## Quick Notes Sidebar
A sidebar to quickly jot down notes and save them for later reference.

# Code Explanation
 ## manifest.json
The manifest file that defines the extension's properties, including permissions, background script, popup, and icons. It specifies permissions such as storage and activeTab.
It also registers a service worker (background.js) and defines the popup and icon for the extension.
## background.js
Handles background tasks such as starting, pausing, and resetting the Pomodoro timer. Uses chrome.storage.local to store the state of the timer and sync it across sessions.
Responds to messages from the popup and manages the timer interval.
## popup.html
Average HTML file with tabs for each activity.
## popup.js
Contains the JavaScript logic for the popup interface. Handles user interactions such as starting the timer, summarizing content, and saving notes.
Also includes logic for managing the tab selection (Pomodoro, Summarizer, and Notes). Handles communication with the background script to start, pause, or reset the timer.
popup.css contains the animations for the buttons and textboxes as well as colors.

![image](https://github.com/user-attachments/assets/5fa030a8-93bf-4149-8d6e-c15b22f968c3)

![image](https://github.com/user-attachments/assets/cffd4ab1-42b6-4350-b809-63f427167c85)

![image](https://github.com/user-attachments/assets/ec468ccc-0f93-4b93-a8ce-856feb6c949d)

![image](https://github.com/user-attachments/assets/9c430e71-2b69-45d2-be64-34fb1288a03e)

![image](https://github.com/user-attachments/assets/728eae91-1b4b-4b12-b22c-ffbc8c1017d8)

![image](https://github.com/user-attachments/assets/52445c81-7e35-4e1e-a94d-8976b2d2afb0)
