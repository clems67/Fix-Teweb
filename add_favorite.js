console.log("le fichier add_favorite fonctionne");
window.onload = function () {
  document.getElementById("submit").addEventListener("click", AddToFavorite);
  document.getElementById("escape").addEventListener("click", ReturnMainPopup);
};

function ReturnMainPopup() {
  window.location.href = "popup.html";
}

function AddToFavorite() {
  const activityTypeSelected = document.getElementById("activityType").value;
  const lineNumberSelected = document.getElementById("lineNumber").value;

  sendInfosToMain(activityTypeSelected, lineNumberSelected);
}

function sendInfosToMain(activityTypeSelected, lineNumberSelected) {
  console.log("add_favorite : sendInfosToMain");

  chrome.runtime.sendMessage("", function (response) {});

  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "save_favorite",
      activityType: activityTypeSelected,
      lineNumber: lineNumberSelected,
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
}
