InitiateSearchBars();
RemoveMarginTop();

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

loopSearchBars = setInterval(() => {
  RemoveMarginTop();
  for (const element of tempoSetInterval) {
    const inputValue = document.getElementById(element[0]).value;
    if (inputValue !== element[1] || DidNumberOfLineChanged(element[3])) {
      FilterAllRows(element[2], element[3]);
      element[1] = inputValue;
    }
  }
}, 200);

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
  let tempoActivityType = [
    "ctl00_cph_a_GridViewActivitesFacturables",
    "ctl00_cph_a_GridViewActivitesNonFacturables",
    "ctl00_cph_a_GridViewAbsenceFormation",
  ];
  switch (activityType) {
    case "facturable":
      tempoActivityType = tempoActivityType[0];
      tempoFilterAllRows = tempoFilterAllRows[0];
      break;
    case "nonFacturable":
      tempoActivityType = tempoActivityType[1];
      tempoFilterAllRows = tempoFilterAllRows[1];
      break;
    case "absFormDeleg":
      tempoActivityType = tempoActivityType[2];
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
  nbLineToFilter = document.getElementById(tempoActivityType).rows.length;
  for (var i = 1; i < nbLineToFilter; i++) {
    console.log("the filter :" + filter);
    console.log(document.getElementById(filter).value);
    Filter(
      getOptionId(activityType, buOrProject, i),
      document.getElementById(filter).value
    );
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

function getOptionId(activityType, buORproject, lineNumber) {
  //la première ligne est tjrs 102
  const line = 1 + Number(lineNumber);
  let activityTypeData = [
    "ctl00_cph_a_GridViewActivitesFacturables_ctl0",
    "ctl00_cph_a_GridViewActivitesNonFacturables_ctl0",
    "ctl00_cph_a_GridViewAbsenceFormation_ctl0",
  ];
  let activity;
  switch (activityType) {
    case "facturable":
      activity = activityTypeData[0];
      break;
    case "nonFacturable":
      activity = activityTypeData[1];
      break;
    case "absFormDeleg":
      activity = activityTypeData[2];
      break;
    default:
      console.log("ERREUR getOptionId activityType");
  }
  if (buORproject === "bu") {
    return activity + line + "_ddlCodeBU";
  } else if (buORproject === "project") {
    return activity + line + "_ddlProjet";
  } else {
    console.log("ERREUR getOptionId buORproject");
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
  
  document.getElementById("white_wallpaper").style.display = "none";
  document.getElementById("ajax_loader").style.display = "none";
}

function RemoveMarginTop() {
  document.getElementById("ctl00_cph_a_GridViewActivitesFacturables").style =
    "margin-top:0";
  document.getElementById("ctl00_cph_a_GridViewActivitesNonFacturables").style =
    "margin-top:0";
  document.getElementById("ctl00_cph_a_GridViewAbsenceFormation").style =
    "margin-top:0";
}
