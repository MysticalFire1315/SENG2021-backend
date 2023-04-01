# F12A Creation API User Guide

## Overview

The schema for input files is located at <http://seng2021-f12a-api-env.eba-pymctycp.ap-southeast-2.elasticbeanstalk.com/docs/schema/creation/upload>.
This specification is for a `json​` formatted input file, but a similar structure is required for xml​ or yaml​ (only syntax is different).
The file is very long, but most of it is repeated examples.
A full example is provided from lines 711-813 in the schema​ file.

Note that not all fields are mandatory, although this example includes all optional fields.
Field names are case insensitive and all non-alphabet characters (in the field name) are stripped at runtime.

## Workflow

A sample workflow for converting 1 invoice file might be as follows:

1. Make a `POST​` request to `/creation/upload`​ with:
   - Header as `{ "type": "json" }`​ (change "json" to either "xml" or "yaml" as required), and
   - Body as `{ "file": <invoice_file> }`​, where `<invoice_file>`​ is the file to be converted.
2. Retrieve response from `/creation/upload`​, which should contain two fields:
   - `timeEstimate​` gives a time estimate of how long it will take to process the uploaded file, and
   - `token​` which is an identifier for the uploaded file. This is required to retrieve the UBL version of this invoice.
3. Make a `GET​` request to `/creation/download`​ with:
   - Query as `{ "token": <token_from_upload> }`​, where `<token_from_upload>`​ is the token retrieved from the response to the first request.
4. Retrieve response from `/creation/download`​, which should contain an attachment with a file named "invoice.xml". This is the UBL formatted invoice.

## Sample Workflow (in JavaScript)

```javascript
const { request, spec } = require('pactum');

request.setBaseUrl(
  'http://seng2021-f12a-api-env.eba-pymctycp.ap-southeast-2.elasticbeanstalk.com',
);

// Wrapper for request to upload endpoint
const uploadFile = (pathToFile, fileType) => {
  return spec()
    .post('/api/creation/upload')
    .withHeaders('type', fileType)
    .withFile('file', pathToFile)
    .expectStatus(201)
    .returns('token');
};

// Wrapper for request to download endpoint
const downloadFile = (token) => {
  return spec()
    .get('/api/creation/download')
    .withQueryParams('token', token)
    .expectStatus(200)
    .returns('res.body');
};

// Sample workflow
const workflow = async (pathToFile, fileType) => {
  const token = await uploadFile(pathToFile, fileType);
  const output = await downloadFile(token);
  return output;
};

workflow('sampleInvoice.json', 'json');
```
