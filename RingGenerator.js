
// !INFO!: If you dont know what any of these parameters are; learn here: https://github.com/Aeroluna/Heck/wiki/Events#ring-rotation

module.exports = {
  name: "Spin Generator",
  params: {
    Direction: 0,
    Step: 0,
    Prop: 1,
    Speed: 1,
    Rotation: 360,
    Target: ["","SmallTrackLaneRings","BigTrackLaneRings"]
  },
  run: fourTwentee,
};

function fourTwentee(cursor, notes, events, walls, _, global, data) {
    const target = global.params.Target
    const direction = global.params.Direction
    const step = global.params.Step
    const prop = global.params.Prop
    const speed = global.params.Speed
    const rotation = global.params.Rotation

    let event = {
      "b": cursor,
      "et": 8,
      "i": 5,
      "f": 1,
      "customData": {
        "direction": direction,
        "step": step,
        "prop": prop,
        "speed": speed,
        "rotation": rotation,
        "nameFilter": target
      }
    };
    if(event.customData.nameFilter == "") delete event.customData.nameFilter;

    events.push(event);
}
