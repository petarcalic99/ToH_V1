 // Size of the Image DB used for the test
let DBSIZE = 20; 
let RESIZE_FACTOR = 4;
let ORIGINAL_SIZE = 28

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

//Stores the promise
let myArray = requestArray(); 

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
    myArray.then( (a) => { 
    for (var x=0; x<height; x++){
      for (var y=0; y<width; y++){
        var pixelindex = (y*width + x)*4

        imagedata.data[pixelindex] = a.array[y][x][0]*255 //red         //invert x and y maybe
        imagedata.data[pixelindex + 1] = a.array[y][x][1]*255 //green
        imagedata.data[pixelindex + 2] = a.array[y][x][2]*255 //blue
        imagedata.data[pixelindex + 3] = 255 //alpha
      }
    }
    //console.log(imagedata.data);
    context.putImageData(imagedata,0,0);
    });
  }
createImage();  
}


//////////////////
//Track the coordinates of the user s answer
//(width and height of the canvas: 448 pixels)  

document.onclick = clickInput;

function clickCoord(e){
  var canvas = document.getElementById("viewport");
  var context = canvas.getContext("2d");
  var rect = canvas.getBoundingClientRect();
  
  //max clickable has to be is rect.right and down
  console.log(`Position: (${e.clientX - rect.left}, ${e.clientY - rect.top})`);
  let cX = e.clientX - rect.left;
  let cY = e.clientY - rect.top;

  //size of snapshot: size in original_pixels*resize_factor pixels
  sizeSnap = 28*RESIZE_FACTOR/2;
  
  //the click is the center of the snap so we do x and y minus half of the lengdth
  startSnapX = cX - sizeSnap;
  startSnapY = cY - sizeSnap;
  
  //Snapshot of the image, it needs to be sent to the server
  imageDataSnap = context.getImageData(startSnapX,startSnapY,sizeSnap,sizeSnap);
  return imageDataSnap;
}




////////////////
// Personalized welcome message
let myHeading = document.querySelector('h1');
//store the name in the local storage
function setUserName() {
  let myName = prompt('Please enter your name.');
  if(!myName) {
    setUserName();
  } else {
    localStorage.setItem('name', myName);
    myHeading.innerHTML = myName + ', Welcome to the Test Of Humanity';
  }
}

if(!localStorage.getItem('name')) {
  setUserName();
} else {
  let storedName = localStorage.getItem('name');
  myHeading.innerHTML = 'Welcome ' + storedName;
}
