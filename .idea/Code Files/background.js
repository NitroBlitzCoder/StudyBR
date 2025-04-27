chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ timerState: 'paused', timerValue: 25 * 60 });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "startTimer") {
        startTimer();
    } else if (message.action === "pauseTimer") {
        pauseTimer();
    } else if (message.action === "resetTimer") {
        resetTimer();
    }
});

function startTimer() {
    chrome.storage.local.get(["timerValue", "timerState"], function(data) {
        if (data.timerState === "paused") {
            chrome.storage.local.set({ timerState: "running" });

            var timerValue = data.timerValue;
            var intervalId = setInterval(function() {
                if (timerValue > 0) {
                    timerValue--;
                    chrome.storage.local.set({ timerValue: timerValue });
                } else {
                    clearInterval(intervalId);
                    chrome.storage.local.set({ timerState: "paused", timerValue: 25 * 60 });
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "StudyBR.png",
                        title: "StudyBR",
                        message: "Time's up!"
                    });
                }
            }, 1000);
        }
    });
}

function pauseTimer() {
    chrome.storage.local.set({ timerState: "paused" });
}

function resetTimer() {
    chrome.storage.local.set({ timerValue: 25 * 60, timerState: "paused" });
}
