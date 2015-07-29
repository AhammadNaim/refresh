var utf8 = require('utf8');
var request = require('sync-request');
var colors = require("colors");
console.log("Convert.JS:".bold + " Successfully Imported Required Packages".blue);

var convertModule = function () {
    var self = this;

    self.covert = function (inputArray, callback) {



        var root = "";
        var question = "";
        var outputContentWrapper = [];
        var output = []
        var arrayLength = inputArray.length;
        console.log("Test.JS got to loading the array");

        for (var i = 0; i < arrayLength; i++) {

            var sentence = inputArray[i]


            for (c = 0; c < sentence.length; c++) {

                if (sentence[c] == " ") {

                    var root = sentence.slice(c + 1, sentence.length)
                    var keyword = sentence.slice(0, c);
                    break;

                }

            }
            var res = request('POST', 'https://api.textrazor.com', {
                body: "apiKey=c0dbc052930dce78cc1dd1b37b3d3a4fb3f609c251c4f7e34a3b452a&text=" + utf8.encode(sentence) + "&extractors=" + utf8.encode("entities,dependency-trees")
            });
            var data = JSON.parse(res.getBody().toString('utf8'));
            //console.log(res.getBody().toString('utf8'));
            console.log("Test.JS:".bold + " Successfully attempted communication with TextRazor".green);
            var entities = data.response.entities;
            if (entities != undefined) {
                for (g = 0; g < entities.length; g++) {
                    console.log(entities[g].entityEnglishId);
                    if (entities[g].entityEnglishId != "") {
                        var isAlreadyIn = output.indexOf("GCSE " + entities[g].entityEnglishId)
                        console.log("=====" + isAlreadyIn + "=====");
                        if (isAlreadyIn == -1) {
                            for (j = 0; j < data.response.sentences[0].words.length; j++) {
                                if (data.response.sentences[0].words[j].parentPosition == undefined) {
                                    console.log(data.response.sentences[0].words[j].token);
                                    output.push(data.response.sentences[0].words[j].token + " " + entities[g].entityEnglishId + " GCSE");
                                }
                            }

                        }
                    }
                }
            }
        }
        callback(output);
    }

    console.log("Convert.JS:".bold + " Successfully Defined `convert`".blue);
};

module.exports = convertModule;
