//set mgmt url
var mgmturl = context.getVariable("mgmturl");
var org = context.getVariable("org");
var env = context.getVariable("env");
var requrl = mgmturl + '/v1/o/' + org + '/e/' + env + '/stats/';
//print("request url/n" + requrl);
var queryparms = context.getVariable("calloutRequest");
var requesturi = requrl + "apiproxy?"+ queryparms;
var reqproxyname = context.getVariable("proxyname");
//call mgmtAPI for ax data
var headers = {
        Authorization : context.getVariable("request.header.authorization")
    };
//print("request headers" + JSON.stringify(headers) + "  requrl"+requesturi);
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
 //print("data block "+ JSON.stringify(data));
var apiproxylist=[];
for (var i = 0; i < data.length; i++) { 
    apiproxylist[i]= data[i].identifier.values[0];
}
var apislist = { "info": apiproxylist };
//print("apislist "+apislist.info.length+ JSON.stringify(apislist));
//initalize final response json object
var finalresp = {
	"apiProxyInfo": [{
		"name": "",
		"revisions": []
	}]
};
print(JSON.stringify(finalresp.apiProxyInfo[0].name));
//intialize filter
var filter ='';
//get proxy basepaths
var  apiproxybsp = [];
var proxyname = '';
data = '';
requesturi = requrl + "proxy_basepath?"+ queryparms;
for (var i = 0; i < apislist.info.length; i++) { 
//set filter to requesturi
if (apislist.info[i] == reqproxyname)
 {
    proxyname = apislist.info[i]
    filter = "&filter=(apiproxy+eq+%27"+proxyname+"%27)";
    var requesturibsp = requesturi + filter ;
    //print("requesturibsp "+requesturibsp);
//call requesturi
    req = new Request(requesturibsp, 'GET', headers);
    exchange = httpClient.send(req);
    exchange.waitForComplete();
    if (exchange.isSuccess()) {
            var responseObj = exchange.getResponse().content.asJSON;
            //print("responseObj "+ JSON.stringify(responseObj));
            if (responseObj.error) {
                throw new Error(responseObj.error_description);
            }
        //print("finalresp"+JSON.stringify(finalresp));
    } 
    else if (exchange.isError()) {
            throw new Error(exchange.getError());
    }
    if (JSON.stringify(responseObj) !==null)
    {
        data = responseObj.Response.stats.data;
        //print("data block :"+proxyname+JSON.stringify(data));
        for (var j = 0; j < data.length; j++) { 
            apiproxybsp[j]= data[j].identifier.values[0];
            //print(JSON.stringify(data[j].identifier.values[0]) + i +apiproxybsp[j]  );
        }
        data ='';
    }
    //print(JSON.stringify(apiproxybsp));
    finalresp.apiProxyInfo[0].name = proxyname;
    finalresp.apiProxyInfo[0].basepaths = apiproxybsp;
    //print("finalresponse" + JSON.stringify(finalresp));
 }
}
//print("finalresponse" + JSON.stringify(finalresp));
//get proxy revisions
requesturi = requrl + "apiproxy_revision?"+ queryparms;
var  apiproxyrev = [];
for (var i = 0; i < apislist.info.length; i++) { 
//set filter to requesturi
if (apislist.info[i] == reqproxyname)
 {
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
        }
        data ='';
    }
    finalresp.apiProxyInfo[0].revisions = apiproxyrev;
 }
}
//print("finalresponse" + JSON.stringify(finalresp));
context.setVariable("finalresponse",JSON.stringify(finalresp));


