InitiateSearchBars();

let numberLinefacturable = 1;
let numberLinenonFacturable = 1;
let numberLineabsFormDeleg = 1;

let tempoSetInterval = [
  //tempoSetInterval[1] => old value of the input
  ["inputBuFacturable", "", "bu", "facturable"],
  ["inputBuNonFacturable", "", "bu", "nonFacturable"],
  ["inputBuNonAbsForm", "", "bu", "absFormDeleg"],
  ["inputProjectFacturable", "", "project", "facturable"],
  ["inputProjectNonFactu", "", "project", "nonFacturable"],
  ["inputProjectAbsForm", "", "project", "absFormDeleg"],
];

loop = setInterval(() => {
  let measureTime = new Date().getTime();
  RemoveMarginTop();
  for (const element of tempoSetInterval) {
    const inputValue = document.getElementById(element[0]).value;
    if (inputValue !== element[1] || DidNumberOfLineChanged(element[3])) {
      FilterAllRows(element[2], element[3]);
      element[1] = inputValue;
    } else {
      if (!AreFirstOptionInFavorite(element[3], element[2])) {
        MoveAllFavoritsOnTop(element[3], element[2]);
      }
    }
  }
  if (new Date().getTime() - measureTime > 10) {
    console.log(
      "time taken by the loop :" + (new Date().getTime() - measureTime)
    );
  }
}, 200);

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  console.log("listener worked ! its response :");
  console.log(response);
  switch (response.responseType) {
    case "save_favorite":
      console.log("c'est passé dans le save_favorite");
      GetInfosAndStore(response);
      break;
    case "get_favorite":
      console.log("c'et passé dans le get_favorite");
      console.log(JSON.stringify(GetAllFavoriteProjectList()));
      sendResponse({ favorites: JSON.stringify(GetAllFavoriteProjectList()) });
      break;
    case "delete_favorite":
      console.log("c'est passé dans le delete_favorite");
      DeleteFavorite(response.selectedProject);
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : main.js adListener");
  }
});

function DidNumberOfLineChanged(activityType) {
  let nbLineToTest;
  let oldNbOfLine;
  switch (activityType) {
    case "facturable":
      nbLineToTest = document.getElementById(
        "ctl00_cph_a_GridViewActivitesFacturables"
      ).rows.length;
      oldNbOfLine = numberLinefacturable;
      numberLinefacturable = nbLineToTest;
      break;
    case "nonFacturable":
      nbLineToTest = document.getElementById(
        "ctl00_cph_a_GridViewActivitesNonFacturables"
      ).rows.length;
      oldNbOfLine = numberLinenonFacturable;
      numberLinenonFacturable = nbLineToTest;
      break;
    case "absFormDeleg":
      nbLineToTest = document.getElementById(
        "ctl00_cph_a_GridViewAbsenceFormation"
      ).rows.length;
      oldNbOfLine = numberLineabsFormDeleg;
      numberLineabsFormDeleg = nbLineToTest;
      break;
    default:
      console.log("ERREUR FilterAllRows activityType");
  }
  return nbLineToTest !== oldNbOfLine;
}

function FilterAllRows(buOrProject, activityType) {
  let nbLineToFilter;
  let filter;
  let tempoFilterAllRows = [
    ["inputBuFacturable", "inputProjectFacturable"],
    ["inputBuNonFacturable", "inputProjectNonFactu"],
    ["inputBuNonAbsForm", "inputProjectAbsForm"],
  ];
  switch (activityType) {
    case "facturable":
      nbLineToFilter = document.getElementById(
        "ctl00_cph_a_GridViewActivitesFacturables"
      ).rows.length;
      tempoFilterAllRows = tempoFilterAllRows[0];
      break;
    case "nonFacturable":
      nbLineToFilter = document.getElementById(
        "ctl00_cph_a_GridViewActivitesNonFacturables"
      ).rows.length;
      tempoFilterAllRows = tempoFilterAllRows[1];
      break;
    case "absFormDeleg":
      nbLineToFilter = document.getElementById(
        "ctl00_cph_a_GridViewAbsenceFormation"
      ).rows.length;
      tempoFilterAllRows = tempoFilterAllRows[2];
      break;
    default:
      console.log("ERREUR FilterAllRows activityType");
  }
  if (buOrProject === "bu") {
    filter = tempoFilterAllRows[0];
  } else if (buOrProject === "project") {
    filter = tempoFilterAllRows[1];
  } else {
    console.log("ERREUR FilterAllRows buOrProject");
  }
  console.log("filter :" + filter);
  for (var i = 1; i < nbLineToFilter; i++) {
    if (buOrProject === "bu") {
      console.log("the filter :" + filter);
      console.log(document.getElementById(filter).value);
      Filter(
        getBuOptionId(activityType, i),
        document.getElementById(filter).value
      );
    } else if (buOrProject === "project") {
      Filter(
        getProjectOptionId(activityType, i),
        document.getElementById(filter).value
      );
    }
  }
}

function Filter(selectId, filter) {
  console.log("select id :" + selectId);
  const select = document.getElementById(selectId);
  const selectList = document.getElementById(selectId).options;
  const filterString = ".*" + filter + ".*";
  const filterReg = new RegExp(filterString.toLowerCase());
  console.log("filter :" + filterReg);
  for (let item of selectList) {
    if (item.text.toLowerCase().match(filterReg)) {
      item.style.display = "";
      select.insertBefore(item, select.firstChild);
    } else {
      item.style.display = "none";
    }
  }
}

function AreFirstOptionInFavorite(activityType, buOrProject) {
  let tempo = [
    ["facturable", "ctl00_cph_a_GridViewActivitesFacturables"],
    ["nonFacturable", "ctl00_cph_a_GridViewActivitesNonFacturables"],
    ["absFormDeleg", "ctl00_cph_a_GridViewAbsenceFormation"],
  ];
  switch (activityType) {
    case "facturable":
      tempo = tempo[0];
      break;
    case "nonFacturable":
      tempo = tempo[1];
      break;
    case "absFormDeleg":
      tempo = tempo[2];
      break;
    default:
      console.log("ERREUR AreFirstOptionInFavorite activity type");
  }
  let tablerows = document.getElementById(tempo[1]).rows.length;
  if (buOrProject === "bu") {
    for (var i = 1; i < tablerows; i++) {
      if (!IsFirstBUInFavorite(getBuOptionId(tempo[0], i), tempo[0])) {
        return false;
      }
    }
  } else if (buOrProject === "project") {
    for (var i = 1; i < tablerows; i++) {
      if (
        !IsFirstProjectInFavorite(getProjectOptionId(tempo[0], i), tempo[0])
      ) {
        return false;
      }
    }
  } else {
    console.log("ERREUR AreFirstOptionInFavorite buOrProject");
  }

  return true;
}

function MoveAllFavoritsOnTop(activityType, buOrProject) {
  let tablerows;
  switch (activityType) {
    case "facturable":
      tablerows = document.getElementById(
        "ctl00_cph_a_GridViewActivitesFacturables"
      ).rows.length;
      break;
    case "nonFacturable":
      tablerows = document.getElementById(
        "ctl00_cph_a_GridViewActivitesNonFacturables"
      ).rows.length;
      break;
    case "absFormDeleg":
      tablerows = document.getElementById(
        "ctl00_cph_a_GridViewAbsenceFormation"
      ).rows.length;
      break;
    default:
      console.log("ERREUR MoveAllFavoritsOnTop activityType");
  }
  switch (buOrProject) {
    case "bu":
      for (var i = 1; i < tablerows; i++) {
        MoveFavoritsOnTop(
          buOrProject,
          getBuOptionId(activityType, i),
          activityType
        );
        MoveFavoritsOnTop(
          buOrProject,
          getBuOptionId(activityType, i),
          activityType
        );
      }
      break;
    case "project":
      for (var i = 1; i < tablerows; i++) {
        MoveFavoritsOnTop(
          buOrProject,
          getProjectOptionId(activityType, i),
          activityType
        );
        MoveFavoritsOnTop(
          buOrProject,
          getProjectOptionId(activityType, i),
          activityType
        );
      }
      break;
    default:
      console.log("ERREUR MoveAllFavoritsOnTop buOrProject");
  }
}

function IsFirstBUInFavorite(BUOptionValue, activityType) {
  const favoriteListBU = GetPartialFavoriteList("buValue", activityType);
  const selectBU = document.getElementById(BUOptionValue);
  if (favoriteListBU.length === 0) {
    return true;
  }
  if (!favoriteListBU.includes(selectBU.options[0].value)) {
    console.log("select bu not included :" + selectBU.options[0].value);
  }
  return favoriteListBU.includes(selectBU.options[0].value);
}

function IsFirstProjectInFavorite(BUOptionValue, activityType) {
  const favoriteListProject = GetPartialFavoriteList(
    "projectValue",
    activityType
  );
  const selectProject = document.getElementById(BUOptionValue);
  if (favoriteListProject.length === 0) {
    return true;
  }
  return favoriteListProject.includes(selectProject.options[0].value);
}

function MoveFavoritsOnTop(BUorProject, selectOption, activityType) {
  let favoriteList;
  switch (BUorProject) {
    case "bu":
      favoriteList = GetPartialFavoriteList("buValue", activityType);
      break;
    case "project":
      favoriteList = GetPartialFavoriteList("projectValue", activityType);
      break;
    default:
      console.log("ERREUR MoveFavoritsOnTop");
  }
  const select = document.getElementById(selectOption);
  if (favoriteList.length !== 0) {
    for (let item of select) {
      if (favoriteList.includes(item.value)) {
        select.insertBefore(item, select.firstChild);
        select.options[0].style = "font-weight:bold";
      }
    }
  }
}

function GetAllFavoriteProjectList() {
  let returnedArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    const jsonValue = JSON.parse(localStorage.getItem(localStorage.key(i)));
    jsonValue[0].id = localStorage.key(i);
    returnedArray.push(jsonValue);
  }
  return returnedArray;
}

function GetPartialFavoriteList(wantedValue, activityType) {
  let favoriteList = [];
  for (var i = 0; i < localStorage.length; i++) {
    const jsonValue = JSON.parse(localStorage.getItem(localStorage.key(i)))[0];
    if (jsonValue.activityType === activityType) {
      //"facturable" - "nonFacturable" - "absFormDeleg"
      favoriteList.push(jsonValue[wantedValue]);
    }
  }
  return favoriteList;
}

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
    {
      buText: buSelected.options[buSelected.selectedIndex].text,
      buValue: buSelected.value,
      projectText: projectSelected.options[projectSelected.selectedIndex].text,
      projectValue: projectSelected.value,
      activityType: response.activityType,
    },
  ];
  const jsonToStore = JSON.stringify(arrayToStore);
  var dialog = confirm(
    "Voulez-vous enregistrer le projet :\n" +
      arrayToStore[0].projectText +
      "\navec le code BU :\n" +
      arrayToStore[0].buText
  );

  if (dialog) {
    localStorage.setItem("id" + new Date().getTime(), jsonToStore);
  }
}

function DeleteFavorite(projectId) {
  localStorage.removeItem(projectId);
}

function getBuOptionId(activityType, lineNumber) {
  //la première ligne est tjrs 102
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
  //la première ligne est tjrs 102
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

function InitiateSearchBars() {
  let inputBU = document.createElement("input");
  inputBU.id = "inputBuFacturable";
  inputBU.style = "width: 97px;margin-left: 16.8px;";
  inputBU.placeholder = "Filtre BU";
  let inputProject = document.createElement("input");
  inputProject.id = "inputProjectFacturable";
  inputProject.style = "width:265px";
  inputProject.placeholder = "Filtre Projets";
  let activityNode = document.getElementById(
    "ctl00_cph_a_UpdPnlGdwFacturables"
  );
  let parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBU, activityNode);
  parentDiv.insertBefore(inputProject, activityNode);

  inputBU = document.createElement("input");
  inputBU.id = "inputBuNonFacturable";
  inputBU.style = "width: 97px;margin-left: 16.8px;margin-top:10px";
  inputBU.placeholder = "Filtre BU";
  inputProject = document.createElement("input");
  inputProject.id = "inputProjectNonFactu";
  inputProject.style = "width:265px";
  inputProject.placeholder = "Filtre Projets";
  activityNode = document.getElementById("ctl00_cph_a_UpdPnlGdwIndirects");
  parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBU, activityNode);
  parentDiv.insertBefore(inputProject, activityNode);

  inputBU = document.createElement("input");
  inputBU.id = "inputBuNonAbsForm";
  inputBU.style = "width: 97px;margin-left: 16.8px;margin-top:10px";
  inputBU.placeholder = "Filtre BU";
  inputProject = document.createElement("input");
  inputProject.id = "inputProjectAbsForm";
  inputProject.style = "width:265px";
  inputProject.placeholder = "Filtre Projets";
  activityNode = document.getElementById("ctl00_cph_a_UpdPnlGdwAbsences");
  parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBU, activityNode);
  parentDiv.insertBefore(inputProject, activityNode);

  RemoveMarginTop();
}

function RemoveMarginTop() {
  document.getElementById("ctl00_cph_a_GridViewActivitesFacturables").style =
    "margin-top:0";
  document.getElementById("ctl00_cph_a_GridViewActivitesNonFacturables").style =
    "margin-top:0";
  document.getElementById("ctl00_cph_a_GridViewAbsenceFormation").style =
    "margin-top:0";
}
