let myImages = document.querySelectorAll('.gallery_img');
let DBSIZE = 20;

myImages.forEach(updateImage);

function updateImage(myImage){
  myImage.setAttribute ('src','images/MNIST20/0008.png');
}

//Switch pictures on click
myImage.onclick = function() {
  let mySrc = myImage.getAttribute('src');
  if(mySrc === 'images/eth.jpg') {
    myImage.setAttribute ('src','images/eth.jpg');
  } else {
    myImage.setAttribute ('src','images/MNIST20/0008.png');
  }
}

// Personalized welcome message code
let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
  let myName = prompt('Please enter your name.');
  if(!myName) {
    setUserName();
  } else {
    localStorage.setItem('name', myName);
    myHeading.innerHTML = 'Welcome ' + myName;
  }
}
 
if(!localStorage.getItem('name')) {
  setUserName();
} else {
  let storedName = localStorage.getItem('name');
  myHeading.innerHTML = 'Welcome ' + storedName;
}

myButton.onclick = function() {
  choosePic();    //setUserName();
}

// Select ranodm images each time
window.onload = choosePic;


function choosePic() {
  var randomNum = Math.floor(Math.random() * DBSIZE);
  document.getElementsByClassName("gallery_img").src = "images/MNIST20/0008.png";
}

