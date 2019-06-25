let maxPixelX = 3;
let maxPixelY = 3;

let DragManager = new function () {

  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  document.onmousedown = onMouseDown;

  let dragObject = {};
  let self = this;

  function onMouseDown(e) {
    if (e.which !== 1) // если клик правой кнопкой мыши
      return; // то он не запускает перенос

    let elem = e.target.closest('.draggable');

    if (!elem) return; // не нашли, клик вне draggable-объекта

    // запомнить переносимый объект
    dragObject.elem = elem;

    // запомнить координаты, с которых начат перенос объекта
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return; // элемент не зажат

    if (!dragObject.avatar) { // если перенос не начат...

      // посчитать дистанцию, на которую переместился курсор мыши
      let moveX = e.pageX - dragObject.downX;
      let moveY = e.pageY - dragObject.downY;
      if (Math.abs(moveX) < maxPixelX && Math.abs(moveY) < maxPixelY) {
        return; // ничего не делать, мышь не передвинулась достаточно далеко
      }

      dragObject.avatar = createAvatar(e); // захватить элемент
      if (!dragObject.avatar) {
        dragObject = {}; // аватар создать не удалось, отмена переноса
        return; // возможно, нельзя захватить за эту часть элемента
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      let coords = getCoords(dragObject.elem);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e); // отобразить начало переноса
    }

    // отобразить перенос объекта при каждом движении мыши
    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
  }

  function onMouseUp(e) {
    // (1) обработать перенос, если он идет
    if (dragObject.avatar) {
      finishDrag(e);
    }

    // в конце mouseup перенос либо завершился, либо даже не начинался
    // (2) в любом случае очистим "состояние переноса" dragObject
    dragObject = {};
  }

  function finishDrag(e) {
    let dropElem = findDroppable(e);
    if (!dropElem) {
      self.onDragCancel(dragObject);
    } else {
      self.onDragEnd(dragObject, dropElem);
    }
    dragObject.avatar.remove()
  }

  function createAvatar(e) {
    return document.importNode(dragObject.elem, true);
  }

  function startDrag(e) {
    let avatar = dragObject.avatar;
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
    avatar.style.opacity = 0.65;
  }

  function findDroppable(event) {
    // спрячем переносимый элемент
    dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    let elem = document.elementFromPoint(event.clientX, event.clientY);

    // показать переносимый элемент обратно
    dragObject.avatar.hidden = false;

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    return elem.closest('.droppable');
  }

  this.onDragEnd = function (dragObject, dropElem) {
    console.log(`${dragObject.avatar.childNodes[1].textContent} - ${dropElem.childNodes[0].textContent}`);
  };
  this.onDragCancel = function (dragObject) {
  };
};

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}


// function allowDrop(ev) {
//   ev.preventDefault();
// }
//
// function drag(ev) {
//   ev.dataTransfer.setData("text", ev.target.getElementsByTagName("td")[1].textContent);
// }
//
// function drop(ev) {
//   ev.preventDefault();
//   let data = ev.dataTransfer.getData("text");
//   let data2 = ev.target.parentNode.getElementsByTagName("th")[0].textContent;
//   //ev.target.appendChild(document.getElementById(data));
//   console.log(data + " - " + data2);
// }
