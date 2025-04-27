// Tabs
const pomodoroTab = document.getElementById("pomodoroTab");
const summarizerTab = document.getElementById("summarizerTab");
const notesTab = document.getElementById("notesTab");

const pomodoroContent = document.getElementById("pomodoroContent");
const summarizerContent = document.getElementById("summarizerContent");
const notesContent = document.getElementById("notesContent");

pomodoroTab.addEventListener("click", function() {
    pomodoroContent.style.display = "block";
    summarizerContent.style.display = "none";
    notesContent.style.display = "none";
});

summarizerTab.addEventListener("click", function() {
    pomodoroContent.style.display = "none";
    summarizerContent.style.display = "block";
    notesContent.style.display = "none";
});

notesTab.addEventListener("click", function() {
    pomodoroContent.style.display = "none";
    summarizerContent.style.display = "none";
    notesContent.style.display = "block";
});

// Pomodoro Timer
let timer;
let timeLeft = 25 * 60;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener("click", function() {
    if (!timer) {
        timer = setInterval(function() {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimer();
            } else {
                clearInterval(timer);
                timer = null;
                alert("Time's up!");
            }
        }, 1000);
    }
});

resetBtn.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateTimer();
});

updateTimer();

// Summarizer
const summarizeBtn = document.getElementById("summarize");
const inputText = document.getElementById("inputText");
const summaryResult = document.getElementById("summaryResult");
const manualInputCheckbox = document.getElementById("manualInputCheckbox");

manualInputCheckbox.addEventListener("change", function() {
    if (manualInputCheckbox.checked) {
        inputText.style.display = "block";
    } else {
        inputText.style.display = "none";
    }
});

summarizeBtn.addEventListener("click", async function() {
    summaryResult.textContent = "Summarizing...";

    let text = "";

    if (manualInputCheckbox.checked) {
        text = inputText.value.trim();
        if (text.length === 0) {
            summaryResult.textContent = "No text to summarize.";
            return;
        }
    } else {
        text = await getPageContent();
        if (!text || text.trim().length === 0) {
            summaryResult.textContent = "Could not fetch page content.";
            return;
        }
    }

    const apiKey = "AIzaSyAe_iJ2w-Tplxov1LrbfRbymFmOrNeG_2Y";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [{
            parts: [{
                text: `Summarize this:\n${text}`
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            summaryResult.textContent = data.candidates[0].content.parts[0].text;
        } else {
            summaryResult.textContent = "Could not summarize.";
        }
    } catch (error) {
        summaryResult.textContent = "Error occurred.";
    }
});

// Get page text
async function getPageContent() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    func: () => document.body.innerText
                },
                (results) => {
                    if (chrome.runtime.lastError || !results || !results[0]) {
                        reject();
                    } else {
                        resolve(results[0].result);
                    }
                }
            );
        });
    });
}

// Notes
const notesArea = document.getElementById("notesArea");
const saveNotesBtn = document.getElementById("saveNotes");

chrome.storage.local.get("savedNotes", function(data) {
    if (data.savedNotes) {
        notesArea.value = data.savedNotes;
    }
});

saveNotesBtn.addEventListener("click", function() {
    const notes = notesArea.value;
    chrome.storage.local.set({ savedNotes: notes });
});
