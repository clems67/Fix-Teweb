window.onload = function () {
  let buttonFacturable = document.getElementById("buttonFacturable");
  let buttonNonFacturable = document.getElementById("buttonNonFacturable");
  let buttonAbsence = document.getElementById("buttonAbsence");
  let projectList =  document.getElementById("favoritSelectList");
  let addFavoriteButton = document.getElementById("addFavoriteButton");
  let deleteFavoriteButton = document.getElementById("deleteFavoriteButton");

  buttonFacturable.addEventListener("click", GetProjectListFacturable);
  buttonNonFacturable.addEventListener("click", GetProjectListNonFacturable);
  buttonAbsence.addEventListener("click", GetProjectListAbscence);
  projectList.addEventListener("dblclick", insertOption);
  addFavoriteButton.addEventListener("click", AddToFavorite);
  deleteFavoriteButton.addEventListener("click", DeleteFavorite);
};

changeActivitySelected(whichActivityIsSelected())

function GetProjectListFacturable() {
  changeActivitySelected("facturable");
}

function GetProjectListNonFacturable() {
  changeActivitySelected("nonFacturable");
}

function GetProjectListAbscence() {
  changeActivitySelected("absFormDeleg");
}

function changeActivitySelected(activity) {
  localStorage.setItem("activitySelected", activity);
  buttonFacturable.style = "border-width: 2px; border-color: black;";
  buttonNonFacturable.style = "border-width: 2px; border-color: black;";
  buttonAbsence.style = "border-width: 2px; border-color: black;";
  switch (activity) {
    case "facturable":
      buttonFacturable.style = "border-width: 5px; border-color: green;";
      break;
    case "nonFacturable":
      buttonNonFacturable.style = "border-width: 5px; border-color: green;";
      break;
    case "absFormDeleg":
      buttonAbsence.style = "border-width: 5px; border-color: green;";
      break;
  }
  ClearHtmlSelect();
  GetFavoriteProjectList(activity);
}

function GetFavoriteProjectList(activity) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "get_favorite",
      activityType: activity,
    });
    console.log("response to get favorite list :");
    console.log(response);
    const htmlList = document.getElementById("favoritSelectList");
    const favoriteList = JSON.parse(response.favoritList);
    if (favoriteList.length > 0) {
      favoriteList.forEach((item) => {
        var option = document.createElement("option");
        option.text = item[0].buText + " | " + item[0].projectText;
        option.value = item[0].id;
        htmlList.add(option);
      });
    } else {
      var option = document.createElement("option");
      option.text = "aucun favoris trouvé pour l'activité sélectionné";
      htmlList.add(option);
    }
  })();
}

function AddToFavorite() {
  const lineNumberSelected = document.getElementById("lineNumber").value;
  console.log("add_favorite : sendInfosToMain");
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "save_favorite",
      activityType: whichActivityIsSelected(),
      lineNumber: lineNumberSelected,
    });
    console.log(response);
  })();
}

function DeleteFavorite() {
  const htmlSelect = document.getElementById("favoritSelectList");
  const selectedProject = htmlSelect.options[htmlSelect.selectedIndex];
  var dialog = confirm(
    "Voulez-vous vraiment supprimer le favoris :\n" + selectedProject.text
  );
  if (dialog) {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tab.id, {
        responseType: "delete_favorite",
        selectedProject: selectedProject.value,
      });
    })();
    ClearHtmlSelect();
    GetFavoriteProjectList(whichActivityIsSelected());
  }
}

function insertOption() {
  let projectList =  document.getElementById("favoritSelectList");
  let valueToSend = projectList[projectList.selectedIndex].text;
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, {
        responseType: "insertProject",
        activityType: whichActivityIsSelected(),
        BU: valueToSend.substring(0, 8),
        project: valueToSend.substring(11, valueToSend.length),
      });
    });
  });
}

function ClearHtmlSelect() {
  const list = document.getElementById("favoritSelectList");
  const listLenght = list.options.length - 1;
  for (var i = listLenght; i >= 0; i--) {
    list.remove(i);
  }
}

function whichActivityIsSelected() {
  return localStorage.getItem("activitySelected");
}

