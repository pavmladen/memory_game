open Elmish
open Elmish.React 
open Feliz
open System

type Score = int
type Timer = int

type Field = {Name : string; Url : string; mutable TimesClicked : int; mutable isPaired : bool}

let mutable AllFields : list<Field> = [
    {Name = "seal"; Url = "images/seal.png"; TimesClicked = 0; isPaired = false;};
    {Name = "seal1"; Url = "images/seal.png"; TimesClicked = 0; isPaired = false;};
    {Name = "tiger"; Url = "images/tiger.png"; TimesClicked = 0; isPaired = false;};
    {Name = "tiger1"; Url = "images/tiger.png"; TimesClicked = 0; isPaired = false;};
    {Name = "deer"; Url = "images/deer.png"; TimesClicked = 0; isPaired = false;};
    {Name = "deer1"; Url = "images/deer.png"; TimesClicked = 0; isPaired = false;};
    {Name = "elephant"; Url = "images/elephant.png"; TimesClicked = 0; isPaired = false;};
    {Name = "elephant1"; Url = "images/elephant.png"; TimesClicked = 0; isPaired = false;};
    {Name = "owl"; Url = "images/owl.png"; TimesClicked = 0; isPaired = false;};
    {Name = "owl1"; Url = "images/owl.png"; TimesClicked = 0; isPaired = false;};
    {Name = "monkey"; Url = "images/monkey.png"; TimesClicked = 0; isPaired = false;};
    {Name = "monkey1"; Url = "images/monkey.png"; TimesClicked = 0; isPaired = false;};
]

let insertAt index element list =
    List.take index list @ [element] @ List.skip index list
let private getRandomIndex maxIndex =
    System.Random().Next(0, maxIndex)
let shuffleFields (list : list<Field>) =
    let rec loop i acc = function
        | [] -> acc
        | x::xs ->
            let randomIndex = getRandomIndex (i + 1)
            let shuffledList = insertAt randomIndex x acc
            loop (i + 1) shuffledList xs

    loop 0 [] list
AllFields <- shuffleFields AllFields

let addScore (field1 : Field) (field2 : Field) : int =
    let a = match field1.TimesClicked with 
                | 0 | 1 | 2 -> 10
                | 3 -> 5
                | 4 -> 2
                | _ -> 0
    let b = match field2.TimesClicked with 
                | 0 | 1 | 2 -> 10
                | 3 -> 5
                | 4 -> 2
                | _ -> 0
    a + b
 
type State = 
    | InitialFields of score : Score * timer : Timer * numberOfMatched : int
    | FirstFieldClicked of Score * Timer * int * Field
    | SecondFieldClicked of Score * Timer * int * Field * Field 
    | GameOver of Score 

type Message = 
    | FieldClicked of Field
    | ResetGame
    | DecreaseTimer
    | ReturnToGame

let DecTimer dispatch = 
    async {
        do! Async.Sleep 1000
        dispatch DecreaseTimer
    }
let decTimer dispatch = 
    Async.Start (
        computation = DecTimer dispatch
    )

let Wait750 dispatch = 
    async {
        do! Async.Sleep 750
        dispatch ReturnToGame
    }
let wait750 dispatch = 
    Async.Start (
        computation = Wait750 dispatch 
    )

let Wait1500 dispatch = 
    async {
        do! Async.Sleep 1500
        dispatch ReturnToGame
    }
let wait1500 dispatch = 
    Async.Start (
        computation = Wait1500 dispatch 
    )

let init () = 
    InitialFields (0, 30,  0), Cmd.ofEffect decTimer

let update (msg : Message) (state : State) = 
    match state with 
    | InitialFields (score, timer, n) -> 
        if n = 6 || timer = 0 then 
            GameOver (score), Cmd.none 
        else 
            match msg with 
            | DecreaseTimer -> InitialFields (score, timer - 1, n), Cmd.ofEffect decTimer 
            | FieldClicked field -> 
                field.TimesClicked <- field.TimesClicked + 1
                FirstFieldClicked (score, timer, n, field), Cmd.none 
            | _ -> state, Cmd.none
    | FirstFieldClicked (score, timer, n, field1) -> 
        if n = 6 || timer = 0 then
            GameOver (score), Cmd.none 
        else 
            match msg with 
            | DecreaseTimer -> FirstFieldClicked (score, timer - 1, n, field1), Cmd.ofEffect decTimer 
            | FieldClicked field2 -> 
                if field2 = field1 then 
                    state, Cmd.none 
                else
                    field2.TimesClicked <- field2.TimesClicked + 1    
                    if field1.Url = field2.Url then 
                        field1.isPaired <- true 
                        field2.isPaired <- true 
                        SecondFieldClicked (score + addScore field1 field2, timer, n + 1, field1, field2), Cmd.ofEffect wait1500
                    else 
                        SecondFieldClicked (score, timer, n, field1, field2), Cmd.ofEffect wait750
            | _ -> state, Cmd.none 
    | SecondFieldClicked (score, timer, n, field1, field2) -> 
        if n = 6 || timer = 0 then 
            GameOver (score), Cmd.none 
        else  
            match msg with 
            | DecreaseTimer -> SecondFieldClicked (score, timer - 1, n, field1, field2), Cmd.ofEffect decTimer 
            | ReturnToGame -> InitialFields (score, timer, n), Cmd.none 
            | FieldClicked field -> state, Cmd.none
            | _ -> state, Cmd.none 
    | GameOver score -> 
        for field in AllFields do
            field.TimesClicked <- 0 
            field.isPaired <- false 
        AllFields <- shuffleFields AllFields
        match msg with 
        | ResetGame -> InitialFields (0, 30, 0), Cmd.ofEffect decTimer 
        | _ -> state, Cmd.none

let displayField (field : Field) (dispatch : Message -> unit) (state : State) =
    Html.img [
        prop.style [
        style.margin 10;
        style.height 190;
        style.width 230;
        ]
        if field.isPaired = false then 
            prop.onClick (fun _ -> dispatch (FieldClicked field))
        let url : string = 
            match state with 
                | InitialFields (score, timer, n) -> 
                    if field.isPaired then
                        "None"
                    else    
                        "images/hidden.png"
                | FirstFieldClicked (score, timer, n, field1) -> 
                    if field.isPaired then 
                        "None"
                    elif field1.Name = field.Name then 
                        field.Url 
                    else 
                        "images/hidden.png"
                | SecondFieldClicked (score, timer, n, field1, field2) -> 
                    if field1.Name = field.Name || field2.Name = field.Name then 
                        field.Url
                    elif field.isPaired then 
                        "None"
                    else 
                        "images/hidden.png"
                | _ -> "None"
        if url = "None" then 
            prop.src "images/nothing.png"
        else 
            prop.src url
    ]

let info (timer : Timer) (score : Score) = 
    Html.div [
        prop.style [
            style.margin 0;
            style.padding 0;
            style.width 450;
            style.height 130;
            style.marginBottom 30;
            style.textAlign.center;
            style.fontFamily "'Helvetica Neue', Arial, sans-serif";  
            style.fontSize 40;
        ]
        prop.children [
            Html.div [
                prop.style [
                    style.paddingTop 5;
                ]
                prop.text ("Time remaining: " + string timer)
            ]
            Html.br[];
            Html.div [
                prop.text ("Score: " + string score)
            ]
        ]
    ]

let displayAllFields (dispatch : Message -> unit) (state : State) (timer : Timer) (score : Score) =
    Html.div [
        prop.style [
        style.padding 20; 
        style.margin 20;
        style.display.flex;
        style.flexDirection.column;
        style.alignItems.center;
        style.justifyContent.center;
        ]
        prop.children [
            info timer score
            Html.br[];
            Html.div [
                for i in [0..3] do 
                    displayField AllFields[i] dispatch state
                Html.br[];
                for i in [4..7] do 
                    displayField AllFields[i] dispatch state
                Html.br[];
                for i in [8..11] do 
                    displayField AllFields[i] dispatch state
            ]
        ]
    ]
    

let gameOver score dispatch = 
    Html.div [
        prop.style [
            style.display.flex;
            style.flexDirection.column;
            style.alignItems.center;
            style.justifyContent.center;
        ]
        prop.children [
            Html.img [
                prop.style [
                    style.margin 20;
                    style.width 500;
                    style.height 400;
                ]
                prop.src "images/gameover.png"
            ]
            Html.br[];
            Html.label [
                prop.style [
                    style.margin 20;
                    style.width 400;
                    style.height 100;
                    style.fontSize 50;
                    style.textAlign.center; 
                    style.fontStyle.oblique;
                    style.fontWeight.bolder;
                    style.fontFamily "'Helvetica Neue', Arial, sans-serif";  
                ]
                prop.text ("Your score: " + string score)
            ]
            Html.br[];
            Html.button [
                prop.style [
                    style.margin 30;
                    style.padding 10;
                    style.height 100;
                    style.width 400;
                    style.fontSize 60;
                    style.backgroundColor "Orange"
                    style.borderRadius 15;

                ]
                prop.text "Reset Game"
                prop.onClick (fun _ -> dispatch ResetGame)
            ]
        ]
    ]

let render (state : State) (dispatch : Message -> unit) =
    Html.div [
        prop.style [
            style.display.flex;
            style.alignItems.center;
            style.justifyContent.center;
        ]
        prop.children [
            match state with 
            | InitialFields (score, timer, n) -> 
                displayAllFields dispatch state timer score 
            | FirstFieldClicked (score, timer, n, field1) ->
                displayAllFields dispatch state timer score 
            | SecondFieldClicked (score, timer, n, field1, field2) -> 
                displayAllFields dispatch state timer score 
            | GameOver score-> 
                gameOver score dispatch
        ]
    ]
    

Program.mkProgram init update render
    |> Program.withReactSynchronous "app"
    |> Program.run 
 