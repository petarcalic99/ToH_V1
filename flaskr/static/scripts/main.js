//Get all images in the grid
let myImages = document.querySelectorAll('.gallery_img');
 // Size of the Image DB used for the test
let DBSIZE = 20; 


//Pour chaque image de la grille, image alea de la BD
myImages.forEach(updateImage);

function updateImage(myImage){
  var randomNum = Math.floor(Math.random() * DBSIZE);
  let randomNumStr = randomNum.toString();
  let srcIm = '/static/images/MNIST20/000' + randomNumStr + '.png';
  myImage.setAttribute ('src',srcIm);
}


//get pictures src on click
myImages.forEach(getImgQ);

function getImgQ(MyImage){
  MyImage.onclick = function getImgSrc(){
    let ImgSrc = MyImage.getAttribute('src');
  console.log(ImgSrc);
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
