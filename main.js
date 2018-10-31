const Datastore = require('nedb'), db = new Datastore({filename: 'cards.db', autoload: true})

var addCardFlag = 1;
var showCardFlag = 0;
var learnCardFlag = 0;

var createTermInnerHTML = "<textarea id='currTerm' cols='46' rows='24' onclick='setToStart('currTerm');'></textarea>";
var createDefInnerHTML = "<textarea id='currDef' cols='46' rows='24' onclick='setToStart('currDef');'></textarea>";
var termCardsInnerHTML = "<p id='termCards'></p>";
var defCardsInnerHTML = "<p id='defCards'></p>";
var termLearnInnerHTML = "<textarea id='termLearn' cols='46' rows='24'> </textarea>";
var defLearnInnerHTML = "<textarea id='defLearn' cols='46' rows='24'> </textarea>";
var termKnownInnerHTML = "<p id='termKnown'></p>";
var defKnownInnerHTML = "<p id='defKnown'></p>"

var term = document.getElementById("term");
var definition = document.getElementById("definition");

var ids = [];
var terms = [];
var definitions = [];


function setToStart(field) {
    if(field == "currTerm")
    {
        document.getElementById("currTerm").setSelectionRange(0,0);
        document.getElementById("currTerm").value = "";
    }
    else
    {
        document.getElementById("currDef").setSelectionRange(0,0);
        document.getElementById("currDef").value = "";
    }
}

function storeCard () {
    if(addCardFlag == 0)
    {
        document.getElementById("term").innerHTML = createTermInnerHTML;
        document.getElementById("definition").innerHTML = createDefInnerHTML;
        console.log(document.getElementById("term").innerHTML);
        addCardFlag = 1;
        showCardFlag = 0;
        learnCardFlag = 0;
    }
    else
    {
        var notecard = {
            term: document.getElementById("currTerm").value,
            definition: document.getElementById("currDef").value
        };
        db.insert(notecard, function (err, newDoc) {
            console.log(newDoc);
        });
    }
}



function chooseSide(side) {
    if(showCardFlag == 1)
    {
        switch (side) {
            case "term":
                if (document.getElementById("term").style.display === "none") {
                    document.getElementById("term").style.display = "block";
                } else {
                    document.getElementById("term").style.display = "none";
                }
                break;
    
            case "def":
                if (document.getElementById("definition").style.display === "none") {
                    document.getElementById("definition").style.display = "block";
                } else {
                    document.getElementById("definition").style.display = "none";
                }
                break;
        
            default:
                break;
        }
    }
    if(learnCardFlag == 1)
    {
        switch (side) {
            case "term":
                console.log(document.getElementById("term").innerHTML);
                if (document.getElementById("term").innerHTML.includes("<p id=\"termKnown\">")) {
                    document.getElementById("term").innerHTML = "<textarea id=\"termLearn\" cols=\"46\" rows=\"20\"> </textarea> <button onclick=\"checkAnswer('term')\"> Check Answer </button>";
                    document.getElementById("prevCard").click();
                    document.getElementById("nextCard").click();
                } else {
                    document.getElementById("term").innerHTML = "<p id=\"termKnown\"></p>";
                }
                
                break;
    
            case "def":
                console.log("DEF SELECTED");
                if (document.getElementById("definition").innerHTML.includes("<p id=\"defKnown\">")) {
                    document.getElementById("definition").innerHTML = "<textarea id=\"defLearn\" cols=\"46\" rows=\"20\"> </textarea> <button onclick=\"checkAnswer('def')\"> Check Answer </button>";
                    document.getElementById("prevCard").click();
                    document.getElementById("nextCard").click();
                } else {
                    document.getElementById("definition").innerHTML = "<p id=\"defKnown\"></p>";
                }
                break;
        
            default:
                break;
        }
    }
    
}

function showCards () {
    document.getElementById("term").innerHTML = termCardsInnerHTML;
    document.getElementById("definition").innerHTML = defCardsInnerHTML;
    console.log(document.getElementById("term").innerHTML);
    addCardFlag = 0;
    showCardFlag = 1;
    learnCardFlag = 0;

    terms = [];
    db.find({}, function (err, docs) {
        console.log(docs);
        for(var i = 0; i < docs.length; ++i)
        {
            ids.push(docs[i]._id);
            terms.push(docs[i].term);
            definitions.push(docs[i].definition);
        }
        document.getElementById("termCards").innerHTML = terms[0];
        document.getElementById("defCards").innerHTML = definitions[0];
    });
}

function nextCard() {
    console.log(terms.indexOf('document.getElementById("termCards").innerHTML'));
    var currCardIndex = terms.indexOf(document.getElementById("termCards").innerHTML);
    if(currCardIndex != terms.length - 1)
    {
        document.getElementById("termCards").innerHTML = terms[currCardIndex + 1];
        document.getElementById("defCards").innerHTML = definitions[currCardIndex + 1];
    }
    else
    {
        document.getElementById("termCards").innerHTML = terms[0];
        document.getElementById("defCards").innerHTML = definitions[0];
    }
}

function prevCard() {
    console.log(terms.indexOf('document.getElementById("termCards").innerHTML'));
    var currCardIndex = terms.indexOf(document.getElementById("termCards").innerHTML);
    if(currCardIndex != 0)
    {
        document.getElementById("termCards").innerHTML = terms[currCardIndex - 1];
        document.getElementById("defCards").innerHTML = definitions[currCardIndex - 1];
    }
    else
    {
        document.getElementById("termCards").innerHTML = terms[terms.length - 1];
        document.getElementById("defCards").innerHTML = definitions[terms.length - 1];
    }
}

function nextLearn() {
    console.log(terms.indexOf('document.getElementById("termKnown").innerHTML'));
    var currCardIndex = terms.indexOf(document.getElementById("termKnown").innerHTML);
    if(currCardIndex != terms.length - 1)
    {
        document.getElementById("termKnown").innerHTML = terms[currCardIndex + 1];
        document.getElementById("defKnown").innerHTML = definitions[currCardIndex + 1];
    }
    else
    {
        document.getElementById("termKnown").innerHTML = terms[0];
        document.getElementById("defKnown").innerHTML = definitions[0];
    }
}

function advanceCorrect(side) {
    switch (side) {
        case "term":
            console.log("advancing from term!");
            currCardIndex = terms.indexOf(document.getElementById("defKnown").innerHTML);
            if(currCardIndex != terms.length - 1)
            {
                document.getElementById("defKnown").innerHTML = definitions[currCardIndex + 1];
            }
            else
            {
                document.getElementById("defKnown").innerHTML = definitions[0];
            }
            break;
    
        case "def":
            console.log("advancing from def!");
            currCardIndex = terms.indexOf(document.getElementById("termKnown").innerHTML);
            if(currCardIndex != terms.length - 1)
            {
                document.getElementById("termKnown").innerHTML = terms[currCardIndex + 1];
            }
            else
            {
                document.getElementById("termKnown").innerHTML = terms[0];
            }
            break;

        default:
            break;
    }
}

function prevLearn() {
    console.log(terms.indexOf('document.getElementById("termKnown").innerHTML'));
    var currCardIndex = terms.indexOf(document.getElementById("termKnown").innerHTML);
    if(currCardIndex != 0)
    {
        document.getElementById("termKnown").innerHTML = terms[currCardIndex - 1];
        document.getElementById("defKnown").innerHTML = definitions[currCardIndex - 1];
    }
    else
    {
        document.getElementById("termKnown").innerHTML = terms[terms.length - 1];
        document.getElementById("defKnown").innerHTML = definitions[terms.length - 1];
    }
}

function learnCards() {
    document.getElementById("term").innerHTML = termKnownInnerHTML;
    document.getElementById("definition").innerHTML = defKnownInnerHTML;
    console.log(document.getElementById("term").innerHTML);
    addCardFlag = 0;
    showCardFlag = 0;
    learnCardFlag = 1;

    terms = [];
    db.find({}, function (err, docs) {
        console.log(docs);
        for(var i = 0; i < docs.length; ++i)
        {
            terms.push(docs[i].term);
            definitions.push(docs[i].definition)
        }
        document.getElementById("termKnown").innerHTML = terms[0];
        document.getElementById("defKnown").innerHTML = definitions[0];
    });
}

function checkAnswer(side) {
    console.log(terms.indexOf('document.getElementById("termLearn").innerHTML'));
    switch (side) {
        case "term":
            currCardIndex = definitions.indexOf(document.getElementById("defKnown").innerHTML);
            if(document.getElementById("termLearn").value.toString() == terms[currCardIndex])
            {
                alert("Correct");
                document.getElementById("termLearn").value = "";
                advanceCorrect("term");
            }
            else
            {
                alert("Incorrect!");
                document.getElementById("termLearn").value = "";
            }
            break;
    
        case "def":
            currCardIndex = terms.indexOf(document.getElementById("termKnown").innerHTML);
            if(document.getElementById("defLearn").value.toString() == definitions[currCardIndex])
            {
                alert("Correct");
                document.getElementById("defLearn").value = "";
                advanceCorrect("def");
            }
            else
            {
                alert("Incorrect!");
                document.getElementById("defLearn").value = "";
            }
            break; 
            
        default:
            break;
    }
}

function switchSides() {
    for(var i = 0; i < ids.length - 1; ++i)
    {
        db.update({ _id: ids[i]}, { $set: { term: definitions[i], definition: terms[i] } }, { multi: true }, function (err, numReplaced) {
            console.log(numReplaced);
            console.log(err);
            // numReplaced = 3
            // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
          });
    }
    ids = [];
    terms = [];
    definitions = [];
    db.find({}, function (err, docs) {
        // console.log(docs);
        for(var i = 0; i < docs.length; ++i)
        {
            ids.push(docs[i]._id);
            terms.push(docs[i].term);
            definitions.push(docs[i].definition);
        }
        console.log(ids);
        console.log(terms);
        console.log(definitions);
    });
}