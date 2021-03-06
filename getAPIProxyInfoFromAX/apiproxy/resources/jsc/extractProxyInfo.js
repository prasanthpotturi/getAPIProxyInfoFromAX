//set context variables
var mgmturl = context.getVariable("mgmturl");
var org = context.getVariable("org");
var env = context.getVariable("env");
var requrl = mgmturl + '/v1/o/' + org + '/e/' + env + '/stats/';
var queryparms = context.getVariable("calloutRequest");
var requesturi = requrl + "apiproxy?"+ queryparms;
var reqproxyname = context.getVariable("proxyname");
var apiproxylist=[];
//intialize JS local variables
var filter ='';
var  apiproxybsp = [];
var proxyname = '';
var basepaths ='';
var revisions = '';
data = '';
//initalize final response json object
var finalresp = {
	"apiProxyInfo": [{
		"name": "",
		"basepaths":[],
		"revisions": []
		
	}]
};
//set authorization header for AX http callout
var headers = {
        Authorization : context.getVariable("request.header.authorization")
    };
// If proxyname form-parm in request is 'all' then retrieve AX for 'all' proxies during timeframe
if (reqproxyname == 'all')
{
  var req = new Request(requesturi, 'GET', headers);
  var exchange = httpClient.send(req);
 // Wait for the asynchronous GET request to finish
  exchange.waitForComplete();
  if (exchange.isSuccess()) {
    var responseObj = exchange.getResponse().content.asJSON;
    print("responseObj "+ JSON.stringify(responseObj));
     if (responseObj.error) {
       throw new Error(responseObj.error_description);
      }
     } else if (exchange.isError()) {
      throw new Error(exchange.getError());
    }
    var data = responseObj.Response.stats.data;
    for (var i = 0; i < data.length; i++) { 
      apiproxylist[i]= data[i].identifier.values[0];
    }
   var apislist = { "info": apiproxylist };
}
// else proxyname form-parm in request is '<specific api proxy name>' then retrieve AX for '<specific api proxy name>' proxies during timeframe
else
{
  apiproxylist[0] = reqproxyname;
  var apislist = { "info": apiproxylist };
}
//Get proxy basepaths from AX
requesturi = requrl + "proxy_basepath?"+ queryparms;
for (var i = 0; i < apislist.info.length; i++) { 
    finalresp.apiProxyInfo[i] = {
		"name": "",
		"basepaths":[],
		"revisions": []
		
	};
    proxyname = apislist.info[i]
    filter = "&filter=(apiproxy+eq+%27"+proxyname+"%27)";
    var requesturibsp = requesturi + filter ;
//call requesturi
    req = new Request(requesturibsp, 'GET', headers);
    exchange = httpClient.send(req);
    exchange.waitForComplete();
    if (exchange.isSuccess()) {
            var responseObj = exchange.getResponse().content.asJSON;
            if (responseObj.error) {
                throw new Error(responseObj.error_description);
            }
    } 
    else if (exchange.isError()) {
            throw new Error(exchange.getError());
    }
    if (JSON.stringify(responseObj) !==null)
    {
        data = responseObj.Response.stats.data;
        for (var j = 0; j < data.length; j++) { 
            apiproxybsp[j]= data[j].identifier.values[0];
            finalresp.apiProxyInfo[i].basepaths[j] = data[j].identifier.values[0];
       }
        data ='';
    }
    finalresp.apiProxyInfo[i].name = proxyname;
}
//Get proxy revisions from AX 
requesturi = requrl + "apiproxy_revision?"+ queryparms;
var  apiproxyrev = [];
for (var i = 0; i < apislist.info.length; i++) { 
//set filter to requesturi for retrieving api revision info from AX
    proxyname = apislist.info[i]
    filter = "&filter=(apiproxy+eq+%27"+proxyname+"%27)";
    var requesturibsp = requesturi + filter ;
//call requesturi
    req = new Request(requesturibsp, 'GET', headers);
    exchange = httpClient.send(req);
    exchange.waitForComplete();
    if (exchange.isSuccess()) {
            var responseObj = exchange.getResponse().content.asJSON;
            if (responseObj.error) {
                throw new Error(responseObj.error_description);
            }
    } 
    else if (exchange.isError()) {
            throw new Error(exchange.getError());
    }
    if (JSON.stringify(responseObj) !==null)
    {
        data = responseObj.Response.stats.data;
        for (var j = 0; j < data.length; j++) { 
            apiproxyrev[j]= data[j].identifier.values[0];
            finalresp.apiProxyInfo[i].revisions[j]= data[j].identifier.values[0]; 
        }
        data ='';
    }

}
//print("finalresponse" + JSON.stringify(finalresp));
context.setVariable("finalresponse",JSON.stringify(finalresp));



