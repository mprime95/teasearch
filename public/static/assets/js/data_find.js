package com.amazonaws.codesamples.datamodeling;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

public class DynamoDBMapperQueryScanExample {

    static AmazonDynamoDBClient client = new AmazonDynamoDBClient(new ProfileCredentialsProvider());

    public static void main(String[] args) throws Exception {
        try {

            DynamoDBMapper mapper = new DynamoDBMapper(client);

            // Get a tea - name: Rooibos
            GetTea(mapper, "Rooibos");

            System.out.println("Example complete!");

        } catch (Throwable t) {
            System.err.println("Error running the DynamoDBMapperQueryScanExample: " + t);
            t.printStackTrace();
        }
    }
    private static void GetTea(DynamoDBMapper mapper, String[] name) throws Exception {
        System.out.println("GetTea: Get tea name='Rooibos' ");
        System.out.println("Tea table has no sort key. You can do GetItem, but not Query.");
        Tea tea = mapper.load(Tea.class, "Rooibos");
        System.out.format("name = %s Description = %s, Type = %s %n", Tea.getname(), Tea.getDesc(), Tea.getType() );
    }

    @DynamoDBTable(tableName="tea-app")
    public static class Tea {
        private String name;
        private String Description;
        private String Type;

        @DynamoDBHashKey(attributeName="name")
        public int getname() { return name; }
        public void setname(String name) { this.name = name; }

        @DynamoDBAttribute(attributeName="Description")
        public String getDesc() { return Description; }
        public void setDesc(String Description) { this.Description = Description; }

        @DynamoDBAttribute(attributeName="Type")
        public String getType() { return Type; }
        public void setType(String Type) { this.Type = Type; }

        @Override
        public String toString() {
            return "Tea [Type=" + Type + ", name=" + name
            + ", Description=" + Description + "]";
        }

    }
}