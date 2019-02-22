import {
    Collection
} from '../lib';

export interface Permissions {

    read: boolean;

    write: boolean;

}

export interface Relative {

    name?: string;

    status?: number;

}

export interface User {

    name?: string;

    permissions?: Permissions;

    relatives?: Collection<Relative>;

}
