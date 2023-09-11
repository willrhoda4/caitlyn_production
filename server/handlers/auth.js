





const bcrypt  = require('bcrypt');
const crypto  = require('crypto');

const db      = require('./database.js');




// retrieves hashed password from database
// and stores it in response.locals.passwordData
// before tagging checkPassword in.
function getPasswordData (request, response, next) {

    console.log('Getting password data...');

    const query     = `SELECT value FROM misc WHERE description = 'admin_pass';`;
    const stashPass = (data) => response.locals.passwordData = data[0].value;

    return db.simpleQuery( response, query, null, stashPass, next);
}

// receives a password from the client and 
// compares it to the hashed password retrieved by getPasswordData.
async function checkPassword (request, response) {

    console.log('Checking password...');


    const password    = request.body[0];
    const stashedPass = response.locals.passwordData;
    const match       = await bcrypt.compare(password, stashedPass);

    if (match) {  console.log('Passwords Match!');   response.send('match');   }   
    else       {  console.log('Invalid Password.');  response.send('invalid'); }  
}
    
   







// generates an admin reset token and stores it in the database.
// then stores the token in response.locals.resetToken
// before tagging sendResetLink in (lives in email handlers script).
function registerReset (request, response, next) {

    const                 date = Date.now();
    const           resetToken = crypto.randomBytes(32).toString("hex");
    response.locals.resetToken = resetToken;

    const query                = `UPDATE misc SET value = $1, date = $2 WHERE description = 'reset_token';`; console.log('')

    return db.simpleQuery(   response,
                             query,
                           [ resetToken, date  ],
                             null,
                             next
                         );
}







// retrieves the reset token from the database
// and stores it in response.locals.tokenData
// before tagging verifyTokenData in.
function getTokenData (request, response, next) {

    console.log('Grabbing token data...');

    const query     = `SELECT value, date FROM misc WHERE description = 'reset_token';`;

    function stashData (data) {

        console.log(data)

        response.locals.tokenData = data[0]

    }

    return db.simpleQuery( response, query, null, stashData, next);
}


// compares the reset token passed from the client
// to the reset token retrieved by getTokenData.
// if the tokens match, the token is valid.
// if the token is valid, verifyTokenData tags resetPassword in.
function verifyTokenData (request, response, next) {

    console.log('Verifying validity of token...');

    const passedToken  = request.body[1];
    const stashedToken = response.locals.tokenData.value;
    
    const generatedAt  = response.locals.tokenData.date;
    const expiry       = Date.now() - 900000;

         if (passedToken !== stashedToken)  { return response.send('invalid token'); }
    else if (generatedAt  <  expiry      )  { return response.send('expired token'); }
    else                                    { next();                                }
}


// end of the line after checkPassword and verifyTokenData.
// hashes the new password and stores it in the database.
async function resetPassword (request, response) {

    console.log('Resetting password...');
    
    const newPass    =  request.body[0];
    const hashedPass =  await bcrypt.hash(newPass, 10);
    const query      = `UPDATE misc SET value = $1 WHERE description = 'admin_pass';`


    return db.simpleQuery(   response,
                             query,
                            [ hashedPass  ],
                         );
}






  
module.exports = { 
                   getTokenData,
                   checkPassword, 
                   registerReset,
                   resetPassword,
                   verifyTokenData,
                   getPasswordData,
                };





