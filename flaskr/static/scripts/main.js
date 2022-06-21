const RESIZE_FACTOR = 3;  //multiplies th number of pixels
const ORIGINAL_SIZE = 28; //width of a picture in pixels (every pixel then has three values RGB)
const BATCH_SIZE = 5;  //number of images in a line 
let dataSnap;    //where we will store the crop of the image with the click


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

//fethcing array from server                      //Fetch quesitons also
function requestArray() {
  return fetch(myRequest, myInit)
    .then(response => response.json())
}

//Stores the promise
let myArray = requestArray();

//using canvas to show the array on a pixel level 
window.onload = function () {

  let canvas = document.getElementById("viewport");
  let context = canvas.getContext("2d");

  //def image dim
  let width = canvas.width;
  let height = canvas.height;
  //to store the data
  let imagedata = context.createImageData(width, height);

  //display the quesiton
  let question = document.getElementById('question');


  function createImage() {
    //for all pixels
    myArray.then((a) => {
      console.log(a.num)
      question.textContent = `The Number: ${a.num}`;
      for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
          let pixelindex = (y * width + x) * 4

          imagedata.data[pixelindex] = a.array[y][x][0] * 255 //red         //invert x and y maybe
          imagedata.data[pixelindex + 1] = a.array[y][x][1] * 255 //green
          imagedata.data[pixelindex + 2] = a.array[y][x][2] * 255 //blue
          imagedata.data[pixelindex + 3] = 255 //alpha
        }
      }
      //imshow function
      context.putImageData(imagedata, 0, 0);
    });
  }
  createImage();
}





//////////////////
//Track the coordinates of the user s answer  

document.onclick = clickCoord;
let log = document.getElementById('log');

//display the answer later
let answer = document.getElementById('answer');


function clickCoord(e) {
  let canvas = document.getElementById("viewport");
  let context = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();

  // console.log(`Position: (${e.clientX - rect.left}, ${e.clientY - rect.top})`);
  let cX = e.clientX - rect.left;
  let cY = e.clientY - rect.top;


  //IMPORTANT TO CHECK IF ALL EDGES RETURN SOMETHING FEASABLE:
  //Check if click is outside of cenvas
  if (cX < 0 || cX > ORIGINAL_SIZE * RESIZE_FACTOR * BATCH_SIZE) {
    return
  }
  if (cY < 0 || cY > ORIGINAL_SIZE * RESIZE_FACTOR * BATCH_SIZE) {
    return
  }

  //cX check
  let borderR = ORIGINAL_SIZE * RESIZE_FACTOR * BATCH_SIZE - ORIGINAL_SIZE * RESIZE_FACTOR / 2;
  let borderL = ORIGINAL_SIZE * RESIZE_FACTOR / 2;
  if (cX > borderR) {
    cX = borderR;
  }
  if (cX < borderL) {
    cX = borderL;
  }
  //cY check
  let borderD = ORIGINAL_SIZE * RESIZE_FACTOR * BATCH_SIZE - ORIGINAL_SIZE * RESIZE_FACTOR / 2;
  let borderT = ORIGINAL_SIZE * RESIZE_FACTOR / 2;
  if (cY > borderD) {
    cY = borderD;
  }
  if (cY < borderT) {
    cY = borderT;
  }

  log.textContent = `Click Coordinates: (${cX}, ${cY})`;
  //size of snapshot: size in original_pixels*resize_factor pixels
  sizeSnap = ORIGINAL_SIZE * RESIZE_FACTOR;

  //the click is the center of the snap so we do x and y minus half of the lengdth
  startSnapX = cX - sizeSnap / 2;
  startSnapY = cY - sizeSnap / 2;

  //CREATING Snapshot of the image, it needs to be sent to the server
  dataSnap = context.getImageData(startSnapX, startSnapY, sizeSnap, sizeSnap);


  //Display Snap
  let canvasSnap = document.getElementById("snapshot");
  let contextSnap = canvasSnap.getContext("2d");
  let width = canvasSnap.width;
  let height = canvasSnap.height;

  contextSnap.putImageData(dataSnap, 0, 0);


}




////////////////////
//Upload the snap to the server
let myInitPost = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dataSnap),                       //Add the question
};

const myRequestPost = new Request('/snap_array'); //url to POST array

function uploadJson() {
  fetch(myRequestPost, myInitPost)
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
      answer.textContent = `Answer: ${result}`;

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//Make button funtion to confrim the upload and create the JSON 
let myButton = document.querySelector('button');
myButton.onclick = function () {
  myInitPost.body = JSON.stringify(dataSnap);
  //console.log(JSON.stringify(dataSnap));
  uploadJson();
  console.log("upload");
}

