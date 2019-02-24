import { Rules, ReservedKeys } from './firebase-database-rules';
import { Context } from './index';

export class Builder {

    build (input: Rules<any>) {

        let rules = input.rules;
        if (!rules) {
            throw 'Rules property not defined';
        }

        let result = this.resolve(rules);

        return {
            rules: result
        };

    }

    private resolve (value: any) {

        let result: any = null;

        if (value instanceof Context) {
            result = value.toString();
        } else if (typeof value == 'object') {
            result = this.resolveObject(value);
        } else if (typeof value == 'function') {
            result = value();
        } else {
            result = value;
        }

        return result;

    }

    private resolveObject (obj: any) {

        let result: any = {};

        for (let key in obj) {

            let value: any = obj[key];

            if (key == ReservedKeys.indexOn) {
                if (!(value instanceof Array)) {
                    throw 'Value of index is not an array';
                }
            } else {
                value = this.resolve(value);
            }

            result[key] = value;

        }

        return result;

    }

}
