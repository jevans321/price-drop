
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

## Errors
### Console error when nightmare loads browser
`Cannot assign to read only property 'onbeforeunload' of object`
Fix: updated the below 2 lines to 'true'
#### nightmare/lib/preload.js
Line 50 in f49265c
 writable: true,
#### nightmare/lib/preload.js
Line 55 in f49265c
 writable: true, 



    
