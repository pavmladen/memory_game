import { toString, Union, Record } from "./fable_modules/fable-library.4.9.0/Types.js";
import { union_type, record_type, bool_type, int32_type, string_type } from "./fable_modules/fable-library.4.9.0/Reflection.js";
import { int32ToString, createObj, disposeSafe, getEnumerator, equals, createAtom } from "./fable_modules/fable-library.4.9.0/Util.js";
import { item, empty, head, tail, isEmpty, skip, singleton, take, append, ofArray } from "./fable_modules/fable-library.4.9.0/List.js";
import { nonSeeded } from "./fable_modules/fable-library.4.9.0/Random.js";
import { singleton as singleton_1 } from "./fable_modules/fable-library.4.9.0/AsyncBuilder.js";
import { start, sleep } from "./fable_modules/fable-library.4.9.0/Async.js";
import { Cmd_none, Cmd_ofEffect } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { createElement } from "react";
import { map, empty as empty_1, singleton as singleton_2, append as append_1, delay, toList } from "./fable_modules/fable-library.4.9.0/Seq.js";
import { Interop_reactApi } from "./fable_modules/Feliz.2.7.0/Interop.fs.js";
import { rangeDouble } from "./fable_modules/fable-library.4.9.0/Range.js";
import { ProgramModule_mkProgram, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export class Field extends Record {
    constructor(Name, Url, TimesClicked, isPaired) {
        super();
        this.Name = Name;
        this.Url = Url;
        this.TimesClicked = (TimesClicked | 0);
        this.isPaired = isPaired;
    }
}

export function Field_$reflection() {
    return record_type("Program.Field", [], Field, () => [["Name", string_type], ["Url", string_type], ["TimesClicked", int32_type], ["isPaired", bool_type]]);
}

export let AllFields = createAtom(ofArray([new Field("seal", "images/seal.png", 0, false), new Field("seal1", "images/seal.png", 0, false), new Field("tiger", "images/tiger.png", 0, false), new Field("tiger1", "images/tiger.png", 0, false), new Field("deer", "images/deer.png", 0, false), new Field("deer1", "images/deer.png", 0, false), new Field("elephant", "images/elephant.png", 0, false), new Field("elephant1", "images/elephant.png", 0, false), new Field("owl", "images/owl.png", 0, false), new Field("owl1", "images/owl.png", 0, false), new Field("monkey", "images/monkey.png", 0, false), new Field("monkey1", "images/monkey.png", 0, false)]));

export function insertAt(index, element, list) {
    return append(take(index, list), append(singleton(element), skip(index, list)));
}

function getRandomIndex(maxIndex) {
    return nonSeeded().Next2(0, maxIndex);
}

export function shuffleFields(list) {
    const loop = (i_mut, acc_mut, _arg_mut) => {
        loop:
        while (true) {
            const i = i_mut, acc = acc_mut, _arg = _arg_mut;
            if (!isEmpty(_arg)) {
                const xs = tail(_arg);
                const x = head(_arg);
                const randomIndex = getRandomIndex(i + 1) | 0;
                const shuffledList = insertAt(randomIndex, x, acc);
                i_mut = (i + 1);
                acc_mut = shuffledList;
                _arg_mut = xs;
                continue loop;
            }
            else {
                return acc;
            }
            break;
        }
    };
    return loop(0, empty(), list);
}

AllFields(shuffleFields(AllFields()));

export function addScore(field1, field2) {
    let a;
    const matchValue = field1.TimesClicked | 0;
    switch (matchValue) {
        case 0:
        case 1:
        case 2: {
            a = 10;
            break;
        }
        case 3: {
            a = 5;
            break;
        }
        case 4: {
            a = 2;
            break;
        }
        default:
            a = 0;
    }
    let b;
    const matchValue_1 = field2.TimesClicked | 0;
    switch (matchValue_1) {
        case 0:
        case 1:
        case 2: {
            b = 10;
            break;
        }
        case 3: {
            b = 5;
            break;
        }
        case 4: {
            b = 2;
            break;
        }
        default:
            b = 0;
    }
    return (a + b) | 0;
}

export class State extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["InitialFields", "FirstFieldClicked", "SecondFieldClicked", "GameOver"];
    }
}

export function State_$reflection() {
    return union_type("Program.State", [], State, () => [[["score", int32_type], ["timer", int32_type], ["numberOfMatched", int32_type]], [["Item1", int32_type], ["Item2", int32_type], ["Item3", int32_type], ["Item4", Field_$reflection()]], [["Item1", int32_type], ["Item2", int32_type], ["Item3", int32_type], ["Item4", Field_$reflection()], ["Item5", Field_$reflection()]], [["Item", int32_type]]]);
}

export class Message extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["FieldClicked", "ResetGame", "DecreaseTimer", "ReturnToGame"];
    }
}

export function Message_$reflection() {
    return union_type("Program.Message", [], Message, () => [[["Item", Field_$reflection()]], [], [], []]);
}

export function DecTimer(dispatch) {
    return singleton_1.Delay(() => singleton_1.Bind(sleep(1000), () => {
        dispatch(new Message(2, []));
        return singleton_1.Zero();
    }));
}

export function decTimer(dispatch) {
    start(DecTimer(dispatch));
}

export function Wait750(dispatch) {
    return singleton_1.Delay(() => singleton_1.Bind(sleep(750), () => {
        dispatch(new Message(3, []));
        return singleton_1.Zero();
    }));
}

export function wait750(dispatch) {
    start(Wait750(dispatch));
}

export function Wait1500(dispatch) {
    return singleton_1.Delay(() => singleton_1.Bind(sleep(1500), () => {
        dispatch(new Message(3, []));
        return singleton_1.Zero();
    }));
}

export function wait1500(dispatch) {
    start(Wait1500(dispatch));
}

export function init() {
    return [new State(0, [0, 30, 0]), Cmd_ofEffect((dispatch) => {
        decTimer(dispatch);
    })];
}

export function update(msg, state) {
    switch (state.tag) {
        case 1: {
            const timer_1 = state.fields[1] | 0;
            const score_1 = state.fields[0] | 0;
            const n_1 = state.fields[2] | 0;
            const field1 = state.fields[3];
            if ((n_1 === 6) ? true : (timer_1 === 0)) {
                return [new State(3, [score_1]), Cmd_none()];
            }
            else {
                switch (msg.tag) {
                    case 2:
                        return [new State(1, [score_1, timer_1 - 1, n_1, field1]), Cmd_ofEffect((dispatch_1) => {
                            decTimer(dispatch_1);
                        })];
                    case 0: {
                        const field2 = msg.fields[0];
                        if (equals(field2, field1)) {
                            return [state, Cmd_none()];
                        }
                        else {
                            field2.TimesClicked = ((field2.TimesClicked + 1) | 0);
                            if (field1.Url === field2.Url) {
                                field1.isPaired = true;
                                field2.isPaired = true;
                                return [new State(2, [score_1 + addScore(field1, field2), timer_1, n_1 + 1, field1, field2]), Cmd_ofEffect((dispatch_2) => {
                                    wait1500(dispatch_2);
                                })];
                            }
                            else {
                                return [new State(2, [score_1, timer_1, n_1, field1, field2]), Cmd_ofEffect((dispatch_3) => {
                                    wait750(dispatch_3);
                                })];
                            }
                        }
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 2: {
            const timer_2 = state.fields[1] | 0;
            const score_2 = state.fields[0] | 0;
            const n_2 = state.fields[2] | 0;
            const field2_1 = state.fields[4];
            const field1_1 = state.fields[3];
            if ((n_2 === 6) ? true : (timer_2 === 0)) {
                return [new State(3, [score_2]), Cmd_none()];
            }
            else {
                switch (msg.tag) {
                    case 2:
                        return [new State(2, [score_2, timer_2 - 1, n_2, field1_1, field2_1]), Cmd_ofEffect((dispatch_4) => {
                            decTimer(dispatch_4);
                        })];
                    case 3:
                        return [new State(0, [score_2, timer_2, n_2]), Cmd_none()];
                    case 0: {
                        const field_1 = msg.fields[0];
                        return [state, Cmd_none()];
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 3: {
            const score_3 = state.fields[0] | 0;
            const enumerator = getEnumerator(AllFields());
            try {
                while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                    const field_2 = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                    field_2.TimesClicked = 0;
                    field_2.isPaired = false;
                }
            }
            finally {
                disposeSafe(enumerator);
            }
            AllFields(shuffleFields(AllFields()));
            if (msg.tag === 1) {
                return [new State(0, [0, 30, 0]), Cmd_ofEffect((dispatch_5) => {
                    decTimer(dispatch_5);
                })];
            }
            else {
                return [state, Cmd_none()];
            }
        }
        default: {
            const timer = state.fields[1] | 0;
            const score = state.fields[0] | 0;
            const n = state.fields[2] | 0;
            if ((n === 6) ? true : (timer === 0)) {
                return [new State(3, [score]), Cmd_none()];
            }
            else {
                switch (msg.tag) {
                    case 2:
                        return [new State(0, [score, timer - 1, n]), Cmd_ofEffect((dispatch) => {
                            decTimer(dispatch);
                        })];
                    case 0: {
                        const field = msg.fields[0];
                        field.TimesClicked = ((field.TimesClicked + 1) | 0);
                        return [new State(1, [score, timer, n, field]), Cmd_none()];
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
    }
}

export function displayField(field, dispatch, state) {
    return createElement("img", createObj(toList(delay(() => append_1(singleton_2(["style", {
        margin: 10,
        height: 190,
        width: 230,
    }]), delay(() => append_1((field.isPaired === false) ? singleton_2(["onClick", (_arg) => {
        dispatch(new Message(0, [field]));
    }]) : empty_1(), delay(() => {
        let url;
        switch (state.tag) {
            case 0: {
                const timer = state.fields[1] | 0;
                const score = state.fields[0] | 0;
                const n = state.fields[2] | 0;
                url = (field.isPaired ? "None" : "images/hidden.png");
                break;
            }
            case 1: {
                const timer_1 = state.fields[1] | 0;
                const score_1 = state.fields[0] | 0;
                const n_1 = state.fields[2] | 0;
                const field1 = state.fields[3];
                url = (field.isPaired ? "None" : ((field1.Name === field.Name) ? field.Url : "images/hidden.png"));
                break;
            }
            case 2: {
                const timer_2 = state.fields[1] | 0;
                const score_2 = state.fields[0] | 0;
                const n_2 = state.fields[2] | 0;
                const field2 = state.fields[4];
                const field1_1 = state.fields[3];
                url = (((field1_1.Name === field.Name) ? true : (field2.Name === field.Name)) ? field.Url : (field.isPaired ? "None" : "images/hidden.png"));
                break;
            }
            default:
                url = "None";
        }
        return (url === "None") ? singleton_2(["src", "images/nothing.png"]) : singleton_2(["src", url]);
    }))))))));
}

export function info(timer, score) {
    let elems;
    return createElement("div", createObj(ofArray([["style", {
        margin: 0,
        padding: 0,
        width: 450,
        height: 130,
        marginBottom: 30,
        textAlign: "center",
        fontFamily: "\'Helvetica Neue\', Arial, sans-serif",
        fontSize: 40 + "px",
    }], (elems = [createElement("div", {
        style: {
            paddingTop: 5,
        },
        children: "Time remaining: " + int32ToString(timer),
    }), createElement("br", {}), createElement("div", {
        children: "Score: " + int32ToString(score),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

export function displayAllFields(dispatch, state, timer, score) {
    let elems, children;
    return createElement("div", createObj(ofArray([["style", {
        padding: 20,
        margin: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }], (elems = [info(timer, score), createElement("br", {}), (children = toList(delay(() => append_1(map((i) => displayField(item(i, AllFields()), dispatch, state), toList(rangeDouble(0, 1, 3))), delay(() => append_1(singleton_2(createElement("br", {})), delay(() => append_1(map((i_1) => displayField(item(i_1, AllFields()), dispatch, state), toList(rangeDouble(4, 1, 7))), delay(() => append_1(singleton_2(createElement("br", {})), delay(() => map((i_2) => displayField(item(i_2, AllFields()), dispatch, state), toList(rangeDouble(8, 1, 11))))))))))))), createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    }))], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

export function gameOver(score, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["style", {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }], (elems = [createElement("img", {
        style: {
            margin: 20,
            width: 500,
            height: 400,
        },
        src: "images/gameover.png",
    }), createElement("br", {}), createElement("label", {
        style: {
            margin: 20,
            width: 400,
            height: 100,
            fontSize: 50 + "px",
            textAlign: "center",
            fontStyle: "oblique",
            fontWeight: "bolder",
            fontFamily: "\'Helvetica Neue\', Arial, sans-serif",
        },
        children: "Your score: " + toString(score),
    }), createElement("br", {}), createElement("button", {
        style: {
            margin: 30,
            padding: 10,
            height: 100,
            width: 400,
            fontSize: 60 + "px",
            backgroundColor: "Orange",
            borderRadius: 15,
        },
        children: "Reset Game",
        onClick: (_arg) => {
            dispatch(new Message(1, []));
        },
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

export function render(state, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["style", {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }], (elems = toList(delay(() => {
        switch (state.tag) {
            case 1: {
                const timer_1 = state.fields[1] | 0;
                const score_1 = state.fields[0] | 0;
                const n_1 = state.fields[2] | 0;
                const field1 = state.fields[3];
                return singleton_2(displayAllFields(dispatch, state, timer_1, score_1));
            }
            case 2: {
                const timer_2 = state.fields[1] | 0;
                const score_2 = state.fields[0] | 0;
                const n_2 = state.fields[2] | 0;
                const field2 = state.fields[4];
                const field1_1 = state.fields[3];
                return singleton_2(displayAllFields(dispatch, state, timer_2, score_2));
            }
            case 3: {
                const score_3 = state.fields[0] | 0;
                return singleton_2(gameOver(score_3, dispatch));
            }
            default: {
                const timer = state.fields[1] | 0;
                const score = state.fields[0] | 0;
                const n = state.fields[2] | 0;
                return singleton_2(displayAllFields(dispatch, state, timer, score));
            }
        }
    })), ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

ProgramModule_run(Program_withReactSynchronous("app", ProgramModule_mkProgram(init, update, render)));

