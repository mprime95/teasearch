var AWS = require('aws-sdk');


AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for teas called Rooibos.");

var params = {
    TableName : "tea-app",
    KeyConditionExpression: "nm = :teaName",
    ExpressionAttributeNames:{
        "nm": "name"
    },
    ExpressionAttributeValues: {
        ":TeaName":"Rooibos"
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.name + ": " + item.type);
        });
    }
});