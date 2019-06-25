let $corpsesList = document.querySelector("#corpsesList");
let $profileOptions = document.getElementById("profileOptions");
let $auditoryOptions = document.getElementById("auditoryOptions");


let apiCorpses = 'https://lyceumexams.herokuapp.com/api/corpses/saved';
let apiDictionary = 'https://lyceumexams.herokuapp.com/api/dictionary';
let apiPupils = 'https://lyceumexams.herokuapp.com/api/pupils?';


let corpsesID = {};
let profilesID = {};
let auditoriesSelect = [];
let audiencesProfiles = {};
let audiencesCorpses = {};
let profilesCount = {};
let profilesSelect = [];
let audiencesDict = {};
let profilesDict = {};
let placesDict = {};


let buildingsHTML = "";
let profilesAllHTML = '<option value="all" selected="selected">Все</option>';
let auditoriesAllHTML = '<option value="all" selected="selected">Все</option>';


function ajax_get(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    let data;
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        data = JSON.parse(xhr.responseText);
      } catch (err) {
        console.log(err.message + " in " + xhr.responseText);
        return;
      }
      callback(data);
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
}


ajax_get(apiCorpses, function (data) {
  for (let i = 0; i < data.length; i++) {
    let name;
    let auditoryCorpses = [];

    name = data[i]["name"];
    corpsesID[data[i]["name"]] = data[i]["alias"];

    buildingsHTML += '<li>' + '<a href="#">'
      + '<div>' + name + '</div>';

    let places = data[i]["places"];

    for (let j in places) {
      let audiences;
      if (places.hasOwnProperty(j)) {
        audiences = places[j]["audience"];
        profilesID[places[j]["code"]] = places[j]["_id"];
      }
      let auditoryProfiles = [];
      for (let k in audiences) {
        if (audiences.hasOwnProperty(k)) {
          auditoriesSelect.push({
            key: places[j]["code"],
            value: audiences[k]["name"],
            count: audiences[k]["count"]
          });
          auditoryProfiles.push({name: audiences[k]["name"], count: audiences[k]["count"], max: audiences[k]["max"]});
          auditoryCorpses.push({name: audiences[k]["name"], count: audiences[k]["count"], max: audiences[k]["max"]});
        }
      }
      audiencesProfiles[places[j]["code"]] = auditoryProfiles;
      profilesCount[places[j]["code"]] = places[j]["count"];

      buildingsHTML += '<div><span class="hidden-text">'
        + places[j]["code"] + " " + "(" + places[j]["count"] + ")"
        + '</span></div>';
    }
    audiencesCorpses[name] = auditoryCorpses;

    buildingsHTML += '</a>' + '</li>';
  }

  $corpsesList.innerHTML += buildingsHTML;
});


ajax_get(apiDictionary, function (data) {
  let places = data["places"];
  let audiences = data["audiences"];
  let profiles = data["profiles"];

  for (let i in places) {
    if (places.hasOwnProperty(i)) {
      profilesSelect.push({
        key: places[i]["name"],
        value: places[i]["code"],
      });
      placesDict[i] = places[i]["code"];
    }
  }

  for (let i in audiences) {
    if (audiences.hasOwnProperty(i)) {
      audiencesDict[i] = audiences[i];
    }
  }

  for (let i in profiles) {
    if (profiles.hasOwnProperty(i)) {
      profilesDict[i] = profiles[i];
    }
  }
});


let selectedBuilding;

function chooseCorpus(e) {
  selectedBuilding = e.target.closest("li").querySelector("div").textContent;
  document.querySelectorAll(".non-visible-form")
    .forEach(item => item.classList.remove("non-visible-form"));
  document.querySelector(".header").classList.add("non-visible-form");
  document.querySelector(".spacer").textContent = selectedBuilding;
  document.querySelector("#dismiss").click();


  let profilesHTML = "";
  let auditoriesHTML = "";

  let url = apiPupils + 'corps=' + corpsesID[selectedBuilding] + '&place=';

  // очищаем профили
  $profileOptions.innerHTML = profilesAllHTML;

  // очищаем аудитории
  $auditoryOptions.innerHTML = auditoriesAllHTML;

  // добавляем профили
  for (let i = 0; i < profilesSelect.length; i++) {
    if (selectedBuilding === profilesSelect[i].key) {
      profilesHTML += '<option>' + profilesSelect[i].value
        + " - " + profilesCount[profilesSelect[i].value] + "ч." + '</option>';
    }
  }

  $profileOptions.innerHTML += profilesHTML;

  // добавляем аудитории
  for (let i = 1; i < $profileOptions.length; i++) {
    for (let j = 0; j < auditoriesSelect.length; j++) {
      if ($profileOptions[i].value.split('-')[0].slice(0, -1) === auditoriesSelect[j].key) {
        auditoriesHTML += '<option>' + auditoriesSelect[j].value
          + " - " + auditoriesSelect[j]["count"] + "ч." + '</option>';
      }
    }
  }

  $auditoryOptions.innerHTML += auditoriesHTML;

  loadData(url);
}

$corpsesList.addEventListener("click", chooseCorpus);


function setAuditories() {
  let selectedProfile = $profileOptions.value;
  if (selectedProfile !== "all") {
    selectedProfile = $profileOptions.value.split('-')[0].slice(0, -1);
  }

  let auditoriesHTML = "";

  let url = apiPupils + 'corps=' + corpsesID[selectedBuilding] + '&place=';

  // очищаем аудитории
  $auditoryOptions.innerHTML = auditoriesAllHTML;

  // добавляем все аудитории
  if (selectedProfile === "all") {
    for (let i = 1; i < $profileOptions.length; i++) {
      for (let j = 0; j < auditoriesSelect.length; j++) {
        if ($profileOptions[i].value.split('-')[0].slice(0, -1) === auditoriesSelect[j].key) {
          auditoriesHTML += '<option>' + auditoriesSelect[j].value
            + " - " + auditoriesSelect[j]["count"] + "ч." + '</option>';
        }
      }
    }

    // добавляем профильные аудитории
  } else {
    for (let i = 0; i < auditoriesSelect.length; i++) {
      if (selectedProfile === auditoriesSelect[i].key) {
        auditoriesHTML += '<option>' + auditoriesSelect[i].value
          + " - " + auditoriesSelect[i]["count"] + "ч." + '</option>';
      }
    }

    url += profilesID[selectedProfile];
  }

  $auditoryOptions.innerHTML += auditoriesHTML;

  loadData(url);
}

$profileOptions.addEventListener("change", setAuditories);


function chooseAuditory() {
  let selectedAuditory = $auditoryOptions.value;
  let necessaryStudents = [];
  students = studentsCopy.concat();

  if (selectedAuditory !== "all") {
    for (let i = 0; i < students.length; i++) {
      if (students[i].auditory === selectedAuditory.split('-')[0].slice(0, -1)) {
        necessaryStudents.push(students[i]);
      }
    }
    students = necessaryStudents.concat();
  }

  $studentsTable.getElementsByTagName("th")[previousColumn]
    .classList.remove("arrow_up", "arrow_down");

  writeToStudentsTable();
}

$auditoryOptions.addEventListener("change", chooseAuditory);


function loadData(url) {
  ajax_get(url, function (data) {
    let name;
    let audience;
    let profile;
    let place;
    let email;
    let phone;

    students.length = 0;
    // students = [];

    for (let i = 0; i < data.length; i++) {
      name = data[i]["firstName"] + " " + data[i]["lastName"] + " " + data[i]["parentName"];
      audience = audiencesDict[data[i]["audience"]];
      profile = profilesDict[data[i]["profile"]];
      place = placesDict[data[i]["place"]];
      email = data[i]["email"];
      phone = data[i]["phone"];
      students.push({
        name: name,
        auditory: audience,
        profile: profile,
        place: place,
        email: email,
        phone: phone});
    }

    studentsCopy = students.concat();

    $studentsTable.getElementsByTagName("th")[previousColumn]
      .classList.remove("arrow_up", "arrow_down");

    writeToStudentsTable();
  })
}


function writeToStudentsTable() {
  if ($studentsTable.getElementsByTagName('tbody')[0] !== undefined) {
    $studentsTable.removeChild($studentsTable.getElementsByTagName('tbody')[0]);
  }

  let $studentsHTML = '<tbody>';
  for (let i = 0; i < students.length; i++) {
    $studentsHTML += '<tr class="draggable">' +
      '<td>' + students[i].name + '</td>' +
      '<td>' + students[i].auditory + '<br>' + students[i].place + '</td>' +
      '<td>' + '</td>' + '</tr>' +
      '<tr class="non-visible">' +
      '<td colspan="3">' + '<div class="info-row">' +
      "Профиль: " + students[i].profile + '<br>' +
      "Телефон: " + '<a href="tel://' + students[i].phone.slice(1) + '">' + students[i].phone + '</a>' + '<br>' +
      "email: " + students[i].email +
      '</div>' + '</td>' + '</tr>';
  }
  $studentsHTML += '</tbody>';

  $studentsTable.innerHTML += $studentsHTML;
}
