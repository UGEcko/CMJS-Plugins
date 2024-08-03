
// !INFO!: If you dont know what any of these parameters are; learn here: https://github.com/Aeroluna/Heck/wiki/Events#ring-rotation

module.exports = {
  name: "Spin Propagation",
  params: {
    DirectionPropagation: true,
    StepPropagation: true,
    PropPropagation: true,
    SpeedPropagation: true,
    RotationPropagation: true,
    Step: ["16","2","4","8","32","64"]
  },
  run: fourTwentee,
};

// TODO:
/*
Add: Easings to the time.
Fix: Any propagation over 1 beat seems to break? This may be because of another issue. But the propagation will always be 1 beat for some reason
Fix: Events just not carrying data? They will be defaulted to 1 and stuff (Since step was what I was testing most, that worked. However when I had speed and rotation propagated, it just defaulted.)

*/

function fourTwentee(cursor, notes, events, walls, _, global, data) {
    const StepPropagation = global.params.StepPropagation;
    const PropPropagation = global.params.PropPropagation;
    const SpeedPropagation = global.params.SpeedPropagation;
    const RotationPropagation = global.params.RotationPropagation;
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
          delete events[i];
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
  
        if(selectedEvents[0].customData.speed !== undefined) {
          startSpeed = getParam(selectedEvents[0].customData.speed && SpeedPropagation)
        }
  
        if(selectedEvents[0].customData.rotation !== undefined) {
          startRotation = getParam(selectedEvents[0].customData.rotation && RotationPropagation)
        }
      } else {
        console.log(`PROPOGATION ERROR: RINGSPIN at ${startBeat} HAS NO CUSTOMDATA.`)
        return;
      }

      if(selectedEvents[1].customData) {

        if(selectedEvents[1].customData.step !== undefined && StepPropagation) {
          endStep = getParam(selectedEvents[1].customData.step)
        }
  
        if(selectedEvents[1].customData.prop !== undefined) {
          endProp = getParam(selectedEvents[1].customData.prop && PropPropagation)
        }
  
        if(selectedEvents[1].customData.speed) {
          endSpeed = getParam(selectedEvents[1].customData.speed && SpeedPropagation)
        }
  
        if(selectedEvents[1].customData.rotation !== undefined) {
          endRotation = getParam(selectedEvents[1].customData.rotation && RotationPropagation)
        }
      } else {
        console.log(`PROPOGATION ERROR: RINGSPIN at ${endBeat} HAS NO CUSTOMDATA.`)
        return;
      }


      let stepInc = getInc(startStep,endStep,step);
      let propInc = getInc(startProp,endProp,step);
      let speedInc = getInc(startSpeed,endSpeed,step);
      let rotationInc = getInc(startRotation,endRotation,step)

      console.log("Setting events...")
      for(let i = 0; i <= step; i++) { 
        
        let event = {
          "b": startBeat+((1/step)*i),
          "et": 8,
          "i": 5,
          "f": 1,
          "customData": {
            "direction": direction,
            "step": startStep+(stepInc*i),
            "prop": startProp+(propInc*i),
            "speed": startSpeed+(speedInc*i),
            "rotation": startRotation+(rotationInc*i),
            "nameFilter": nameFilter
          }
        };
        // Delete any properties that arent numbers. (This would happen because one of the events doesnt have a property).
        console.log("Set events.")
        console.log("Checking direction validity.")
        if(direction == undefined) delete event.customData.direction;
        console.log("Checked direction validity.")
        if(isNaN(event.customData.step)) delete event.customData.step;
        if(isNaN(event.customData.prop)) delete event.customData.prop;
        if(isNaN(event.customData.speed)) delete event.customData.speed;
        if(isNaN(event.customData.rotation)) delete event.customData.rotation;
        if(nameFilter == undefined) delete event.customData.nameFilter;
    
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


function getParam(param) {
  if(param !== undefined) {
    return param;
  } else {
    return undefined;
  }
}
