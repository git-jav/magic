
# Version 8.1.20

## magic.endpoint

Added support for retrieving request HTTP headers, using the following two slots.

* __[request.headers.get]__ - Returns the value of the specified HTTP request header
* __[request.headers.list]__ - Returns the key/value of all HTTP request headers

**Breaking changes** - Also renamed the HTTP response manipulation slots, removing the _"http."_ prefix.
This might render existing Hyperlambda files incompatible, at which point you'll have to
rename your slot invocations.

## magic.data.common

Minor simplifications

## magic.lambda.mail

Minor simplifications

## magic.lambda.math

Fixed severe error with increment/decrement slots

## magic.lambda.io

Fixed severe error with folder resolving when finding root URL

## magic.lambda.json

Fixed severe error when returning DateTime objects.


# Version 8.1.21

## magic.lambda

Fixed bug in **[or]** and **[and]** slots, preventing short circuiting
when condition cannot possibly evaluate to true. In addition also fixed a
bug in these slots that would sometimes attempt to raise a slot where its
name was "" (empty string).

## Magic (the core)

### Scaffolder results

Hopefully fixed a bug in the rendering of the menu button on Galaxy s series,
which would hide the menu button, making the site impossible to navigate.

Also allowed for anonymous access to the navigation, showing all CRUD
forms, where anonymous users have access to read - Allowing for anonymous
access to backend CRUD endpoints, but only where the backend endpoint
is created such that it allows anonymous access.

Created a modal login form now instead of the hardcoded login
form in the appp.component.html file, which I feel is a much
better approach than the previous existing solution.