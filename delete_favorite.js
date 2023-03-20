console.log("delete_favorite.js");

GetFavoriteProjectList();

window.onload = function () {
  document.getElementById("submit").addEventListener("click", DeleteFavorite);
  document.getElementById("escape").addEventListener("click", ReturnMainPopup);
};

function ReturnMainPopup() {
  window.location.href = "popup.html";
}

function GetFavoriteProjectList() {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "get_favorite",
    });
    console.log("response to get favorite list from delete_favorite :");
    console.log(response);
    const htmlList = document.getElementById("favoritSelectList");
    const favoriteList = JSON.parse(response.favorites);
    if (favoriteList.length > 0) {
      favoriteList.forEach((item) => {
        if (item.activityType !== null) {
          var option = document.createElement("option");
          option.text = item[0].buText + " - " + item[0].projectText;
          option.value = item[0].id;
          htmlList.add(option);
        }
      });
      DisplayList(true);
    } else {
      DisplayList(false);
    }
  })();
}

function DeleteFavorite() {
  const htmlSelect = document.getElementById("favoritSelectList");
  const selectedProject = htmlSelect.options[htmlSelect.selectedIndex];
  var dialog = confirm(
    "Voulez-vous vraiment supprimer le favoris :\n" + selectedProject.text
  );
  if (dialog) {
    SendInfosToMain(selectedProject.value);
    ClearHtmlSelect();
    GetFavoriteProjectList();
  }
}

function SendInfosToMain(Project) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "delete_favorite",
      selectedProject: Project,
    });
  })();
}

function ClearHtmlSelect() {
  const list = document.getElementById("favoritSelectList");
  const listLenght = list.options.length - 1;
  for (var i = listLenght; i >= 0; i--) {
    list.remove(i);
  }
}

function DisplayList(value) {
  if (value) {
    document
      .querySelectorAll(".displayWhenNoFavorite")
      .forEach((e) => (e.style.display = "none"));
    document
      .querySelectorAll(".hideWhenNoFavorite")
      .forEach((e) => (e.style.display = ""));
  } else {
    document
      .querySelectorAll(".displayWhenNoFavorite")
      .forEach((e) => (e.style.display = ""));
    document
      .querySelectorAll(".hideWhenNoFavorite")
      .forEach((e) => (e.style.display = "none"));
  }
}
