if (process.argv.length !== 3) {
    console.error('Specify source JSON file.');
    process.exit(1);
}


var drop_retweets = true;
var drop_interactions_with_links = true;
var file = process.argv[2];
var count = 0;

var fs = require('fs')
    , byline = require('byline')
    , stream = fs.createReadStream(file)
    , stream = byline.createStream(stream)
    ;

var read = require("read");
//var stdin = process.stdin, stdout = process.stdout;
var to_classify = [];



try {
    var config = JSON.parse(fs.readFileSync('config.json'));
}
catch (err) {
    throw new Error('Error parsing JSON config file.')
}


var optionsString = '';
var optionKeys = [];
for (var key in config.options) {
    if (config.options.hasOwnProperty(key)) {
        optionKeys.push(key);
        optionsString += '('+ key + ') ' + config.options[key] + ', ';
    }
}
optionsString = optionsString.substring(0, optionsString.length - 2);

stream.on('data', function(line) {

    try{
        var data = JSON.parse(line);
    } catch (e) {
        //console.log('ERROR: Unable to parse JSON' + e);
        return;
    }

    if(data.interaction === undefined || data.interaction.content === undefined) {
        //console.log('DEBUG: Ignoring due to missing content property.');
        return;
    }

    if(drop_retweets === true){
        if(data.twitter !== undefined && data.twitter.retweet !== undefined){
           // console.log('DEBUG: Ignoring retweet.');
            return;
        }
    }

    if(drop_interactions_with_links === true){
        if(data.links !== undefined && data.links.url !== undefined){
            //console.log('DEBUG: Ignoring content with link.');
            return;
        }
    }

    to_classify.push(data.interaction.content);
});


function showLine(i){

    if (!to_classify[i]){
        console.log("\n\nClassification complete.")
        process.exit(-1);
    }

    read({prompt:  '--> "' + to_classify[i] + '"' + "\n " + optionsString + ", e(x)it: " }, function (err, selection) {

        if (selection == "x"){ process.exit(-1); }

        interaction = to_classify[i].toString().trim();

        if (optionKeys.indexOf(selection) > -1) {
            save(interaction, config.options[selection]);
            delete to_classify[i]; // todo: should cleanup array really
            showLine(++i);
        } else {
            showLine(i);
        }
    });
}


function save(content, label) {
    fs.appendFile(file +'_outout.json', '{"interaction":{"content":"' + content + '","id":2},"label":"' + label + '"}' + "\n", function(err) {
        if (err) {
            return console.log(err);
        }
        return true;
    });
}

stream.on('end', function() {
    // show the first content item
    showLine(0);
});

String.prototype.trim = function(){ return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"); };