//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License"). 
//You may not use this file except in compliance with the License. 
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed 
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
//either express or implied. See the License for the specific language 
//governing permissions and limitations under the License.

//Get modules.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app. 

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);
console.log(config);
//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({region: config.AWS_REGION});

var docClient = new AWS.DynamoDB.DocumentClient({region: config.AWS_REGION});

//GET home page.
app.get('/', routes.index);

function teaObject(name, type, desc, img, ing){
    this.name = name;
    this.type = type;
    this.desc = desc;
    this.img = img;
    this.ing = ing;
}

var teas = [];
var params = {
        TableName : "tea-app",
        ProjectionExpression: "#nm, #tp, Ingredients, Description, Image_URL",
          ExpressionAttributeNames:{
            "#nm": "name",
            "#tp":"Type"
        }
    };
console.log("Scanning tea table.");
docClient.scan(params, onScan);

//Store Dynamodb data
function onScan(err, data) {
    var count = 0
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the teas
        console.log("Scan succeeded.");
        data.Items.forEach(function(tea) {
            var ing = [];
            ing = tea.Ingredients;
            var x = new teaObject(tea.name, tea.Type, tea.Description, tea.Image_URL, ing);

            teas[count] = x;

            count++;

              console.log(
                x.name)
        });

        // continue scanning if we have more movies
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}

//POST Results
app.get('/search', function(req, res){
    res.send(teas);
})

////POST results
//app.post('/search', function(req, res) {
//    console.log(req.body)
//    console.log("Querying for teas called " + req.body.name);
//    var params = {
//        TableName : "tea-app",
//        KeyConditionExpression: "#nm = :teaName",
//        ExpressionAttributeNames:{
//            "#nm": "name"
//        },
//        ExpressionAttributeValues: {
//            ":teaName": req.body.name
//        }
//    };
//
//    docClient.query(params, function(err, data) {
//        if (err) {
//            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
//        } else {
//            console.log("Query succeeded.");
//            data.Items.forEach(function(item) {
//                console.log(" -", item.name + ": " + item.Type);
//            });
//            res.json({items: data.Items});
//        }
//    });
//});



//  db.putItem(formData, function(err, data) {
//    if (err) {
//      console.log('Error adding item to database: ', err);
//    } else {
//      console.log('Form data added to database.');
//      var snsMessage = 'New signup: %EMAIL%'; //Send SNS notification containing email from form.
//      snsMessage = snsMessage.replace('%EMAIL%', formData.Item.email['S']);
//      sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, Message: snsMessage }, function(err, data) {
//       if (err) {
//          console.log('Error publishing SNS message: ' + err);
//        } else {
//          console.log('SNS message sent.');
//        }
//      });
//    }
//  });
//};

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


