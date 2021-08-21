

const getYears =() => {
    const currentYear = new Date().getFullYear();
    const startPreviousYear = currentYear - 120;
    let years =[];
    for (let index = startPreviousYear; index <=currentYear; index++) {
        years.unshift(index);
    }
    return years;
}

const toDateString =(value) => {
    if(!value) return '';
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth()+ 1;
    const year =date.getFullYear();

    const strDay = day > 9 ? `${day}` : `0${day}`;
    const strMonth = month > 9 ? `${month}` : `0${month}`;
    let format = "dd-MM-yyyy";
    return format.replace("dd", strDay).replace("MM", strMonth).replace("yyyy", year);
}

export class  DateTimeUltils {
   static getYears = getYears;
   static toDateString = toDateString;
}