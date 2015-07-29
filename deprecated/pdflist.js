var request = require("request");
var cheerio = require("cheerio");
var colors = require("colors");
console.log("PDFList.js: ".bold + " Successfully Imported Required Packages".green);


Array.prototype.last = function() {
    return this[this.length - 1];
}
console.log("PDFList.js: ".bold + " Successfully Declared `last`".green);

var collectModule = function() {
    var self = this;

    self.collectURLs = function(number, convert, callback) { // returns an array of the links and numbers for each syllabus
        // PLEASE PASS <number> AS A STRING!
        var newArray = [];
        var links = {
            syllabus: null,
            pdfs: []
        };
        console.log("PDFList.js: ".bold + "Successfully Defined Global Variables".green);
        request("http://www.cie.org.uk/programmes-and-qualifications/cambridge-secondary-2/cambridge-igcse/subjects/", function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("PDFList.js: ".bold + "Successfully Requested Website For List of Subjects".green);
                $ = cheerio.load(body);
                $(".emphasized-link").find("li").each(function() { // loop through each link
                    var selector = $(this).find("a").attr("href");
                    newArray.push({
                        "dom_object": $(this), // this is so we can access it later
                        "number": selector.split("-").last().replace("/", ""), // number
                        "link": baseURL + selector // link
                    });
                });
                for (i = 0; i < newArray.length; i++) {
                    if (String(newArray[i].number) == String(number)) { // we got a match for the subject
                        links.syllabus = newArray[i].link;
                        request(baseURL + newArray[i].dom_object.find("a").attr("href"), function(error2, response2, body2) {
                            console.log("PDFList.js: ".bold + "Successfully Requested Website For List Of PDFs".green);
                            $new = cheerio.load(body2);
                            $new(".binaryLink").find("a").each(function() {
                                var PDFLink = $new(this).attr("href");
                                links.pdfs.push(PDFLink); // is working
                                //    console.log("PDFList.js: ".bold + $new(this).text().blue + " => " + baseURL.green + PDFLink.green);
                            });
                            //console.log("PDFList.js: ".bold + "Got ".green + String(links.pdfs.length).blue + " PDFs".green);
                        });
                    }
                }
                console.log("collectURLs has finished".red);
                if (convert) {
                    doPDFConversions(links, function(html) { // insert pdf conversion function here and return HTML to the callback
                        if (callback !== undefined) {
                            callback(html);
                        }
                    });
                }
            }
        });
    }
}
var number = "0600";
collectURLs(number, function(link) {
    console.log("PDFList.js: ".bold + "The link for " + number.red + " is " + link.red);
});

console.log("PDFList.js: ".bold + " Successfully Declared `collectURL`".green);

module.exports = collectModule;