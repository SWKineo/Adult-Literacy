export default function sketch (p) {

  var barWidth = 1000;
  var barHeight = 70;
  var points = [];

  var totalTime = 0;
  var startTime = 0;

  var data = {
    clicks: [

    ]
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.data){
      data = props.data;
      if(data.clicks.length > 0){
        startTime = data.clicks[0].time
        totalTime = data.clicks[data.clicks.length - 1].time - startTime + 2

      }
    }
    delayedSetup()
  };


  function delayedSetup() {
    p.createCanvas(barWidth + 100, barHeight + 100);
    p.background(255);


    var canvasDiv = document.getElementById('dataContiner');

    if(canvasDiv !== null){
      console.log("good");
      barWidth = canvasDiv.offsetWidth;
    }else{
      console.log("bad");
    }


    displayBar();

    //stores data values in array with functions
    for(var i = 0; i < data.clicks.length; i++){
        points.push(new DataPoint(data.clicks[i].time, data.clicks[i].click));
    }

    //sets the color of each object based on the click
    for(i = 0; i < points.length; i++){
        points[i].setColor();
    }

    //displays each object
    for(i = 0; i < points.length; i++){
        points[i].display();
    }


};


function DataPoint(clickTime, clickType){

    //Each datapoint object will store the time it was clicked
    //and the type of click it was, ie correct, incorrect or missed
    this.time = clickTime;
    this.type = clickType;
    this.color = "#000000";

    //decides color based on the click type
    this.setColor = function(){
        if(this.type === "wrong") {
            this.color = "#d63737";
        } else if (this.type === "correct"){
            this.color = "#63e246";
        } else if (this.type === "empty"){
            this.color = "#e9f450";
        }
    }

    //displays a bar for each data point
    this.display = function(){
        p.fill(this.color);
        p.noStroke(0);
        p.rect(barWidth/(totalTime/(this.time + 1 - startTime)), 2, barWidth/150, barHeight-4);
        //p.rect(barWidth/(totalTime/(this.time - startTime)), 2, barWidth/150, barHeight-4);
    }
}

//draws background of graph and the surrounding text
function displayBar(){
    p.fill("#808080");
    p.noStroke();
    p.rect(0, 0, barWidth, barHeight, 8);
    p.textSize(24);
    p.fill(0);

    p.text('0s', 0, barHeight+25);
    p.text(totalTime + 's', barWidth-25, barHeight+25);

    p.text('Missed Click', (3*barWidth/5)+20, barHeight+55);
    p.text('Correct', (barWidth/5)+20, barHeight+55);
    p.text('Wrong', (2*barWidth/5)+20, barHeight+55);

    p.fill("#63e246");
    p.rect((barWidth/5), barHeight+40, 15, 15);

    p.fill("#d63737");
    p.rect((2*barWidth/5), barHeight+40, 15, 15);

    p.fill("#e9f450");
    p.rect((3*barWidth/5), barHeight+40, 15, 15);
}


};
