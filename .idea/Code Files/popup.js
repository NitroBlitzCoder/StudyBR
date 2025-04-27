// Tabs
var tabs = ["pomodoro", "summarizer", "notes"];
tabs.forEach(function(tab) {
    document.getElementById(tab + "Tab").addEventListener("click", function() {
        tabs.forEach(function(t) {
            document.getElementById(t + "Content").style.display = t === tab ? "block" : "none";
        });
    });
});

// Timer
// Timer state stored in localStorage (so it persists across popups)
var timeLeft = localStorage.getItem('timeLeft') ? parseInt(localStorage.getItem('timeLeft')) : 25 * 60;
var timer = null;

// Update Timer function
function updateTimer() {
    var hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
    var minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
    var seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById("timer").textContent = hours + ":" + minutes + ":" + seconds;
}

// Start button
document.getElementById("start").addEventListener("click", function() {
    if (!timer) {
        timer = setInterval(function() {
            if (timeLeft > 0) {
                timeLeft--;
                localStorage.setItem('timeLeft', timeLeft); // Store timeLeft in localStorage
                updateTimer();
            } else {
                clearInterval(timer);
                timer = null;
                alert("Time's up!");
            }
        }, 1000);
    }
});

// Pause button
document.getElementById("pause").addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
});

// Reset button
document.getElementById("reset").addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
    timeLeft = (parseInt(document.getElementById("hoursInput").value) || 0) * 3600 +
        (parseInt(document.getElementById("minutesInput").value) || 0) * 60 +
        (parseInt(document.getElementById("secondsInput").value) || 0);
    localStorage.setItem('timeLeft', timeLeft); // Store the reset time
    updateTimer();
});

// Timer input change listener
["hoursInput", "minutesInput", "secondsInput"].forEach(function(id) {
    document.getElementById(id).addEventListener("change", function() {
        timeLeft = (parseInt(document.getElementById("hoursInput").value) || 0) * 3600 +
            (parseInt(document.getElementById("minutesInput").value) || 0) * 60 +
            (parseInt(document.getElementById("secondsInput").value) || 0);
        localStorage.setItem('timeLeft', timeLeft); // Store updated time
        clearInterval(timer);
        timer = null;
        updateTimer();
    });
});

updateTimer();

// Summarizer
document.getElementById("manualInputCheckbox").addEventListener("change", function() {
    document.getElementById("inputText").style.display = this.checked ? "block" : "none";
});

document.getElementById("summarize").addEventListener("click", function() {
    var summaryResult = document.getElementById("summaryResult");
    summaryResult.textContent = "Summarizing...";

    var text = "";
    var manualInputCheckbox = document.getElementById("manualInputCheckbox");
    if (manualInputCheckbox.checked) {
        text = document.getElementById("inputText").value.trim();
        if (text.length === 0) {
            summaryResult.textContent = "No text to summarize.";
            return;
        }
    } else {
        text = getPageContent();
        if (!text || text.trim().length === 0) {
            summaryResult.textContent = "Could not fetch page content.";
            return;
        }
    }

    var apiKey = "PUT YO API KEY HERE";
    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
    var body = {
        contents: [{
            parts: [{
                text: "Summarize this:\n" + text
            }]
        }]
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.candidates && data.candidates.length > 0) {
                summaryResult.textContent = data.candidates[0].content.parts[0].text;
            } else {
                summaryResult.textContent = "Could not summarize.";
            }
        })
        .catch(function(error) {
            summaryResult.textContent = "Error summarizing: " + error;
        });
});

function getPageContent() {
    return document.body.innerText || document.documentElement.innerText;
}

// Notes
document.getElementById("saveNotes").addEventListener("click", function() {
    var notes = document.getElementById("notesArea").value.trim();
    if (notes) {
        localStorage.setItem("notes", notes);
    }
});
