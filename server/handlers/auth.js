





const   bcrypt  = require('bcrypt');
const   crypto  = require('crypto');



const Pool = require('pg').Pool


const pool = new Pool({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'caitlyn',
                        password: 'rootUser',
                        port: 5432
                     })









async function logPassword (request, response) {

    let table       = request.body[0];
    let fkKeyValue  = request.body[1];
    let password    = request.body[2];
    
    let hashedPass  = await bcrypt.hash(password, 10);
    let parameters  = [ fkKeyValue[1], hashedPass ];
    let query       = 'INSERT INTO '+table+' ('+fkKeyValue[0]+', password) VALUES ($1, $2)';

    pool.query(query, parameters, (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message)  } 
        else     {                          response.send(res.rows)     }
    })

}





const checkPassword = (request, response) => {

    let table          = request.body[0];
    let pkKeyValue     = request.body[1];
    let password       = request.body[2];
    let query          = `SELECT * FROM `+table+` WHERE `+pkKeyValue[0]+` = $1`
    
    console.log(query); 
    pool.query(query, [pkKeyValue[1]], async (err, res) => {

        if (err)   { console.log(err.message); return response.status(400).send(err.message); }
        else       { 
            console.log('query for ',pkKeyValue[1],' => ',res.rows)

            if (res.rows.length === 0) { return response.status(400).send('database error'); }

            let stashedPass = res.rows[0].password; console.log('stashed pass => '+stashedPass); console.log('password => ', password);
            
            let match = await bcrypt.compare(password, stashedPass);

            console.log('match => ', match);

            if (match) {  console.log('MATCH!');   response.send('password matches');   }   
            else       {  console.log('no match'); response.send('no match');           }  

             
        }
    })
}



const registerReset = (request, response) => {

    let id     = request.body.resetId;
    let fk     = request.body.fk;
    let table  = request.body.pwTable;
    let token  = response.locals.resetToken;
    let query  = `UPDATE ${table} SET token = $1, reset_at = $2 WHERE ${fk} = $3`;

    pool.query(query, [ token, Date.now(), id ], (err, res) => {

            if (err) { console.log(err.stack);  response.status(400).send(err.message)  } 
            else     {                          response.send('reset re-registered')    }
    })

}

const resetPassword = async (request, response) => {

    console.log('resetFunction\n'+request.body);
    
    let id         =  request.body[0];
    let newPass    =  request.body[1];
    let table      =  request.body[2];
    let fk         =  request.body[3];
    let hashedPass =  await bcrypt.hash(newPass, 10);
    let query      = `UPDATE ${table} SET password = $1 WHERE ${fk} = $2`


    pool.query(query, [hashedPass, id], (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message)           } 
        else     { console.log(res);        response.send('password reset')      }
    })
}


const newPasswordLogin = (request, response) => {

    let table = request.body[0];
    let idKey = request.body[1];
    let id    = request.body[2];

    let query = `SELECT * FROM ${table} WHERE ${idKey} = $1`

    pool.query(query, [id], (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message);  } 
        else     { console.log(res);        response.send(res.rows);     }
    })
}


  
module.exports = { 
                   logPassword,
                   checkPassword, 
                   registerReset,
                   resetPassword,
                   newPasswordLogin,
                };





