var cols, rows;
var scl = 20;
var w = 64*20;
var h = 70*20;

//------------------------

var song;
var fft;

//-----------------------

var flying = 0;

var terrain = [];

var terrainCopy = [];

function preload() {
  song = loadSound('BAD.mp3');
}


function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);
  button = createButton("play");
  button.mousePressed(togglePlaying)
  getAudioContext().resume();
  fft = new p5.FFT(0.9, 64);
  
  
  cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    terrainCopy[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
      terrainCopy[x][y] = 0;
    }
  }
}

function draw() {
  
  orbitControl();

  
  
  var spectrum = fft.analyze();

  
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      terrainCopy[x][y] = terrain[x][y];
    }
  }
  
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      terrain[x][y+1] = terrainCopy[x][y];
    }
  }

  for (var x = 0; x < cols; x++) {
    var amp = spectrum[x];
    terrain[x][0] = map(amp, 0, spectrum.length, -60, 60);
  }
  
  background(200);
  rotateX(PI / 3);
  rotateZ(PI);
  scale(0.4);
  fill(200, 200, 200, 50);
  translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
}

function togglePlaying(){
  if (!song.isPlaying()){
    song.play();
    button.html("pause");
  }
  else{
    song.pause();
    button.html("play");
  }

}
