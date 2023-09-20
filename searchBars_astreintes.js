InitiateSearchBars();
RemoveMarginTop();

let oldFilterBU = "";
let oldFilterProject = "";

loopSearchBars = setInterval(() => {
  RemoveMarginTop();
  let filter = document.getElementById("inputBu").value;
  if (filter !== oldFilterBU) {
    Filter("ctl00_cph_ast_ddlBU", filter);
    oldFilterBU = filter;
  }
  filter = document.getElementById("inputProject").value;
  if (filter !== oldFilterProject) {
    Filter("ctl00_cph_ast_ddlProjet", filter);
    oldFilterProject = filter;
  }
}, 200);

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

function InitiateSearchBars() {
  let inputBU = document.createElement("input");
  inputBU.id = "inputBu";
  inputBU.style = "width: 78px";
  inputBU.placeholder = "Filtre BU";
  let inputProject = document.createElement("input");
  inputProject.id = "inputProject";
  inputProject.style = "width:248px";
  inputProject.placeholder = "Filtre Projets";
  let activityNode = document.getElementsByClassName("gv astr-header")[0];
  let parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBU, activityNode);
  parentDiv.insertBefore(inputProject, activityNode);
}

function RemoveMarginTop() {
  document.getElementsByClassName("gv astr-header")[0].style = "margin-top:0";
}
