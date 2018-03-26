# SPARQList Reference Guide

## Overview

A SPARQLet is defined as a [Markdown](https://guides.github.com/features/mastering-markdown/) document with several extensions.
SPARQLet can be called as a HTTP API
`/api/:sparqlet_id?key1=value1&key2=value&...`.

SPARQLet can consider `Accept` header in the request.
You can also specify the type adding the suffix you want:
`/api/:sparqlet_id.json?key1=value1&key2=value&...` or something.
See Code blocks section for detail.

## Title

The title of the SPARQLet is defined as `H1`. Example:

```markdown
# Title of the SPARQLet
```

It is recommended to place it at the first line of the document for better readability.


## Parameters

Parameters are defined `ul`/`li`s below `## Parameters`.
The following example defines two parameters `foo` and `bar`, with `default-value-of-foo` and `default-value-of-bar` as default values respectively.
Default value definitions are optional.

Example values can be included in this section in order to help SPARQLet users.
All things other than `default:` have no effect for SPARQLet execution.
They are just treated as documentation.

```markdown
## Parameters

* `foo` description of foo
  * default: default-value-of-foo
  * example: 1, 2, 3
* `bar` description of bar
  * default: default-value-of-bar
```

## SPARQL endpoint

SPARQL endpoint is defined below `## Endpoint`. Example:

```markdown
## Endpoint

http://example.com/sparql
```

If you need to use multiple endpoints for different queries, you can redefine endpoint as the same syntax.
Endpoint definitions are effective until redefined.

## Headers

Headers are treated as title of code blocks.
If headers start with an inline code, the returning values are stored in the context object with the name specified in the code.

The following example shows how to store SPARQL result into `sparql_result` property:

```markdown
## `sparql_result` SPARQL Result

```sparql
(snip)
```

## Code blocks

Code blocks have two types: `sparql` and `javascript`.
`sparql` code blocks define SPARQL query and `javascript` code blocks define JavaScript execution.
Specify the type as a language identifier.

For example, SPARQL code block should wrap in the following fences:

    ```sparql
    ```

and JavaScript code block:

    ```javascript
    ```


Code blocks are executed in sequence in the order of defined.
The result of the final block is returned as the overall result of the SPARQLet.

### SPARQL

The following example defines a SPARQL procedure with the code block.
The results are stored into `result` property of the context.
You can latter use this later.

    ## `results` Select all

    ```sparql
    SELECT * WHERE { ?s ?p ?o . }  LIMIT 10
    ```

[Handlebars](http://handlebarsjs.com/) templating is available in SPARQL code blocks.
The following example shows how to embed the `limit` value passed to the SPARQLet as a parameter.

    ## `result` Select all

    ```sparql
    SELECT * WHERE { ?s ?p ?o . }  LIMIT {{{limit}}}
    ```

SPARQL queries are issued with `application/sparql-results+json` header except it is not the final block.
So basically you can expect that the results are in a JSON object.
If the block is the final block, content negotiation works; `Accept` header passed to the SPARQLet is sent to the SPARQL endpoint.

### JavaScript

JavaScript code blocks are useful to modify SPARQL results for further processing.
The following example show how to select data with SPARQL query and extract values from the SPARQL results:

    ## `results` Select all

    ```sparql
    SELECT * WHERE { ?s ?p ?o . }  LIMIT 10
    ```

    ## `modified_results` Modify

    ```javascript
    ({results}) => results.results.bindings.map(
      binding => Object.keys(binding).map(
        k => ({[k]: binding[k].value})
      )
    );
    ```

The context object is passed as the first argument of the JavaScript function.
Returned value of the function is stored to the context `modified_results`.

If the final block is in JavaScript, the returned value of the code is sent in JSON as the overall response of the SPARQLet.
In addition, you can handle multiple formats by using the following special notation:

```javascript
({
  json({results}) {
    // return results in json
  },
  text({results}) {
    // return results in text
  }
})
```

where json() works if the request has `Accept: application/json` header or with `.json` suffix, and text() works for `Accept: text/plain` or `.text`, `.txt` suffixes.

You can also use MIME types to specify the formats:

```javascript
({
  'application/json': ({results}) => {
    // return results in json
  },
  'text/plain': ({results}) => {
    // return results in text
  }
})
```

#### Fetch API

You can use fetch API in JavaScript code blocks. See [Fetch API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for details.

Example:

Fetch http://example.com and return the response body wrapped in an object.

    ```javascript
    ({
      json() {
        return fetch('http://example.com')
          .then(resp => resp.text())
          .then(body => {
            return {body};
          });
      }
    })
    ```

### Formats and MIME types

Format identifier definitions follow [mime-db](https://github.com/jshttp/mime-db).

Here are some commonly used MIME types and their aliases (used as suffixes to specify formats or properties in the final JavaScript code block):

* `text/html`: `html`
* `text/plain`: `text`, `txt`
* `text/csv`: `csv`
* `text/turtle`: `ttl`
* `text/n3`: `n3`
* `application/json`: `json`
* `application/n-triples`
* `application/xml`: `xml`
* `application/rdf+xml`: `rdf`
