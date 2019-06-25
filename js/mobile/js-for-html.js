let intervalId = 0; // Needed to cancel the scrolling when we're at the top of the page
const $scrollButton = document.querySelector('#back-to-top'); // Reference to our scroll button


window.onscroll = function () {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    $scrollButton.style.display = "block";
  } else {
    $scrollButton.style.display = "none";
  }
}

function scrollStep() {
  // Check if we're at the top already. If so, stop scrolling by clearing the interval
  if (window.pageYOffset === 0) {
    clearInterval(intervalId);
  }
  window.scroll(0, window.pageYOffset - 50);
}

function scrollToTop() {
  // Call the function scrollStep() every 16.66 millisecons
  intervalId = setInterval(scrollStep, 1.66);
}

// When the DOM is loaded, this click handler is added to our scroll button
$scrollButton.addEventListener('click', scrollToTop);


let previousIndex = 1;

document.onmousedown = function (e) {
  let currentRow = e.target.closest('.draggable');
  if (!currentRow) return;
  let index = currentRow.rowIndex;
  let infoRow = $studentsTable.querySelector("tbody")
    .querySelectorAll("tr")[index];

  if (infoRow.classList.contains("non-visible")) {
    infoRow.classList.remove("non-visible");
    currentRow.classList.add("visible-row");
  } else {
    infoRow.classList.add("non-visible");
    currentRow.classList.remove("visible-row");
  }

  if (index !== previousIndex) {
    $studentsTable.querySelector("tbody")
      .querySelectorAll("tr")[previousIndex - 1].classList.remove("visible-row");
    $studentsTable.querySelector("tbody")
      .querySelectorAll("tr")[previousIndex].classList.add("non-visible");
  }

  previousIndex = index;
};
