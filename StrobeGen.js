module.exports = {
    name: 'Stobe Generator',
    params: {
        'ValueA': ["On","Off", "Flash", "Fade"],
        'ValueB': ["Off","On", "Flash", "Fade"],
        'Color': ["Selected", "Red Events", "Blue Events"],
        'Step': [16,1,2,4,8,32,64],
    },
    run: strobeGen,
};

function findEventIndex(value) {
    switch(value){
        case "On":
            return 5;
        case "Off":
            return 0;
        case "Flash":
            return 7;
        case "Fade": 
            return 6;
        default:
            return 5;
    }
}
// I didnt copy the first/last events index as I thought it would be better for the user to select it manually.

function strobeGen(cursor, notes, events, walls, _, global, data) {
    var selectedEvents = [];
    var sEventIndex = []; // Keep track of the selected events index, use to delete.

    for (let i = 0; i < events.length; i++) {
        if (events[i].selected) {
            selectedEvents.push(`${events[i]}`);
            sEventIndex.push(i);
            console.log(events[i])
        }
    };
    selectedEvents.sort((a, b) => a.b - b.b); // Sort by b(eat) time (lowest to highest)
    const mappedSelectedEvents = selectedEvents.map(jsonString => JSON.parse(jsonString))
    // Logging the mappedSelectedEvents by forEach will give you the times from lowest to largest
    //events.splice(sEventIndex[1],1) // Since I logged the indexes of both the start and end event, I can remove the end event by its index in 'events' to leave room for the last event when the strobe is being made. 
    if(selectedEvents.length == 2) { // If there are ONLY 2 selected events
        events.splice(sEventIndex[0],1) // Remove both the start and end event so the strobe can be added in. (In the end, the initial events are just start and end params for the strobe.)
        events.splice(sEventIndex[1],1)
        start = mappedSelectedEvents[0].b
        end = mappedSelectedEvents[1].b
        var color = [1,1,1,1]
        switch(global.params.Color) {
            case "Selected":
                if(JSON.stringify(mappedSelectedEvents).includes('color')) { // If color isnt there then it will be undefined, dont want that happening oh nononononono
                    color = mappedSelectedEvents[0].customData.color
                } else {
                    color = [1,0,0,1]
                    console.log("Selected color not found. Using red event color")
                }
                break;
            case "Red Events":
                color = [1,0,0,1]
                break;
            case "Blue Events":
                color = [0,0,1,1]
                break;
            default:
                color = [1,1,1,1]
                break;
        }
        const step = 1/global.params.Step
        const alternatingStep = step*2
        const amountOfEvents = ((end-start)/step)/2
        for(let i = 0; i <amountOfEvents; i++) {
            let event = {
                "b": (start)+(alternatingStep*i),
                "et": mappedSelectedEvents[0].et, // use the "et" from the selectedEvent with the lowest time (first event)
                "i": findEventIndex(global.params.ValueA),
                "f": 1,
                "customData": {
                  "color": color
                }
            }
        let event2 = {
            "b": (start+step)+(alternatingStep*i),
            "et": mappedSelectedEvents[0].et, // Same here
            "i": findEventIndex(global.params.ValueB),
            "f": 1,
            "customData": {
              "color": color
            }
        }
        if(event.i == 0) {
            delete event.customData;
        }
        if(event2.i == 0) {
            delete event2.customData;
        }
        events.push(event)
        events.push(event2)
        }
    } 
    else {
        console.log('**You need to select strictly 2 events to create a strobe**')
    }
}