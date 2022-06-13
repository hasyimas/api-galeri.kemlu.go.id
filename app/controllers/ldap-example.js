const ldap = require('ldapjs');

const client = ldap.createClient({
  url: ['ldap://127.0.0.1:10389']
});



function authenticateDN(username, password) {

    client.bind("uid=" + username + ",ou=system", password, (err) => {
        if (err) {
            console.log("Error in new connection" + err)
        } else {
            
            console.log("sucsess")
            // searchUser();
            // addUser();
            // deleteUser();
            // addUserToGroup('cn=Administrators,ou=groups,ou=system');
            // deletedUserToGroup('cn=Administrators,ou=groups,ou=system');

        }
    });

}

authenticateDN('admin', 'secret')


function searchUser() {
    const opts = {
        filter: '(|(uid=2)(sn=jhon))',
        scope: 'sub',
        attributes: ['sn', 'cn']
    };

    client.search('ou=users,ou=system', opts, (err, res) => {
        if (err) {
            console.log("Error in search" + err)
        }

        res.on('searchRequest', (searchRequest) => {
            console.log('searchRequest: ', searchRequest.messageID);
        });
        res.on('searchEntry', (entry) => {
            console.log('entry: ' + JSON.stringify(entry.object));
        });
        res.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', (err) => {
            console.error('error: ' + err.message);
        });
        res.on('end', (result) => {
            console.log('status: ' + result.status);
        });
    });
}

function addUser() {
    const entry = {
        sn: 'setiaji',
        // email: ['foo@bar.com', 'foo1@bar.com'],
        objectclass: 'inetOrgPerson'
    };
    client.add('cn=aji,ou=users,ou=system', entry, (err) => {
        if (err) {
            console.log("Error in added new user" + err)
        } else {
            console.log("User has been added")
        }
    });
}

function deleteUser() {
    client.del('cn=aji,ou=users,ou=system', (err) => {
        if (err) {
            console.log("Error in deleted user " + err)
        } else {
            console.log("User has been deleted")
        }
    });
}

function addUserToGroup(groupname) {
    const change = new ldap.Change({
        operation: 'add',
        modification: {
            uniqueMember: 'cn=aji,ou=users,ou=system'
        }
    });

    client.modify(groupname, change, (err) => {
        if (err) {
            console.log("Error in modification user " + err)
        } else {
            console.log("User has been modification")
        }
    });
}

function deletedUserToGroup(groupname) {
    const change = new ldap.Change({
        operation: 'delete',
        modification: {
            uniqueMember: 'cn=aji,ou=users,ou=system'
        }
    });

    client.modify(groupname, change, (err) => {
        if (err) {
            console.log("Error in deleted user on group " + err)
        } else {
            console.log("User has been deleted on group")
        }
    });
}