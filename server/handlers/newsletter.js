





const { spawn } = require('child_process');
const   crypto  = require('crypto');


const db        = require('./database.js');



const Pool = require('pg').Pool


const pool = new Pool({
                        user:     'postgres',
                        host:     'localhost',
                        database: 'caitlyn',
                        password: 'rootUser',
                        port:      5432
                     })







function getEmails (request, response, next) {



    pool.query('SELECT * FROM emails', (err, res) => {
                
                if ( err )                  {   console.log(err.message); 
                                                return response.send(err.message);            
                                            }
        else  if ( res.rows.length === 0 )  {   console.log(`no emails saved`); 
                                                return response.send(`no emails saved`); 
                                            }

        else if ( request.originalUrl === 
                   '/getEmailList'       )  {  return response.send(res.rows)
                                            }
        else                                {  response.locals.emailList = res.rows;
                                               console.log(`got email list.`);
                                               return next();
                                            }                                    

    })
}


    








// handle email subscription requests
async function subscribe(request, response) {

  const email      = request.body[0];
  const emailToken = crypto.randomBytes(32).toString('hex');
  const checkQuery = 'SELECT * FROM emails WHERE email = $1';

  try {

    const checkResult = await pool.query(checkQuery, [email]);

    // if email doesn't exist, insert a new record
    if (checkResult.rows.length === 0) {

        const subscribeQuery      = 'INSERT INTO emails (email, email_token) VALUES ($1, $2)';
        const subscribeParameters = [email, emailToken];
    
        await pool.query(subscribeQuery, subscribeParameters);

        console.log('subscription successful!');
        response.send('subscribed successfully');


    // if email exists but isn't subscribed, update the subscription status
    // send the same response as if the email didn't exist
    } else if (!checkResult.rows[0].subscribed) {

        const subscribeQuery = 'UPDATE emails SET subscribed = true WHERE email = $1';
        const subscribeParameters = [email];

        await pool.query(subscribeQuery, subscribeParameters);

        console.log('subscription successful!');
        response.send('subscribed successfully');


    // if email is already subscribed, return a response saying so.
    } else { response.send('email already subscribed'); }


  } catch (error) {

    console.error('Error:', error.message);
    response.status(500).send('something went wrong with your subscription...');
  }
  
}







  
module.exports = {
                   getEmails, 
                   subscribe, 
                 };





