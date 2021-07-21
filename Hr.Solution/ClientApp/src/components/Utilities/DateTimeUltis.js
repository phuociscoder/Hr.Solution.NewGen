

const getYears =() => {
    const currentYear = new Date().getFullYear();
    const startPreviousYear = currentYear - 120;
    let years =[];
    for (let index = startPreviousYear; index <=currentYear; index++) {
        years.unshift(index);
    }
    return years;
}

export class  DateTimeUltils {
   static getYears = getYears;
}