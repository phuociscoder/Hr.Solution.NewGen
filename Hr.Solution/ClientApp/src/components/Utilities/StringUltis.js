import _ from "lodash"

const IsNullOrEmpty =(str) => {
    return _.isNull(str) || _.isUndefined(str) || _.isEmpty(str);
}

export class StringUltis {
    static IsNullOrEmpty = IsNullOrEmpty;
}