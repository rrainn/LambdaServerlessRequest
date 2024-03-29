# LambdaServerlessRequest [![Build Status](https://travis-ci.org/rrainn/LambdaServerlessRequest.svg?branch=master)](https://travis-ci.org/rrainn/LambdaServerlessRequest) [![Coverage Status](https://coveralls.io/repos/github/rrainn/LambdaServerlessRequest/badge.svg?branch=master)](https://coveralls.io/github/rrainn/LambdaServerlessRequest?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/rrainn/LambdaServerlessRequest/badge.svg)](https://snyk.io/test/github/rrainn/LambdaServerlessRequest) [![Dependencies](https://david-dm.org/rrainn/LambdaServerlessRequest.svg)](https://david-dm.org/rrainn/LambdaServerlessRequest) [![Dev Dependencies](https://david-dm.org/rrainn/LambdaServerlessRequest/dev-status.svg)](https://david-dm.org/rrainn/LambdaServerlessRequest?type=dev) [![NPM version](https://badge.fury.io/js/lambdaserverlessrequest.svg)](http://badge.fury.io/js/lambdaserverlessrequest)

## General

LambdaServerlessRequest is an easy way to make requests to a Lambda serverless function instead of having to use API Gateway. LambdaServerlessRequest was heavily inspired by [axios](https://github.com/axios/axios), and although there is not complete feature parity, and there are some interface changes, coming from [axios](https://github.com/axios/axios) to LambdaServerlessRequest will feel very natural.

## Installation

    $ npm i lambdaserverlessrequest

## Examples

```js
const serverlessRequest = require("lambdaserverlessrequest");

const request = serverlessRequest.create({
  "lambda": new AWS.Lambda({"region": "us-west-2"})
});

try {
  const result = await request({
    "method": "get",
    "functionName": "MyLambdaFunction1",
    "url": "/api/books"
  }));
  console.log(result);
} catch (e) {
  console.error(e);
}

try {
  const result = await serverlessRequest({
    "method": "post",
    "functionName": "MyLambdaFunction1",
    "url": "/api/books",
    "data": {"id": 1, "title": "The best book ever"}
    "lambda": new AWS.Lambda({"region": "us-west-2"})
  }));
  console.log(result);
} catch (e) {
  console.error(e);
}
```

## Instance Methods

-   lambdaServerlessRequest#request(config)
-   lambdaServerlessRequest#get(url[, config])
-   lambdaServerlessRequest#delete(url[, config])
-   lambdaServerlessRequest#head(url[, config])
-   lambdaServerlessRequest#options(url[, config])
-   lambdaServerlessRequest#post(url\[, data[, config]])
-   lambdaServerlessRequest#put(url\[, data[, config]])
-   lambdaServerlessRequest#patch(url\[, data[, config]])
-   lambdaServerlessRequest#create(config)

## Request Config

```js
{
  // `url` is the server URL that will be used for the request
  url: '/user',

  // `method` is the request method to be used when making the request
  method: 'get', // default

  // `functionName` is the name of the Lambda function you wish to run for this request
  functionName: 'MyLambdaFunction1',

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object
  params: {
    ID: 12345
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // Must be of one of the following types:
  // - string, plain object
  data: {
    firstName: 'Steve'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'json'
  responseType: 'json', // default

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  }
}
```

## Response Schema

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {}
}
```

* * *

## Major Differences Between LambdaServerlessRequest and axios

### General

-   Currently query parameters attached to the `url` won't be recognized
-   Browser not supported
-   Requires Node.js version 8 or higher
-   We have currently only tested using `async`/`await` syntax, most functionality should work with promises, but this has not been tested at this point

### Instance Methods

#### Removed/Not Present:

-   `getUri`
-   `all`
-   `spread`

### Request Config

#### Added:

-   `functionName`
-   `lambda`

#### Changed:

-   `params` must be a plain object, URLSearchParams is not supported
-   `body` only accepts String or plain Object as types
-   `responseType` only accepts json and arraybuffer

#### Removed/Not Present:

-   `baseURL`
-   `transformRequest`
-   `transformResponse`
-   `paramsSerializer`
-   `timeout`
-   `withCredentials`
-   `adapter`
-   `auth`
-   `responseEncoding`
-   `xsrfCookieName`
-   `xsrfHeaderName`
-   `onUploadProgress`
-   `onDownloadProgress`
-   `maxContentLength`
-   `maxRedirects`
-   `socketPath`
-   `httpAgent`
-   `httpsAgent`
-   `proxy`
-   `cancelToken`

### Response Config

#### Removed/Not Present:

-   `statusText`
-   `config`
-   `request`
