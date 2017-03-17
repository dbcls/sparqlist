# SPARQList User's Guide

## What is SPARQList?

SPARQList is a web application that hosts SPARQLets, working snippets of SPARQL queries.

SPARQLet is defined as a Markdown document.
SPARQLet consists of parameterized SPARQL queries and JavaScript glue codes that integrate the queries.
It can also have rich documentation about the SPARQLet itself.

SPARQLet goes online as a web API as soon as you defined.
Any clients utilize the API via HTTP.

## Creating a SPARQLet

Open the top page of SPARQList.

Click "New SPARQLet" button.
You may be asked to enter the password, since any write access for SPARQLets is restricted to administrative users.
Enter the password configured by the administrator.

You will see the editor. You can compose a Markdown document to define a SPARQLet here.
When you have done, specify SPARQLet ID and click "Save" button.

The ID must be unique throughout the SPARQList.
You can use only alphabets, digits, `-` and `_` for SPARQLet ID. ID must start with an alphabet or a digit.

See [REFERENCE.md](./REFERENCE.md) for details on SPARQLet definition.

## Running a SPARQLet

Click "Execute" button to run the SPARQLet in trace mode.
You can see execution details stepwise.
It helps develop and debug SPARQLets.

If the SPARQLet has parameter definitions, forms for the parameters are shown.
You can modify the parameter and try requesting.

The URL to issue the same request also shown.
Try calling the API with [curl](https://curl.haxx.se/) or any other HTTP clients.

## Forking a SPARQLet

You may want to create a new SPARQLet modifying an existing SPARQLet.
You can "fork" the SPARQLet for this purpose.
Click "Fork" button to fork the SPARQLet.
The editor for the new SPARQLet will open with the content of existing SPARQLet.
Specify the new ID for the new SPARQLet and click "Save" button.

## Deleting a SPARQLet

Click "Delete" button in order to delete the SPARQLet.
Please be careful, there is no undo available.

## Edit SPARQLets directory

SPARQLets are stored in `REPOSITORY_PATH` directory.
You can edit them with your favorite editors.

Note that web views are not reloaded automatically.
You need to reload your browser in order to follow the updates.
