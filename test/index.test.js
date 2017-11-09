const expect = require('chai').expect;
const testEvent = require('./sampleEvent.json');
const handler = require('../lib/index').handler;

describe('kinesis-firehose-cloudwatch-logs-processor', () => {
    it('should produce the expected output', () => {
        handler(testEvent, {}, (err, result) => {
            expect(err).to.not.exist;

            expect(result.records).to.not.equal(null);
            expect(result.records.length).to.equal(4, 'Number of output records does not match input.');

            const expectedOutputData = [
                '8499846a-88c1-4fb3-bfca-117ec023c5c3\n' +
                '5615152f-ae3e-4163-bbd0-c26a241e4ca1\n' +
                'bfacbeeb-e5ab-4bdd-b6fc-4f0bebd4fa09\n',
                'a24dd759-ce31-4ae0-8ef9-14c42a21f0d9\n' +
                'ac8b4b50-429a-42ec-be00-63e5de169e94\n' +
                'f1ec20c0-b864-4843-ae3f-5ff125a42c16\n',
                'e30b6f46-56ae-4703-949d-59f27f49c169\n' +
                '65100cf2-0099-47a3-a2f2-789b7a8aafdb\n' +
                '7401ce63-3563-4aa0-88f1-339c2e88ff8d\n',
            ];

            result.records.forEach((output, i) => {
                const input = testEvent.records[i];
                expect(output.recordId).to.equal(input.recordId);
                if (i === 0) {
                    expect(output.result).to.equal('ProcessingFailed');
                    expect(output.data).to.not.exist;
                } else {
                    expect(output.result).to.equal('Ok');
                    expect(new Buffer(output.data, 'base64').toString('utf8')).to.equals(expectedOutputData[i - 1]);
                }
            });
        });
    });
});
