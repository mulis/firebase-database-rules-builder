Firebase database rules builder
==

This library helps to produce firebase database rules from javascript or typescript code.

Steps of process are:
1. Define rules using library helpers
2. Build rules object
3. Save rules object as JSON

Define rules
--

Rules can be defined as plain object with properties that describe your database models and values that received from library helpers. Helper produce rule value object with set of members that are relevant to context. In general, rule value objects implements firebase database security rules API described in [documentation](https://firebase.google.com/docs/reference/security/database).

For example:

    var lib = require('firebase-database-rules-builder');
    var newData = lib.newData;

    var isNewDataString = newData.isString();
    var isNewDataStringLessThan100 = newData.valString().length.lessThan.evaluate(100);

    {
        role: {
            ".validate": newData.isNumber()
        },
        name: {
            ".validate": isNewDataString.and.evaluate(isNewDataStringLessThan100)
        },
        description: {
            ".validate": isNewDataString
        }
    }

Using typescript and providing models type information you can achieve rule properties auto completion and compile time checking.

For example:

    import { Collection, newData } from 'firebase-database-rules-builder';

    interface User {

        name: string;

    }

    ...

    {
        users: <Collection<User>>{
            "$id": {
                ".indexOn": [
                    "name", // allowed property
                    "role"  // not allowed property, compile time error
                ],
                name: { // allowed property
                    ".validate": newData.isString()
                        .and.add // not existing property, compile time error
                },
                role: {} // not existing property, compile time error
            }
        }
    }

For more examples see tests.

Build rules
--

To build rules instantiate class Builder and call method build with rules.

    import { Builder } from 'firebase-database-rules-builder';

    const rules = ...

    const builder = new Builder();
    const result = builder.build(rules);

Save rules
--

To save rules you can use JSON object and file system module.

    import { writeFileSync } from 'fs';

    const result = ...

    writeFileSync('./database.rules.json', JSON.stringify(result, null, 4));
