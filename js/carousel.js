var carouselContainer = document.querySelector(".carousel-container");
var images = document.querySelectorAll(".carousel-container>img");

function CircularLinkedList(head = null) {
  this.head = head;
  this.size = size;
  this.getLast = getLast;
  this.getFirst = getFirst;
  this.add = add;
  this.getIndex = getIndex;
  this.logItems = logItems;

  function size() {
    var circularLinkedListSize = 0;
    var sizeNode = this.head;
    if (sizeNode) {
      circularLinkedListSize++;
      while (sizeNode.next !== this.head) {
        circularLinkedListSize++;
        sizeNode = sizeNode.next;
      }
    }
    return circularLinkedListSize;
  }

  function getLast() {
    var lastNode = this.head;
    if (lastNode) {
      while (lastNode.next !== this.head) {
        lastNode = lastNode.next;
      }
    }
    return lastNode;
  }

  function getFirst() {
    return this.head;
  }

  function add(data) {
    var lastNode = this.getLast();
    if (lastNode) {
      data.previous = lastNode;
      data.next = this.head;
      lastNode.next = data;
      this.head.previous = data;
    } else {
      this.head = data;
      data.previous = data;
      data.next = data;
    }
    return true;
  }

  function getIndex(index) {
    var myIndexItem = this.head;
    for (var i = 0; i < index; i++) {
      myIndexItem = myIndexItem.next;
    }
    return myIndexItem;
  }

  function logItems() {
    for (var i = 0; i < this.size(); i++) {
      console.log(this.getIndex(i));
    }
  }
}

function ListNode(data, previous = null, next = null) {
  this.data = data;
  this.previous = previous;
  this.next = next;
}

var imagesCircularLinkedList = new CircularLinkedList();

// adding images to linked list
for (var i = 0; i < images.length; i++) {
  var newNode = new ListNode(images[i]);
  imagesCircularLinkedList.add(newNode);
}

var carouselCenterItem = imagesCircularLinkedList.getIndex(0);

var carouselLinkedList = new CircularLinkedList();
var centerCarouselNode = new ListNode(carouselCenterItem);

// initialize first image node
carouselLinkedList.add(centerCarouselNode);

// setting initial images to respective positions
carouselLinkedList
  .getIndex(0)
  .data.previous["data"].setAttribute(
    "style",
    "position: absolute; left: -600px;"
  );
carouselLinkedList
  .getIndex(0)
  .data["data"].setAttribute("style", "position: absolute; left: 0px;");
carouselLinkedList
  .getIndex(0)
  .data.next["data"].setAttribute("style", "position: absolute; left: 600px;");

// buttons manipulation
var leftButton = document.createElement("button");
leftButton.setAttribute("id", "left-button");
leftButton.innerHTML = "&#8249;";
carouselContainer.appendChild(leftButton);

var rightButton = document.createElement("button");
rightButton.setAttribute("id", "right-button");
rightButton.innerHTML = "&#8250;";
carouselContainer.appendChild(rightButton);

var isMoving = false;
var currentIndex = 0;

function animateImages(element, element2, action) {
  var progress = 0;

  function left() {
    progress += 5;

    element.style.left = progress + "px";
    element2.style.left = parseFloat(element2.style.left) + 5 + "px";

    if (progress < 600) {
      window.requestAnimationFrame(left);
    } else {
      isMoving = false;
    }
  }
  function right() {
    progress -= 5;

    element.style.left = progress + "px";
    element2.style.left = parseFloat(element2.style.left) - 5 + "px";

    if (progress > -600) {
      window.requestAnimationFrame(right);
    } else {
      isMoving = false;
    }
  }
  if (action === "left") {
    window.requestAnimationFrame(left);
  } else if (action === "right") {
    window.requestAnimationFrame(right);
  }
}

function moveLeft() {
  if (!isMoving) {
    currentIndex--;
    if (currentIndex === -1) {
      currentIndex = 4;
    }
    isMoving = !isMoving;
    animateImages(
      carouselLinkedList.getIndex(0).data["data"],
      carouselLinkedList.getIndex(0).data.previous["data"],
      "left"
    );

    // taking appropriate image to left
    carouselLinkedList
      .getIndex(0)
      .data.previous.previous["data"].setAttribute(
        "style",
        "position: absolute; left: -600px;"
      );
    // changing left to center image
    carouselLinkedList.getIndex(0).data =
      carouselLinkedList.getIndex(0).data.previous;
    console.log(currentIndex);
    return true;
  }
  return false;
}

function moveRight() {
  if (!isMoving) {
    isMoving = !isMoving;
    currentIndex++;
    if (currentIndex === 5) {
      currentIndex = 0;
    }
    console.log(carouselLinkedList.getIndex(0).data);
    console.log(carouselLinkedList.getIndex(0).data.next);
    console.log(carouselLinkedList.getIndex(0).data.previous);
    carouselLinkedList
      .getIndex(0)
      .data.next.data.setAttribute("style", "position: absolute; left: 600px;");

    animateImages(
      carouselLinkedList.getIndex(0).data["data"],
      carouselLinkedList.getIndex(0).data.next["data"],
      "right"
    );
    console.log(carouselLinkedList.getIndex(0).data);
    console.log(carouselLinkedList.getIndex(0).data.next);
    console.log(carouselLinkedList.getIndex(0).data.previous);

    carouselLinkedList.getIndex(0).data =
      carouselLinkedList.getIndex(0).data.next;
    carouselLinkedList.getIndex(0).data.next =
      carouselLinkedList.getIndex(0).data.next;
    carouselLinkedList.getIndex(0).data.previous =
      carouselLinkedList.getIndex(0).data.previous;
  }
}

leftButton.addEventListener("click", moveLeft);

rightButton.addEventListener("click", moveRight);

// indicator manipulaton

var indicatorWrapper = document.createElement("div");
indicatorWrapper.setAttribute("id", "image-indicators");
carouselContainer.appendChild(indicatorWrapper);

for (var i = 0; i < imagesCircularLinkedList.size(); i++) {
  var indicator = document.createElement("span");
  indicator.setAttribute("class", "indicator");
  indicatorWrapper.appendChild(indicator);
}

var indicators = document.querySelectorAll("#image-indicators>.indicator");

function moveRightDirection(index) {
  if (index > currentIndex) {
    return true;
  }
  return false;
}

function moveRightThroughIndicator(index) {
  if (!isMoving) {
    currentIndex = index;

    var clickedItem = imagesCircularLinkedList.getIndex(index);

    var temp = carouselLinkedList.getIndex(0).data.next;
    carouselLinkedList.getIndex(0).data.next = clickedItem;

    carouselLinkedList
      .getIndex(0)
      .data.next.data.setAttribute("style", "position: absolute; left: 600px;");

    animateImages(
      carouselLinkedList.getIndex(0).data["data"],
      carouselLinkedList.getIndex(0).data.next["data"],
      "right"
    );

    carouselLinkedList.getIndex(0).data.next = temp;
    carouselLinkedList.getIndex(0).data = clickedItem;
    carouselLinkedList.getIndex(0).data.next = clickedItem.next;
    carouselLinkedList.getIndex(0).data.previous = clickedItem.previous;
  }
}

function moveLeftThroughIndicator(index) {
  if (!isMoving) {
    currentIndex = index;

    var clickedItem = imagesCircularLinkedList.getIndex(index);

    var temp = carouselLinkedList.getIndex(0).data.previous;
    carouselLinkedList.getIndex(0).data.previous = clickedItem;

    carouselLinkedList
      .getIndex(0)
      .data.previous.data.setAttribute(
        "style",
        "position: absolute; left: -600px;"
      );

    animateImages(
      carouselLinkedList.getIndex(0).data["data"],
      carouselLinkedList.getIndex(0).data.previous["data"],
      "left"
    );

    carouselLinkedList.getIndex(0).data.previous = temp;
    carouselLinkedList.getIndex(0).data = clickedItem;
    carouselLinkedList.getIndex(0).data.next = clickedItem.next;
    carouselLinkedList.getIndex(0).data.previous = clickedItem.previous;
  }
}

function moveImageThroughIndicator(index) {
  var isMoveRightDirection = moveRightDirection(index);

  if (currentIndex !== index) {
    if (isMoveRightDirection) {
      moveRightThroughIndicator(index);
    } else {
      moveLeftThroughIndicator(index);
    }
  }
}

function addIndicatorListeners(index) {
  indicators[index].addEventListener("click", function () {
    moveImageThroughIndicator(index);
  });
}

for (var i = 0; i < indicators.length; i++) {
  addIndicatorListeners(i);
}
