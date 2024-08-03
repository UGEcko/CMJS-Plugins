
// !INFO!: If you dont know what any of these parameters are; learn here: https://github.com/Aeroluna/Heck/wiki/Events#ring-rotation
// Easings: https://easings.net/

const easings = [ "Linear",
  "easeInSine","easeOutSine","easeInOutSine",
  "easeInCubic","easeOutCubic","easeInOutCubic",
  "easeInQuint","easeOutQuint","easeInOutQuint",
  "easeInCirc","easeOutCirc","easeInOutCirc",
  "easeInElastic","easeOutElastic","easeInOutElastic",
  "easeInQuad","easeOutQuad","easeInOutQuad",
  "easeInQuart","easeOutQuart","easeInOutQuart",
  "easeInExpo","easeOutExpo","easeInOutExpo",
  "easeInBack","easeOutBack","easeInOutBack"
]
module.exports = {
  name: "Spin Propagation",
  params: {
    DirectionPropagation: true,
    StepPropagation: true,
    PropPropagation: true,
    SpeedPropagation: true,
    RotationPropagation: true,
    TimePropagation: true,
    Step: ["16","2","4","8","32","64"],
    StepEasing: easings,
    PropEasing: easings,
    SpeedEasing: easings,
    RotationEasing: easings,
    TimeEasing: [ "Linear",
      "easeInSine","easeOutSine","easeInOutSine",
      "easeInCubic","easeOutCubic","easeInOutCubic",
      "easeInQuint","easeOutQuint","easeInOutQuint",
      "easeInCirc","easeOutCirc","easeInOutCirc",
      "easeInQuad","easeOutQuad","easeInOutQuad",
      "easeInQuart","easeOutQuart","easeInOutQuart",
      "easeInExpo","easeOutExpo","easeInOutExpo",
    ]
  },
  run: fourTwentee,
};

function fourTwentee(cursor, notes, events, walls, _, global, data) {
    const StepPropagation = global.params.StepPropagation;
    const PropPropagation = global.params.PropPropagation;
    const SpeedPropagation = global.params.SpeedPropagation;
    const RotationPropagation = global.params.RotationPropagation;
    const TimePropagation = global.params.TimePropagation;
    const StepEasing = global.params.StepEasing;
    const PropEasing = global.params.PropEasing;
    const SpeedEasing = global.params.SpeedEasing;
    const RotationEasing = global.params.RotationEasing;
    const TimeEasing = global.params.TimeEasing;
    let step = 1;

    switch(global.params.Step) {
      case "2":
        step = 2
        break;
      case "4":
        step = 4
        break;
      case "8":
        step = 8
        break;
      case "16":
        step = 16
        break;
      case "32":
        step = 32
        break;
      case "64":
        step = 64
        break;
      default:
        step = 4
        break;
    }

    let rawEvents = [];
    
    for (let i = 0; i < events.length; i++) {
      if (events[i].selected && events[i].et == 8) {
          rawEvents.push(`${events[i]}`);
          console.log(`Found RINGSPIN: '${events[i]}'`)
      }
    };

    const selectedEvents = rawEvents.map(jsonString => JSON.parse(jsonString))

    if(selectedEvents.length == 2) {
      const startBeat = selectedEvents[0].b;
      const endBeat = selectedEvents[1].b;
      let direction = undefined
      let nameFilter = undefined 
      let startStep = undefined
      let startProp = undefined
      let startSpeed = undefined
      let startRotation = undefined
      let endStep = undefined
      let endProp = undefined
      let endSpeed = undefined
      let endRotation = undefined

      if(selectedEvents[0].customData) {
        if(selectedEvents[0].customData.direction !== undefined) {
          direction = getParam(selectedEvents[0].customData.direction)
        }
  
        if(selectedEvents[0].customData.nameFilter !== undefined) {
          nameFilter = getParam(selectedEvents[0].customData.nameFilter)
        }
  
        if(selectedEvents[0].customData.step !== undefined && StepPropagation) {
          startStep = getParam(selectedEvents[0].customData.step)
        }
  
        if(selectedEvents[0].customData.prop !== undefined && PropPropagation) {
          startProp = getParam(selectedEvents[0].customData.prop)
        }
  
        if(selectedEvents[0].customData.speed !== undefined && SpeedPropagation) {
          startSpeed = getParam(selectedEvents[0].customData.speed)
        }
  
        if(selectedEvents[0].customData.rotation !== undefined && SpeedPropagation) {
          startRotation = getParam(selectedEvents[0].customData.rotation)
        }
      } else {
        console.log(`PROPOGATION ERROR: RINGSPIN at ${startBeat} HAS NO CUSTOMDATA.`)
        return;
      }

      if(selectedEvents[1].customData) {

        if(selectedEvents[1].customData.step !== undefined && StepPropagation) {
          endStep = getParam(selectedEvents[1].customData.step)
        }
  
        if(selectedEvents[1].customData.prop !== undefined && PropPropagation) {
          endProp = getParam(selectedEvents[1].customData.prop)
        }
  
        if(selectedEvents[1].customData.speed !== undefined && SpeedPropagation) {
          endSpeed = getParam(selectedEvents[1].customData.speed)
        }
  
        if(selectedEvents[1].customData.rotation !== undefined && RotationPropagation) {
          endRotation = getParam(selectedEvents[1].customData.rotation)
        }
      } else {
        console.log(`PROPOGATION ERROR: RINGSPIN at ${endBeat} HAS NO CUSTOMDATA.`)
        return;
      }


      let stepInc = getInc(startStep,endStep,step);
      let propInc = getInc(startProp,endProp,step);
      let speedInc = getInc(startSpeed,endSpeed,step);
      let rotationInc = getInc(startRotation,endRotation,step)
      let timeInc = getInc(startBeat,endBeat,step);

      for(let i = 1; i <= step-1; i++) { // Set i to 1 to avoid overlapping the first spin, and subtract 1 from the step so it doesnt overlap the end spin.
        let stepValue = 0;
        let propValue = 0;
        let speedValue = 0;
        let rotationValue = 0;
        let timeValue = 0;

        if(TimePropagation) {
            const position = normalize(startBeat+(timeInc*i),startBeat,endBeat) // From 0 to 1
            const easedPos = ease(position,TimeEasing)
            timeValue = denormalize(easedPos, startBeat,endBeat)
        } else {

        }
        if(StepPropagation) {
          const position = normalize(startStep+(stepInc*i),startStep,endStep) // From 0 to 1
          const easedPos = ease(position,StepEasing)
          stepValue = denormalize(easedPos, startStep,endStep)
        } else {
          
        }
        if(PropPropagation) {
          const position = normalize(startProp+(propInc*i),startProp,endProp) // From 0 to 1
          const easedPos = ease(position,PropEasing)
          propValue = denormalize(easedPos, startProp,endProp)
        } else {
          
        }
        if(SpeedPropagation){
          const position = normalize(startSpeed+(speedInc*i),startSpeed,endSpeed) // From 0 to 1
          const easedPos = ease(position,SpeedEasing)
          speedValue = denormalize(easedPos, startSpeed,endSpeed)
        } else {
          
        }
        if(RotationPropagation) {
          const position = normalize(startRotation+(rotationInc*i),startRotation,endRotation) // From 0 to 1
          const easedPos = ease(position,RotationEasing)
          rotationValue = denormalize(easedPos, startRotation,endRotation)
        } else {
          
        }

        let event = {
          "b": timeValue,
          "et": 8,
          "i": 5,
          "f": 1,
          "customData": {
            "direction": direction,
            "step": stepValue,
            "prop": propValue,
            "speed": speedValue,
            "rotation": rotationValue,
            "nameFilter": nameFilter
          }
        };
        if(direction == undefined) delete event.customData.direction;
        if(nameFilter == undefined) delete event.customData.nameFilter;
        if(timeValue == undefined) {
          console.log(`Time for Ring spin was undefined, setting beat to 0.`)
          event.customData.b = 0
        }
        if(stepValue == undefined) delete event.customData.step;
        if(propValue == undefined) delete event.customData.prop;
        if(speedValue == undefined) delete event.customData.speed;
        if(rotationValue == undefined) delete event.customData.rotation; 

        events.push(event);
      }
    }
    else
    {
      console.log("Please select strictly 2 ring spins.");
    }

}

function getInc(num1, num2, step) { // Get the incement from 2 numbers and a step.
  return (num2-num1) / step;
}

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function denormalize(value, min, max) {
  return value * (max - min) + min;
}


function getParam(param) {
  if(param !== undefined) {
    return param;
  } else {
    return undefined;
  }
}

// Easings
function ease(time, easing) {
  const c1 = 1.70158; // For the Back easings
  const c3 = c1 + 1; // For the Back easings
  const c4 = (2 * Math.PI) / 3; // For elastic
switch(easing) {
  case "easeInSine":
    return 1 - Math.cos((time * Math.PI) / 2);
  case "easeOutSine":
    return Math.sin((time * Math.PI) / 2);
  case "easeInOutSine":
    return -(Math.cos(Math.PI * time) - 1) / 2;
  case "easeInCubic":
    return time * time * time;
  case "easeOutCubic":
    return 1 - Math.pow(1 - time, 3);
  case "easeInOutCubic":
    return time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;
  case "easeInQuint":
    return time * time * time * time * time;
  case "easeOutQuint":
    return 1 - Math.pow(1 - time, 5);
  case "easeInOutQuint":
    return time < 0.5 ? 16 * time * time * time * time * time : 1 - Math.pow(-2 * time + 2, 5) / 2;
  case "easeInCirc":
    return 1 - Math.sqrt(1 - Math.pow(time, 2));
  case "easeOutCirc":
    return Math.sqrt(1 - Math.pow(time - 1, 2));
  case "easeInOutCirc":
    return time < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * time, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * time + 2, 2)) + 1) / 2;
  case "easeInElastic":
    return time === 0
      ? 0
      : time === 1
      ? 1
      : -Math.pow(2, 10 * time - 10) * Math.sin((time * 10 - 10.75) * c4);
  case "easeOutElastic":
    return time === 0
      ? 0
      : time === 1
      ? 1
      : Math.pow(2, -10 * time) * Math.sin((time * 10 - 0.75) * c4) + 1;
  case "easeInOutElastic":
    const c42 = (2 * Math.PI) / 4.5;
    return time === 0
    ? 0
    : time === 1
    ? 1
    : time < 0.5
    ? -(Math.pow(2, 20 * time - 10) * Math.sin((20 * time - 11.125) * c42)) / 2
    : (Math.pow(2, -20 * time + 10) * Math.sin((20 * time - 11.125) * c42)) / 2 + 1;
  case "easeInQuad":
    return time * time;
  case "easeOutQuad":
    return 1 - (1 - time) * (1 - time);
  case "easeInOutQuad":
    return time < 0.5 ? 2 * time * time : 1 - Math.pow(-2 * time + 2, 2) / 2;
  case "easeInQuart":
    return time * time * time * time;
  case "easeOutQuart":
    return 1 - Math.pow(1 - time, 4);
  case "easeInOutQuart":
    return time < 0.5 ? 8 * time * time * time * time : 1 - Math.pow(-2 * time + 2, 4) / 2;
  case "easeInEtimepo":
    return time === 0 ? 0 : Math.pow(2, 10 * time - 10);
  case "easeOutEtimepo":
    return time === 1 ? 1 : 1 - Math.pow(2, -10 * time);
  case "easeInOutEtimepo":
    return time === 0
    ? 0
    : time === 1
    ? 1
    : time < 0.5 ? Math.pow(2, 20 * time - 10) / 2
    : (2 - Math.pow(2, -20 * time + 10)) / 2;
  case "easeInBack":
    return c3 * time * time * time - c1 * time * time;
  case "easeOutBack":
    return 1 + c3 * Math.pow(time - 1, 3) + c1 * Math.pow(time - 1, 2);
  case "easeInOutBack":
    const c2 = c1 * 1.525;
    return time < 0.5
      ? (Math.pow(2 * time, 2) * ((c2 + 1) * 2 * time - c2)) / 2
      : (Math.pow(2 * time - 2, 2) * ((c2 + 1) * (time * 2 - 2) + c2) + 2) / 2;

  case "Linear":
    return time
}
}