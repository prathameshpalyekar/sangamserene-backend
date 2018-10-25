const functions = require('firebase-functions');
const sha512 = require('js-sha512');
const key = 'A0bo6j0n';
const salt = 'SgT7HnXPHt';
const productinfo = 'roomrent';
const surl = '/success';
const furl = '/failure';

exports = module.exports = functions.https.onRequest((request, response) => {
    const { txnid, firstname, email, phone, amount } = request.body;
    const hashSequence = key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|||||||||||' + salt;
    const hash = sha512(hashSequence);
    const data = {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone,
        surl,
        furl,
        hash,
    };
    console.log(data)

    response.set('Access-Control-Allow-Origin', "http://localhost:6001");
    response.set('Access-Control-Allow-Credentials', true);
    response.set('Access-Control-Allow-Headers', 'content-type');
    response.send(data);
});