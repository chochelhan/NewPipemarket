
export default {
    nl2br(text) {
        return text.value.replace(/(\n|\r\n)/g, '<br>');

    },
    nl2brContent(text) {
        text = text.toString();
        text = text.replace(/(\n|\r\n)/g, '<br>');
        return text.replace(/(<br><br>)/g, '<br>');
    },
    stripTags(value) {
        let div = document.createElement("div");
        div.innerHTML = value;
        let text = div.textContent || div.innerText || "";
        return text;

    },
    br2nl(text) {
        return text.replace(/(<br>|<br\/>|<br \/>)/g, '\r');
    },
    numberFormat(number) {
        let nf = new Intl.NumberFormat(["en-US"], {});
        return nf.format(number);
    },
    getStrCut(string,length) {
        if(string.length >= length){
            return string.substr(0,length)+"..";
        } else return string;
    },
    getDogInfo(item) {
        const now = new Date();
        const year = now.getFullYear();
        const month = parseInt(now.getMonth()) + 1;
        let date = (item.petBirthdate)?item.petBirthdate.split('-'):item.birthDate.split('-');
        let age = year - parseInt(date[0]);
        let viewName;
        let vMonth = month - parseInt(date[1]);
        let name = (item.petName)?item.petName:item.name;
        let weight = (item.petWeight)?item.petWeight:item.weight;
        if (age < 1) {
            viewName = name + '・' + vMonth + '개월・' + weight + 'kg';
        } else {
            if(vMonth < 0 ) {
                age = age - 1;
               if(age>0) {
                   viewName = name + '・' + age + '살・' + weight + 'kg';
               }  else {
                   let a = month + (12 - parseInt(date[1]));
                   viewName = name + '・' + a + '개월・' + weight + 'kg';
               }
            } else {
                viewName = name + '・' + age + '살・' + weight + 'kg';

            }

        }
        return viewName;
    }

}
