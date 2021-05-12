const URL = "python/tm-my-image-model/";

let model1, webcam, labelContainer, maxPredictions, num, str;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model1 = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model1.getTotalClasses();
    num = 0;
    str = "";

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(260, 266, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    var classPrediction=[];
    const prediction = await model1.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        classPrediction[i] = prediction[i].probability.toFixed(2);
    }
    displayLabels(classPrediction);
}

async function displayLabels(data) {
    var max = data[0];
    var maxIndex = 0;
    var emojis = ["", "👍", "📱", "📚", "🎓", "💊"];
    var em;
 
    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }

    if (max>=0.9){
        em = emojis[maxIndex];
    }
    if (str===em){
        num++;
    }
    str = em;
    if (num>25){
        var input = document.getElementsByClassName("use-keyboard-input")[0];
        input.value = input.value +emojis[maxIndex];
        num = 0;
    }
}