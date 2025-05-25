

class StrUtils {

    static date_api_to_str(date_str) {
        if (date_str && date_str!=="") {
            let date=new Date(date_str);
            return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        return "";
    }

    static number_to_str(number1) {
        if (number1) {

            if(typeof number1 === 'string'){
                number1 = parseFloat(number1)
            }

            return number1.toLocaleString('it-IT');
        }
        return "";
    }

}

export default StrUtils;
