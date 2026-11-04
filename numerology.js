
// Always reduce domicile numbers and ages to one digit, including 11, 22 and 33.
function singleDigit(value) {
 let digits=String(value??'').replace(/\D/g,'');
 if(!digits)return '';
 while(digits.length>1)digits=String([...digits].reduce((sum,digit)=>sum+Number(digit),0));
 return digits;
}

// Birthday cycles: day + month + cycle's starting year, always reduced to 1–9.
function personalYearPeriods(data){
 if(!data.birth||!data.start)return [];
 const [born,month,day]=data.birth.split('-').map(Number),year=Number(data.start);
 if(year<born)return [];
 const leap=y=>y%4===0&&(y%100!==0||y%400===0);
 const days=(y,m)=>[31,leap(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1];
 const anniversary=y=>`${String(y).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(Math.min(day,days(y,month))).padStart(2,'0')}`;
 const date=anniversary(year),actualDay=Number(date.slice(-2));
 const split=month-1+(actualDay-1)/days(year,month);
 const result=y=>singleDigit(String(day)+String(month)+String(y));
 const periods=[];
 if(split>0&&year>born)periods.push({a:0,b:split,number:result(year-1),from:anniversary(year-1),to:date});
 if(split<12)periods.push({a:split,b:12,number:result(year),from:date,to:anniversary(year+1)});
 return periods;
}

