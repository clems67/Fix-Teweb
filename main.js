console.log("hello from main.js");

loop = setInterval(() => {
  if (localStorage.getItem("don't delete me please") === null) {
    //console.log("local storage null");
    localStorage.setItem("don't delete me please", "false");
    document.body.style.border = "10px solid orange";
  } else if (localStorage.getItem("don't delete me please") === "true") {
    document.body.style.border = "10px solid green";
    if (isFirstOptionStyleDisplay("")) {
      ShowOnlyFavoritesBU();
      ShowOnlyFavoritesProjects();
      console.log("local storage true");
    }
  } else if (localStorage.getItem("don't delete me please") === "false") {
    document.body.style.border = "10px solid orange";
    if (isFirstOptionStyleDisplay("none")) {
      ShowAllBU();
      ShowAllProjects();
      console.log("local storage false");
    }
  } else {
    console.log("ERROR UNEXPECTED LOOP MAIN");
  }
}, 100);

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  console.log("listener worked ! its response :");
  console.log(response);
  switch (response.responseType) {
    case "toggle_true":
      console.log("c'est passé dans le toggle_true");
      localStorage.setItem("don't delete me please", "true");
      break;
    case "toggle_false":
      console.log("c'est passé dans le toggle_false");
      localStorage.setItem("don't delete me please", "false");
      break;
    case "save_favorite":
      console.log("c'est passé dans le save_favorite");
      GetInfosAndStore(response);
      break;
    case "get_favorite":
      console.log("c'et passé dans le get_favorite");
      sendResponse({ favorites: GetFavoriteProjectList() });
      break;
    case "delete_favorite":
      console.log("c'est passé dans le delete_favorite");
      DeleteFavorite(response.selectedProject);
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : main.js adListener");
  }
});

function GetInfosAndStore(response) {
  const buOptionName = getBuOptionId(
    response.activityType,
    response.lineNumber
  );

  const projectOptionName = getProjectOptionId(
    response.activityType,
    response.lineNumber
  );

  const buSelected = document.getElementById(buOptionName);
  const projectSelected = document.getElementById(projectOptionName);

  const arrayToStore = [
    buSelected.options[buSelected.selectedIndex].text, //inner html
    buSelected.value, //option value
    projectSelected.options[projectSelected.selectedIndex].text, //inner html
    projectSelected.value, //option value
    response.activityType,
  ];
  const jsonToStore = JSON.stringify(arrayToStore);

  var dialog = confirm(
    "Voulez-vous enregistrer le projet :\n" +
      arrayToStore[2] +
      "\navec le code BU :\n" +
      arrayToStore[0]
  );

  if (dialog) {
    localStorage.setItem(
      projectSelected.options[projectSelected.selectedIndex].text,
      jsonToStore
    );
  }
}

function GetFavoriteProjectList() {
  var favoriteList = [];
  console.log("favorite list :");
  for (var i = 0; i < localStorage.length; i++) {
    const jsonValue = JSON.parse(localStorage.getItem(localStorage.key(i)));
    favoriteList[i] = jsonValue[2];
  }
  return JSON.stringify(favoriteList);
}

function DeleteFavorite(projectName) {
  localStorage.removeItem(projectName);
}

function ShowAllBU() {
  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayTrue(getBuOptionId("facturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayTrue(getBuOptionId("nonFacturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewAbsenceFormation"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayTrue(getBuOptionId("absFormDeleg", i));
  }
}

function ShowAllProjects() {
  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayTrue(getProjectOptionId("facturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayTrue(getProjectOptionId("nonFacturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewAbsenceFormation"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayTrue(getProjectOptionId("absFormDeleg", i));
  }
}

function ShowOnlyFavoritesBU() {
  //get infos from local storage
  var favoriteListFacturable = [];
  var favoriteListNonFacturable = [];
  var favoriteListAbsFormDeleg = [];
  for (var i = 0; i < localStorage.length; i++) {
    const jsonValue = JSON.parse(localStorage.getItem(localStorage.key(i)));
    switch (jsonValue[4]) {
      case "facturable":
        favoriteListFacturable.push(jsonValue[1]);
        break;
      case "nonFacturable":
        favoriteListNonFacturable.push(jsonValue[1]);
        break;
      case "absFormDeleg":
        favoriteListAbsFormDeleg.push(jsonValue[1]);
        break;
    }
  }
  //make only favorite elements visible
  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayNone(favoriteListFacturable, getBuOptionId("facturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayNone(
      favoriteListNonFacturable,
      getBuOptionId("nonFacturable", i)
    );
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewAbsenceFormation"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayNone(favoriteListAbsFormDeleg, getBuOptionId("absFormDeleg", i));
  }
}

function ShowOnlyFavoritesProjects() {
  //get infos from local storage
  var favoriteList = [];
  for (var i = 0; i < localStorage.length; i++) {
    const jsonValue = JSON.parse(localStorage.getItem(localStorage.key(i)));
    favoriteList[i] = jsonValue[3];
  }
  //make only favorite elements visible
  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayNone(favoriteList, getProjectOptionId("facturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayNone(favoriteList, getProjectOptionId("nonFacturable", i));
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewAbsenceFormation"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    MakeDisplayNone(favoriteList, getProjectOptionId("absFormDeleg", i));
  }
}

function MakeDisplayTrue(optionID) {
  var select = document.getElementById(optionID);
  for (var i = 0; i < select.length; i++) {
    select.options[i].style.display = "";
  }
}

function MakeDisplayNone(favoriteList, optionID) {
  var select = document.getElementById(optionID);
  for (var i = 0; i < select.length; i++) {
    if (!favoriteList.includes(select.options[i].value)) {
      select.options[i].style.display = "none";
    }
  }
}

function getBuOptionId(activityType, lineNumber) {
  const line = 1 + Number(lineNumber);
  if (activityType == "facturable") {
    return (
      "ctl00_cph_a_GridViewActivitesFacturables_ctl0" + line + "_ddlCodeBU"
    );
  } else if (activityType == "nonFacturable") {
    return (
      "ctl00_cph_a_GridViewActivitesNonFacturables_ctl0" + line + "_ddlCodeBU"
    );
  } else if (activityType == "absFormDeleg") {
    return "ctl00_cph_a_GridViewAbsenceFormation_ctl0" + line + "_ddlCodeBU";
  }
}

function getProjectOptionId(activityType, lineNumber) {
  const line = 1 + Number(lineNumber);
  if (activityType == "facturable") {
    return (
      "ctl00_cph_a_GridViewActivitesFacturables_ctl0" + line + "_ddlProjet"
    );
  } else if (activityType == "nonFacturable") {
    return (
      "ctl00_cph_a_GridViewActivitesNonFacturables_ctl0" + line + "_ddlProjet"
    );
  } else if (activityType == "absFormDeleg") {
    return "ctl00_cph_a_GridViewAbsenceFormation_ctl0" + line + "_ddlProjet";
  }
}

//if the first option "--Choisir BU--" or "--Choisir Projet--" has the same style.display as displayStyle => return true
function isFirstOptionStyleDisplay(displayStyle) {
  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    if (
      document.getElementById(getBuOptionId("facturable", i)).options[0].style
        .display === displayStyle ||
      document.getElementById(getProjectOptionId("facturable", i)).options[0]
        .style.display === displayStyle
    ) {
      return true;
    }
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    if (
      document.getElementById(getBuOptionId("nonFacturable", i)).options[0]
        .style.display === displayStyle ||
      document.getElementById(getProjectOptionId("nonFacturable", i)).options[0]
        .style.display === displayStyle
    ) {
      return true;
    }
  }

  var tablerows = document.getElementById(
    "ctl00_cph_a_GridViewAbsenceFormation"
  ).rows;
  for (var i = 1; i < tablerows.length; i++) {
    if (
      document.getElementById(getBuOptionId("absFormDeleg", i)).options[0].style
        .display === displayStyle ||
      document.getElementById(getProjectOptionId("absFormDeleg", i)).options[0]
        .style.display === displayStyle
    ) {
      return true;
    }
  }
  return false;
}
