const RESIZE_FACTOR = 3;
const ORIGINAL_SIZE = 28;
const BATCH_SIZE = 5; 
let dataSnap ;


////////////////////////
// Fetching the array from Server
const myHeaders = new Headers();
myHeaders.append('Accept', '/img_array'); 

const myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'cors',  //cross origin resource mode
  cache: 'default',   //idk
};


const myRequest = new Request('img_array'); //url to fecth the array

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

document.onclick = clickCoord;
let log = document.getElementById('log');

function clickCoord(e){
  var canvas = document.getElementById("viewport");
  var context = canvas.getContext("2d");
  var rect = canvas.getBoundingClientRect();
  
   // console.log(`Position: (${e.clientX - rect.left}, ${e.clientY - rect.top})`);
  let cX = e.clientX - rect.left;
  let cY = e.clientY - rect.top;
  

  //IMPORTANT TO CHECK IF ALL EDGES RETURN SOMETHING FEASABLE:
  //Check if click is outside of cenvas
  if (cX<0 || cX > ORIGINAL_SIZE*RESIZE_FACTOR*BATCH_SIZE){
    return
  }
  if (cY<0 || cY > ORIGINAL_SIZE*RESIZE_FACTOR*BATCH_SIZE){
    return
  }

  //cX check
  var borderR = ORIGINAL_SIZE*RESIZE_FACTOR*BATCH_SIZE - ORIGINAL_SIZE*RESIZE_FACTOR/2;
  var borderL = ORIGINAL_SIZE*RESIZE_FACTOR/2;
  if(cX>borderR){
    cX = borderR;
  }
  if(cX<borderL){
    cX = borderL;
  }
  //cY check
  var borderD = ORIGINAL_SIZE*RESIZE_FACTOR*BATCH_SIZE - ORIGINAL_SIZE*RESIZE_FACTOR/2;
  var borderT = ORIGINAL_SIZE*RESIZE_FACTOR/2;
  if(cY>borderD){
    cY = borderD;
  }
  if(cY<borderT){
    cY = borderT;
  }

  log.textContent = `Click Coordinates: (${cX}, ${cY})`;
  //size of snapshot: size in original_pixels*resize_factor pixels
  sizeSnap = ORIGINAL_SIZE*RESIZE_FACTOR;
  
  //the click is the center of the snap so we do x and y minus half of the lengdth
  startSnapX = cX - sizeSnap/2;
  startSnapY = cY - sizeSnap/2;
  
  //CREATING Snapshot of the image, it needs to be sent to the server
  dataSnap = context.getImageData(startSnapX,startSnapY,sizeSnap,sizeSnap);
  

  //Display Snap
  var canvasSnap = document.getElementById("snapshot");
  var contextSnap = canvasSnap.getContext("2d");
  var width = canvasSnap.width;
  var height = canvasSnap.height;

  contextSnap.putImageData(dataSnap,0,0);
  

}




////////////////////
//Upload the snap to the server
let myInitPost = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(dataSnap),
};

const myRequestPost = new Request('/snap_array'); //url to POST array

function uploadJson(){
  fetch(myRequestPost, myInitPost)
  .then(response => response.json())
  .then(dataSnap => {
    console.log('Success:', dataSnap);
  })
  .catch((error) => {
   console.error('Error:', error);
  });
}

//Make button funtion to confrim the upload and create the JSON 
let myButton = document.querySelector('button');
myButton.onclick = function() {
  myInitPost.body = JSON.stringify(dataSnap);
  //console.log(JSON.stringify(dataSnap));
  uploadJson();
  console.log("upload");
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
