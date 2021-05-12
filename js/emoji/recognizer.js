let model;
var canvasWidth             = 260;
var canvasHeight            = 266;
var canvasStrokeStyle       ="white";//"#2285a3"; //"white";
var canvasLineJoin          = "round";
var canvasLineWidth         = 10;
var canvasBackgroundColor   = "black";
var canvasId                = "canvas";
var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

var canvasBox = document.getElementById('canvas_box');
var canvas    = document.createElement("canvas");
 
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}
 
ctx = canvas.getContext("2d");

//Mouse Down Function
$("#canvas").mousedown(function(e) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX- rect.left;;
    var mouseY = e.clientY- rect.top;
    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
});

//Touch Start Function
canvas.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
 
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
 
    var mouseX = touch.clientX - rect.left;
    var mouseY = touch.clientY - rect.top;
 
    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
 
}, false);

//Mouse Move Function
$("#canvas").mousemove(function(e) {
    if(drawing) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX- rect.left;;
        var mouseY = e.clientY- rect.top;
        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
});

//Touch Move Function
canvas.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
    if(drawing) {
        var rect = canvas.getBoundingClientRect();
        var touch = e.touches[0];
 
        var mouseX = touch.clientX - rect.left;
        var mouseY = touch.clientY - rect.top;
 
        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
}, false);

//Mouse Up Function
$("#canvas").mouseup(function(e) {
    drawing = false;
});
 
//Touch End Function
canvas.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
    drawing = false;
}, false);
 
//Mouse Leave Function
$("#canvas").mouseleave(function(e) {
    drawing = false;
});
 
//Touch leave Function
canvas.addEventListener("touchleave", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
    drawing = false;
}, false);

//Click Function
function addUserGesture(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickD.push(dragging);
}

//Redraw Function
function drawOnCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
 
    ctx.strokeStyle = canvasStrokeStyle;
    ctx.lineJoin    = canvasLineJoin;
    ctx.lineWidth   = canvasLineWidth;
 
    for (var i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if(clickD[i] && i) {
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        } else {
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

//Clear Function
$("#clear-button").click(async function () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    clickX = new Array();
    clickY = new Array();
    clickD = new Array();
});

//Load model
async function loadModel() {
    // clear the model variable
    model = undefined; 
    // load the model using a HTTPS request (where you have stored your model files)
    model = await tf.loadLayersModel("python/models/model.json");
  }

loadModel();

// Preprocess the canvas
function preprocessCanvas(image) {
    // resize the input image to target size of (1, 28, 28)
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
    return tensor.div(255.0);
}

// predict function
$("#predict-button").click(async function () {
    // get image data from canvas
    var imageData = canvas.toDataURL();
 
    // preprocess canvas
    let tensor = preprocessCanvas(canvas);
 
    // make predictions on the preprocessed image tensor
    let predictions = await model.predict(tensor).data();
 
    // get the model's prediction results
    let results = Array.from(predictions);
 
    displayLabel(results);
    console.log(results);
});

function displayLabel(data) {
    var max = data[0];
    var maxIndex = 0;
    var emojis = ["🐇", "🦈", "🙂", "🍓", "🚽"];
 
    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }
    console.log(maxIndex);
    var input = document.getElementsByClassName("use-keyboard-input")[0];
    input.value = input.value +emojis[maxIndex];
}