# GET API Proxy Information from AX
Idea for building this proxy was to present different approach for fetching revision and basepaths from AX instead of quering from MPs/Runtime. Noticed that sometimes due to load .i.e. multiple proxies revisions deployed across multiple envs, the deployed proxy revision and the revision serving traffic are different. In order to get to root cause would need to create/view  custom reports. 
This API does extact samething under the hood by quering AX for various AX-dimensions such as basepaths, revisions etc.. targeted onto a specific org-env-timerange combinations, this will help users/developers in providing the correct API basepath/revisions which is serving traffic at runtime and help them during debugging through such instances.

# Steps to run install
1. Download and install Maven 3.0.*
2. Clone this repo https://github.com/prasanthpotturi/getAPIProxyInfoFromAX
3. cd getAPIProxyInfoFromAX/getAPIProxyInfoFromAX
4. Execute mvn install -Ptest -Dusername={apigee-edge-email} -Dpassword={apigee-edge-password} -Dorg={apigee-edge-org}

# Steps to test/run

Header:
Authorization: Basic <orgAdmin/readonlyOrgAdmin>
Content-Type:application/x-www-form-urlencoded

Body:
startdaterange:09/14/2018+09:00:00 (format: mm/dd/YYYY+HH:mi:ss)
enddaterange:09/15/2018+16:00:00   (format: mm/dd/YYYY+HH:mi:ss)
org: {org-name} //organization name
env: {environment Name} //environment name
mgmturl: {management api url} //e.g: https://api.enterprise.apigee.com
proxyname: {all|<specific api proxy>} //all - to fetch 'all' or 'specific(proxyname)' api/s running during that time frame


Response:
//Sample response : when proxyname: all; then this api proxy returns details about all proxies running during provided timeframe 
{
    "apiProxyInfo": [
        {
            "name": "test",
            "basepaths": [
                "/test"
            ],
            "revisions": [
                "2"
            ]
        },
        {
            "name": "sample",
            "basepaths": [
                "/sample"
            ],
            "revisions": [
                "1"
            ]
        } ]
        }
    ]
}

//Sample response : when proxyname: test; then this api proxy returns details about 'test' proxy during provided timeframe 
{
    "apiProxyInfo": [
        {
            "name": "test",
            "basepaths": [
                "/test"
            ],
            "revisions": [
                "2"
            ]
        }
    ]
}

