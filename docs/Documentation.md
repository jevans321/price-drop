
## Command Line Commands

### Start Server
Start Server
$ npm run react-dev
$ npm run server-dev

Kill Port if it won't stop running
$ sudo lsof -t -i tcp:3000 | xargs kill -9

### Stop Server
`mysql.server stop`

#### Start Server
`mysql.server start`

#### List Path to MySQL install location
`which mysql`

#### Interactive prompt Log-n (MySQL monitor)
Local
`mysql -u root`
Remote
`mysql -u user -p password`
RDS MySQL
`mysql -h [RDS_host] -P 3306 -u [user] -p`

## Errors
### Console error when nightmare loads browser
`Cannot assign to read only property 'onbeforeunload' of object`
Fix Reference: https://github.com/segmentio/nightmare/issues/1082

Created custom 'preload.js' file located src/server/preload.js
I created this script because it involves modifiying a node-module file. Since a modification like this is not persistent I had to create a preload script that will not be erased whenever the Dynos are restarted.
  Reference: https://github.com/segmentio/nightmare#custom-preload-script
Modified src/server/data-scrape.js file
Line 14 in 'webPreferences' added..
  preload: path.resolve(__dirname + '/preload.js')

In the preload script I added the changes below:
Fix: updated the below 2 lines to 'true'
#### nightmare/lib/preload.js
Line 50 in f49265c
 writable: true,
#### nightmare/lib/preload.js
Line 55 in f49265c
 writable: true, 

