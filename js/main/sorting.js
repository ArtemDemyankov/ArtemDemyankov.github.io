let $studentsTable = document.getElementById("studentsTable");


let students = [];
let studentsCopy = [];


$studentsTable.addEventListener("click", (event) => {
  if (event.target.tagName === 'TH') {
    if (event.target.classList.contains("sortable")) {
      sortTable(event.target);
    }
  }
});


let sortOrder = 0;
let previousColumn = 0;

function sortTable($column) {
  let propertyName = $column.dataset.property;

  students.sort(function (a, b) {
    if (a[propertyName] > b[propertyName]) {
      return sortOrder % 2 === 0 ? 1 : -1;
    }
    if (a[propertyName] < b[propertyName]) {
      return sortOrder % 2 === 0 ? -1 : 1;
    }
    return 0;
  });

  $studentsTable.getElementsByTagName("th")[previousColumn]
    .classList.remove("arrow_up", "arrow_down");

  let arrow = sortOrder % 2 === 0 ? "arrow_up" : "arrow_down";
  $column.classList.add(arrow);

  writeToStudentsTable();
  sortOrder++;
  previousColumn = $column.cellIndex;
}
