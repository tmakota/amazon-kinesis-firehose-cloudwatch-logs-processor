'use strict';
const zlib = require('zlib');

console.log('Loading function');

function unzippData(record) {
    return new Promise((resolve, reject) => {
        // decode data from the buffer , its BASE64 encoded
        const decodedData = (Buffer.from(record.data, 'base64'));
        console.log("promise:: recordId: |", record.recordId,"|  'data' attrib: ", decodedData);
        
        zlib.gunzip(decodedData, (err, result) => {
            console.log("promise::gunzip started:: ");
            if (err) {
                console.log("promise::gunzip error:: ", err);
                reject(error);
            } else {
                // at this point we have VPC flow log data events
                const parsed = JSON.parse(result.toString('ascii'));
                console.log("promise::gunzip Data:: ", parsed);
                
                const logEvents = [];
                if (parsed.logEvents) {
                    parsed.logEvents.forEach((item) => {
                        //customize below to match format you want to see in Splunk
                        let logEvent = {
                            'logGroup': parsed.logGroup,
                            'logStream': parsed.logStream,
                            'id': item.id,
                            'timestamp': item.timestamp, 
                            'data': item.message  // << this is actual VPC Log Data
                        }
                        logEvents.push(logEvent);
                    });
                }
                console.log(`promise::Decoded Events: ` , JSON.stringify(logEvents));
                console.log(`promise::VPC Log records ${logEvents.length}.`);
                
                // set record result as ok
                record.result = "Ok";
                
                resolve(logEvents);
            }
        });
  })
} 

exports.handler = (event, context, callback) => {
    // raw data will contain multiple Firehose recordId's
    console.log('Raw Data in FH:', JSON.stringify(event.records));
    
    // Map input data to an Array of Promises
    let promises = event.records.map(record => {
      return unzippData(record)
        .then(unzippedData => {
          record.data = (Buffer.from(JSON.stringify(unzippedData), 'utf8')).toString('base64');
          return record;
        })
    });

    // Wait for all Promises to complete
    Promise.all(promises)
        .then(results => {
            // Handle results
            console.log(`Data back to Firehose: `,JSON.stringify(results));
            callback(null, { records: results });
    })
  .catch(e => {
    console.error(e);
    callback(e);
  })
}    