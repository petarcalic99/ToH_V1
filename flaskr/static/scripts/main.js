//Get all images in the grid
let myImages = document.querySelectorAll('.gallery_img');
 // Size of the Image DB used for the test
let DBSIZE = 20; 



// parameters for the request function
const myHeaders = new Headers();
myHeaders.append('Accept', '/img_array'); 

const myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'cors',  //cross origin resource mode
  cache: 'default',   //idk
};


const myRequest = new Request('img_array'); //url to fecth the array

//check the html loaded
//window.addEventListener('DOMContentLoaded', requestArray);

//fethcing array from server
function requestArray(){
  return fetch(myRequest, myInit)
  .then(response => response.json())
}

let myArray = requestArray();
//myArray.then( (a) => { console.log(a)});  //resolve for print the array


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

//using canvas to show the array on a pixel level 
window.onload = function(){
  
  var canvas = document.getElementById("viewport");
  var context = canvas.getContext("2d");

  //def image dim
  var width = canvas.width;
  var height = canvas.height;

  var imagedata = context.createImageData(width,height);

  function createImage(){
    //for all pixels
    //console.log(typeof myArray);
    myArray.then( (a) => { 
    for (var x=0; x<width; x++){
      for (var y=0; y<height; y++){
        var pixelindex = (y*width + x)*4

        imagedata.data[pixelindex] = a.array[x][y][0]*255 //red
        imagedata.data[pixelindex + 1] = a.array[x][y][1]*255 //green
        imagedata.data[pixelindex + 2] = a.array[x][y][2]*255 //blue
        imagedata.data[pixelindex + 3] = 255 //alpha
      
      }
    }
    console.log(imagedata.data);
    context.putImageData(imagedata,0,0);
    });
  }
createImage();  
/*
  function main(){
    createImage();
    //console.log(imagedata.data); 
    context.putImageData(imagedata,0,0);
  }

  main(); //call the main function
*/
}






////////////////
// Personalized welcome message
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
