import { some } from "../fable-library.4.9.0/Option.js";
import Timer from "../fable-library.4.9.0/Timer.js";
import { add } from "../fable-library.4.9.0/Observable.js";

export function Log_onError(text, ex) {
    console.error(some(text), ex);
}

export function Log_toConsole(text, o) {
    console.log(some(text), o);
}

export function Timer_delay(interval, callback) {
    let t;
    let returnVal = new Timer(interval);
    returnVal.AutoReset = false;
    t = returnVal;
    add(callback, t.Elapsed());
    t.Enabled = true;
    t.Start();
}

