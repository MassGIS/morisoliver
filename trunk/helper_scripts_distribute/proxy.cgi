#!/usr/bin/python
#This is a blind proxy that we use to get around browser
#restrictions that prevent the Javascript from loading pages not on the
#same server as the Javascript.  This has several problems: it's less
#efficient, it might break some sites, and it's a security risk because
#people can use this proxy to browse the web and possibly do bad stuff
#with it.  It only loads pages via http and https, but it can load any
#content type. It supports GET and POST requests.
	
import urllib2
import cgi
import sys, os
import base64
 	
# Designed to prevent Open Proxy type stuff.
	
#allowedHosts = ['www.openlayers.org', 'openlayers.org',
#                'labs.metacarta.com', 'world.freemap.in',
#                'prototype.openmnnd.org', 'geo.openplans.org',
#                'sigma.openplans.org', 'maps.massgis.state.ma.us', 'giswebservices.massgis.state.ma.us',
#                'giswebservices.massgis.state.ma.us:80', 'www.openstreetmap.org', '170.63.93.152', '170.63.93.153', '170.63.170.148', '170.63.170.149']

allowedHosts = ['www.mapsonline.net','egisws02.nos.noaa.gov','170.63.98.114','170.63.93.152','dev.virtualearth.net','70.37.131.143','wsgw.mass.gov','giswebservices.massgis.state.ma.us','209.80.128.252']

method = os.environ["REQUEST_METHOD"]
	
if method == "POST":
    qs = os.environ["QUERY_STRING"]
    d = cgi.parse_qs(qs)
    if d.has_key("url"):
        url = d["url"][0]
        if url.endswith("?"):
            url = url[:-1]
        sys.stderr.write('proxy-ing request to target url - ' + url + "\n")
    else:
        url = "http://www.openlayers.org"
else:
    fs = cgi.FieldStorage()
    url = fs.getvalue('url', "http://www.openlayers.org")
#    sys.stderr.write('url from request - ' + url)

try:
    try:
        ref = os.environ["HTTP_REFERER"]
        #sys.stderr.write('referer: ' + ref + "\n")

    except Exception:
        #sys.stderr.write('referrer is empty' + "\n")
        ref = ""

    host = url.split("/")[2]
    if allowedHosts and not host in allowedHosts:
        sys.stderr.write("host " + host + " not allowed via this proxy")
        print "Status: 502 Bad Gateway"
        print "Content-Type: text/plain"
        print
        print "This proxy does not allow you to access that location."
        print
        print os.environ
 
    elif url.startswith("http://") or url.startswith("https://"):
   
        if method == "POST":
            length = int(os.environ["CONTENT_LENGTH"])

            headers = {"Content-Type": os.environ["CONTENT_TYPE"], "Referer": ref}
            if os.environ["HTTP_AUTHORIZATION"] != '':
                headers["Authorization"] = os.environ["HTTP_AUTHORIZATION"]
                sys.stderr.write("From Header - " + os.environ["HTTP_AUTHORIZATION"] + "\n")
                #sys.stderr.write("adding auth header\n")
            #else:
                #sys.stderr.write(str(os.environ))

            body = sys.stdin.read(length)
            r = urllib2.Request(url, body, headers)
            y = urllib2.urlopen(r)
        else:
            r = urllib2.Request(url)
            r.add_header('Referer',ref)
            y = urllib2.urlopen(r)
       
        # print content type header
        i = y.info()
        if i.has_key("Content-Type"):
            print "Content-Type: %s" % (i["Content-Type"])
        else:
            print "Content-Type: text/plain"
        print
       
        print y.read()
       
        y.close()
    else:
        print "Content-Type: text/plain"
        print
        print "Illegal request."

except Exception, E:
    try:
        if E.code == 401:
            print "Status: 401 Unauthorized"
            print "WWW-Authenticate: Basic realm=''"
 	    #y.close()
            #sys.stderr.write("401 when accessing redirect url")
        else:
            raise Exception
    except:
        #sys.stderr.write("code is " + str(E.code) + "\n")
        print "Status: 500 Unknown Error"
        sys.stderr.write("Some unexpected error occurred using proxy.cgi. Error text was: " + str(E))

    print "Content-Type: text/plain"
    print
