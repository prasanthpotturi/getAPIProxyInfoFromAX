var startDT=context.getVariable("startdaterange");
var endDT=context.getVariable("enddaterange");

startDT = startDT.split('+', 2);
endDT = endDT.split('+', 2);

function makeFormEncoder(hash){
  return function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(hash[key]);
  };
}

var formValues={
'_optimized':'js',
'accuracy':'100',
'limit':'14400',
'realtime':'true',
'select':'sum(message_count)',
'sort':'DESC',
'sortby':'sum(message_count)',
'timeUnit':'minute',
'tsAscending':'true',
'tzo':'-420'
};
var pairs = Object.keys(formValues).map(makeFormEncoder(formValues));
var req= pairs.join('&');
req=req+'&timeRange='+encodeURIComponent(startDT[0])+'+'+startDT[1]+'~'+encodeURIComponent(endDT[0])+'+'+endDT[1];
context.setVariable("calloutRequest",req);

