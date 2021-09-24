import _ from "lodash";


const convertToAmountText = (input) => {
    let value = input.toString();
    if (!isFinite(value)) {
        return null;
    } else {
        let arrReverted = _.reverse(value.split(''));
        arrReverted = _.reverse(_.chunk(arrReverted, 3));

        arrReverted = arrReverted.map(x => {
            return _.join(_.reverse(x), '');
        });
        arrReverted = _.concat(arrReverted);
        return _.join(arrReverted, '.');
    }
}

export class NumberUltis {
    static convertToAmountText = convertToAmountText;
}