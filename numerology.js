// Always reduce domicile numbers and ages to one digit, including 11, 22 and 33.
function singleDigit(value) {
 let digits=String(value??'').replace(/\D/g,'');
 if(!digits)return '';
 while(digits.length>1)digits=String([...digits].reduce((sum,digit)=>sum+Number(digit),0));
 return digits;
}
