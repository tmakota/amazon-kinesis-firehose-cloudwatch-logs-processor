# cwl-vpc-flow-logs-kinesis-firehose

# Kinesis Firehose 
For processing data sent to Firehose by Cloudwatch Logs subscription filters.

## Table of Contents
* **[Getting Started](#getting-started)**
     * **[Prerequisites](#prerequisites)**
     * **[Installing](#installing)**
     * **[Packaging](#packaging)**
     * **[Deploying](#deploying)**
* **[Development & Test](#development--test)**
     * **[Available npm tasks](#available-npm-tasks)**
     * **[Setup test environment](#setup-test-environment)**
     * **[Run integration test](#run-integration-test)**

## Getting Started

### Prerequisites
- AWS CLI
- Node.js v4.3 or later.
- S3 bucket to host artifacts uploaded by CloudFormation e.g. Lambda ZIP deployment packages

You can use the following command to create the Amazon S3 bucket, say in `us-east-1` region
```
aws s3 mb s3://<my-bucket-name> --region us-east-1
```

### Installing
First cd into any of the serverless applications:
```
cd src
```
Then run the set:env to initialize your environment.  

Rename .npmrc.sample into .nprmc.
Modify this file according to match your own settings
```
npm run set:env
```

Then install node package dependencies:
```
npm install
```

### Packaging
To build the Serverles Application Module deployment package:
```
npm run build:zip
```
This will package the necessary Lambda function(s) and dependencies into one local deployment zip as specified in `package.json` build script. i.e. it creates `kinesis-firehose-inline-transform.zip`

Then upload all local artifacts needed by the SAM template to your previously created S3 bucket.
You can do this either using **npm** or **AWS CLI**

**Upload using NPM:**

Before you run this command please ensure that you have set correct values in your application .npmrc
```
npm run build:template
```

**Upload using AWS CLI**
```
aws cloudformation package 
    --template template.yaml 
    --s3-bucket <my-bucket-name> 
    --output-template-file template.output.yaml
```

The command returns a copy of the SAM template, in this case `template.output.yaml`, replacing all references to local artifacts with the S3 location where the command uploaded the artifacts. In particular, `CodeUri` property of the Lambda resource points to the deployment zip `kinesis-firehose-inline-transform.zip` in the Amazon S3 bucket that you specified.

### Deploying
**Deploy using NPM:**

Before you run this command please ensure that you have set correct values in your application .npmrc
```
npm run build:deployment
```

**Deploy using AWS CLI**

```
aws cloudformation deploy 
    --template $(pwd)/template.output.yaml 
    --capabilities "CAPABILITY_IAM" --stack-name my-kinisis-firehose-cwfl-vpc-transformer
```

## Development & Test

### Available npm tasks
For each serverless application, you can use the following npm tasks:

| command | description |
| --- | --- |
| `npm run set:env`| creates .npmrc file in your local project. set project variables here |
| `npm run lint` | run eslint rules against .js files |
| `npm run build:zip` | create zip SAM deployment package with required .js files |
| `npm run build:template` | uploads SAM deployment package with required template files to AWS S3 Bucket|
| `npm run build:deploy` | creates CloudFormation Stack and deploys SAM package from AWS S3 Bucket|
| `npm run build` | runs build:zip then build:template and then build:deploy|
| `npm run clean` | remove zip deployment package |
| `npm run test` (or `npm test`) | run simple integration test with lMore  |


### Run integration test
Requires Update

## Authors
* **Tarik Makota** - [tmakota](https://github.com/tmakota)
* **Kevin Deng** - [kevincdeng](https://github.com/kevincdeng)


## License
cwl-vpc-flow-logs-kinesis-firehose AWS Lambda blueprints & application templates are released under the Apache 2.0 license. Details can be found in the [LICENSE](LICENSE.txt) file.
