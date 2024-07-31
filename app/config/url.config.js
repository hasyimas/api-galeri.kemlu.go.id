require('dotenv/config')
const dev = process.env.DEV == 'production'

const ldap = dev ? process.env.URL_LDAPPUB : process.env.URL_LDAPLOC

module.exports = ldap
