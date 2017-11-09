# kinesis-firehose-cloudwatch-logs-processor

For processing data sent to Firehose by Cloudwatch Logs subscription filters.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Packaging](#packaging)
  - [Deploying](#deploying)
- [Development & Test](#development--test)
  - [Available npm tasks](#available-npm-tasks)
- [Authors](#authors)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

Rename .npmrc.sample into .nprmc.
Modify this file according to match your own settings

Then install node package dependencies:
```
npm install
```

### Packaging
To build the Serverles Application Module deployment package:
```
npm run build:zip
```
This will package the necessary Lambda function(s) and dependencies into one local deployment zip as specified in `package.json` build script. i.e. it creates `kinesis-firehose-cloudwatch-logs-processor.zip`

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

The command returns a copy of the SAM template, in this case `template.output.yaml`, replacing all references to local artifacts with the S3 location where the command uploaded the artifacts. In particular, `CodeUri` property of the Lambda resource points to the deployment zip `kinesis-firehose-cloudwatch-logs-processor.zip` in the Amazon S3 bucket that you specified.

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
    --capabilities CAPABILITY_IAM --stack-name my-kinesis-firehose-cloudwatch-logs-processor
```

## Development & Test

### Available npm tasks
For each serverless application, you can use the following npm tasks:

| command | description |
| --- | --- |
| `npm run lint` | Run eslint rules against .js files |
| `npm run clean` | Remove zip deployment package |
| `npm run test` (or `npm test`) | Run unit tests |
| `npm run build:zip` | Create zip SAM deployment package with required .js files |
| `npm run build:template` | Uploads SAM deployment package with required template files to AWS S3 Bucket|
| `npm run build:deploy` | Creates CloudFormation Stack and deploys SAM package from AWS S3 Bucket|
| `npm run build` | Runs build:zip then build:template and then build:deploy|

## Authors
* **Tarik Makota** - [tmakota](https://github.com/tmakota)
* **Kevin Deng** - [kevincdeng](https://github.com/kevincdeng)


## License
The `kinesis-firehose-cloudwatch-logs-processor` AWS Lambda blueprints & application templates are released under the Apache 2.0 license. Details can be found in the [LICENSE](LICENSE.txt) file.
