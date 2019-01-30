enum PathType {

    STATIC_PATH,

    DYNAMIC_PATH

}

interface Path {

    value: string;

    type: PathType;

}

declare type ResolvablePath = string | ({ toString: () => string });

export class PathBuilder {

    private chain: Path[];

    constructor(path?: string) {
        this.chain = [];
        if (path) {
            this.path(path);
        }
    }

    path(path: string) {
        this.chain.push({
            value: path,
            type: PathType.STATIC_PATH
        });
        return this;
    }

    resolve(path: ResolvablePath)  {

        let resolvedPath = '';
        if (path) {
            if (typeof path === 'string') {
                resolvedPath = path;
            } else if (path.toString) {
                resolvedPath = path.toString();
            }
        }

        this.chain.push({
            value: resolvedPath,
            type: PathType.DYNAMIC_PATH

        });

        return this;

    }

    toString() {
        return this.chain
            .reduce((result, path, index, array) => {

                let isFirst = index == 0;
                let isLast = index == array.length - 1;
                let part = '';

                if (path.type === PathType.STATIC_PATH) {

                    let previousPath = array[index - 1];
                    let isAfterStatic = previousPath ? previousPath.type === PathType.STATIC_PATH : false;

                    if (isAfterStatic) {
                        result = result.replace(/\/\'$/, "");
                    }

                    let value = path.value;
                    if (!isFirst) {
                        value = value.replace(/^\//, "");
                    }
                    if (!isLast) {
                        value = value.replace(/\/$/, "");
                    }

                    part = `${isAfterStatic ? "" : "'"}${ isFirst ? "" : "/" }${ value }${ isLast ? "" : "/" }'`;

                } else if (path.type === PathType.DYNAMIC_PATH) {
                    part = `${ isFirst ? "" : " + "}${ path.value }${ isLast ? "" : " + " }`;
                }

                return result + part;

            }, '');
    }
}

export function path (path: string) {
    return new PathBuilder(path);
}
