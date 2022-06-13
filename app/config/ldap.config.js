 const ldap = require('ldapjs');

 const client = ldap.createClient({
   url: ['ldap://ID-ADDS04.kemlu.go.id'],
   reconnect: true
 });

module.exports = client
