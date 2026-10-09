export const findEduYear = (eduYear: number)=> {
    if(eduYear) {
        const fullYear = 2000 + eduYear;
        const nextYear = fullYear + 1;
        console.log(fullYear, nextYear);
        
        if(fullYear && nextYear) {
            return `${fullYear}-${nextYear}`;
        }
    }
    return ''
}