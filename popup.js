window.onload = function () {
  document.getElementById("submit").addEventListener("click", sendInfosToMain);
};

function sendInfosToMain() {
  console.log("button hello works");

  chrome.runtime.sendMessage("", function (response) {});

  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const activityTypeSelected = document.getElementById("activityType").value;
    const lineNumberSelected = document.getElementById("lineNumber").value;
    const BuSelected = document.getElementById("BUnb").value;
    const ProjectSelected = document.getElementById("projectID").value;

    const response = await chrome.tabs.sendMessage(tab.id, {
      activityType: activityTypeSelected,
      lineNumber: lineNumberSelected,
      BuValue: BuSelected,
      ProjectNumber: ProjectSelected,
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
}
