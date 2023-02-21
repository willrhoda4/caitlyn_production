





// const { spawn } = require('child_process');
// const   bcrypt  = require('bcrypt');
// const   crypto  = require('crypto');



const Pool = require('pg').Pool


const pool = new Pool({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'caitlyn',
                        password: 'rootUser',
                        port: 5432
                     })







function atomicQuery (request, response, queries, parameters, successMsg) { 


    let steps = 0;


    function step (err, client, release) {

        let index = steps;
        let gear  = parameters[index] ? [ queries[index], parameters[index] ] 
                                      : [ queries[index]                    ];

        if (steps !== queries.length) {

            steps++;

            client.query(...gear, (err, res) => {

                if (err) { return client.query('ROLLBACK', () => {   release(); 
                                                                     console.error(`Error executing query ${steps}`, err.stack);
                                                                     response.status(400).send(err.stack)
                                                                 })
                         }
                
                else     {  console.log(res.data);  
                            step(err, client, release);
                         }
            })

        } else {

            client.query('COMMIT', (err, res) => {
            
                if (err) { return client.query('ROLLBACK', () =>    {   release();
                                                                        console.error('Error committing transaction', err.stack);
                                                                        response.status(400).send(err.stack)
                                                                    })
                         }

                else     {
                            release();
                            console.log('Transaction completed successfully');
                            response.send(successMsg);
                         }
            })
        }
    }

    pool.connect((err, client, release) => {

        if (err) { return console.error('Error acquiring client', err.stack) }

        client.query('BEGIN', (err, res) => {

            if (err) { return console.error('Error starting transaction', err.stack) }

            step(err, client, release);
        })
    }) 

}





function simpleQuery(response, query, parameters) {

    const gear = parameters ?   [ query, parameters ]
                            :   [ query             ];

    pool.query(...gear, (err, res) => {
        if (err) { console.log(err.stack);  response.status(400).send(err.message)  } 
        else     {                          response.send(res.rows)                 }
    })      
}



const getData = (request, response) => {

    console.log(request.body);

    let   table        = request.body[0];
    let   filters      = request.body[1];
    
    let columns, limit, orderBy, groupBy;
    
    if (request.body[2])  {( { 
                                orderBy,
                                limit,
                                groupBy,
                                columns    } = request.body[2]
                          )}
          
   
    let query          = !columns ? `SELECT *          FROM "${table}"`
                                  : `SELECT ${columns} FROM "${table}"`;
    let parameters     = [];
    let index          =  1;


    if (filters) {

        query += ' WHERE ';

        for (let i = 0; i < filters.length; i++) {              
                                                            
            if        (filters[i].length === 2)              {      query += `${filters[i][0]} = $${index} AND `; 
                                                                    parameters.push(filters[i][1]); console.log(typeof(filters[i][1]));
                                                                    index += 1;          
                                                             }
            else if   (       filters[i][2]  === 'sub'   )   {      query += `${filters[i][0]} = ${filters[i][1]}    `
                                                                                     //Don't remove these spaces ^^^^
                                                             }
            else if   (typeof(filters[i][2]) === 'string')   {      query += `${filters[i][0]} ${filters[i][2]} $${index} AND `; 
                                                                    parameters.push(filters[i][1]); console.log(typeof(filters[i][1]));
                                                                    index += 1;          
                                                             }
            else if   (filters[i].length === 3)              {      query += `${filters[i][0]} > $${index}   AND `+
                                                                             `${filters[i][0]} < $${index+1} AND `;  
                                                                    parameters.push(parseInt(filters[i][1]), parseInt(filters[i][2]));
                                                                    index += 2;                                                          
                                                             } 
            else                                             {      continue;      }
        }
        query = query.slice(0,-4);
    }

    if (groupBy) {                                query += ` GROUP BY ${groupBy}`;
                 }
    if (orderBy) { typeof(orderBy) === 'string' ? query += ` ORDER BY ${orderBy} DESC`
                                                : query += ` ORDER BY ${orderBy[0]} ASC`;
                 }
    if (limit)   {                                query += ` LIMIT ${limit}`; 
                 }
    

    console.log('parameter => ', parameters[0]);
    console.log(query, `\n`, parameters);
    
    return simpleQuery(response, query, parameters);
}


const deleteData = (request, response) => {

    const table  = request.body[0];
    const pkName = request.body[1];
    const id     = request.body[2];
    const rank   = request.body[3];

    const query1  = `DELETE FROM "${table}" WHERE ${pkName} =$1`;
    const query2 = `UPDATE "${table}" SET rank = rank-1 WHERE rank > $1`;

    if (rank) {

        return atomicQuery(     request, 
                                response,
                              [   query1,   query2   ],
                              [ [ id ],   [ rank ]   ],
                                'data successfully deleted'
                        );

        // pool.query(deleteQuery, [id], (err, res) => {
        //     if (err) { console.log(err.message); response.send(err.message);      }
        //     else     { pool.query(cleanUpQuery, [rank], (err, res) => {
        //         if (!err) { console.log(res);         response.send(res);         }
        //         else      { console.log(err.message); response.send(err.message); }
        //     })}
        // })
    } else {

        return simpleQuery(response, query1, [id]);
    }
}

const reRankData = (request, response) => {


    const table       = request.body[0];
    const pkName      = request.body[1];
    const id          = request.body[2];
    const oldRank     = request.body[3];
    const newRank     = request.body[4];
    
    let parameters1   = [ oldRank, newRank ]; 
    let parameters2   = [ newRank, id      ];

    let query1 = oldRank > newRank ? `UPDATE "${table}" SET rank = rank+1 WHERE (rank < $1 AND rank >= $2)`
               : oldRank < newRank ? `UPDATE "${table}" SET rank = rank-1 WHERE (rank > $1 AND rank <= $2)`
               :                      response.status(400).send('data error (rank === newRank)');
   
    let query2 =                     `UPDATE "${table}" SET rank = $1 WHERE (${pkName} = $2)`;


    return atomicQuery(      request, 
                             response,
                            [ query1,      query2       ],
                            [ parameters1, parameters2  ],
                             'rank successfully updated'
                      );


    // pool.query(query1, parameters1, (err, res) => {
    //     if  (err)  { console.log('query1error: ', err.message); response.send(err.message); }
    //     else       { console.log(res);
    //                 pool.query(query2, parameters2, (err2, res2) => {
    //                     if  (err)  { console.log('query2error: ', err.message); response.send(err.message); }
    //                     else       { console.log('check2', res2);    response.send(res.rows);    }
    //                 })}
    // })
} 

async function addData (request, response) {


    let table      = request.body[0];
    let columns    = request.body[1].join(', ');
    let parameters = request.body[2];
    let returning  = request.body[3];

    let values     = parameters.map((column, index) =>'$'+(index+1)).join(', ')
    let query      = `INSERT INTO "${table}" (${columns}) VALUES (${values});`

    if (returning) { query+=' RETURNING '+returning; }

    console.log(parameters);
    
        simpleQuery(response, query, parameters);
}



const updateData = (request, response) => {

    
    const table      = request.body[0];
    const columns    = request.body[1];
    const parameters = request.body[2];
    const conditions = request.body[3];
    
    console.log(`Updating table ${table}`);
    

    let query = 'UPDATE '+table+' SET ';


    for (let i = 0; i < columns.length; i++) {

        let value = i + 1;
        query += columns[i]+' = $'+value+', ';
    }
    query = query.slice(0,-2)+' WHERE '
    

    for (let i = 0; i < conditions.length; i++) {

        let value = i + 1 + columns.length;
        query += conditions[i][0]+' = $'+value+' AND ';
    }
    query = query.slice(0, -4)+';';
    
    
    console.log(query);
    console.log('\n',parameters)

    const values = [].concat(parameters, conditions.map(condition => condition[1]));

    simpleQuery(response, query, values);
}


 


  
module.exports = { getData, 
                   addData, 
                   deleteData, 
                   reRankData,
                   updateData,
                   simpleQuery,
                   atomicQuery,
                };











// const { spawn } = require('child_process');
// const   bcrypt  = require('bcrypt');
// const   crypto  = require('crypto');



// const Pool = require('pg').Pool


// const pool = new Pool({
//                         user: 'postgres',
//                         host: 'localhost',
//                         database: 'caitlyn',
//                         password: 'rootUser',
//                         port: 5432
//                      })









// const getArticle = (request, response) => {

//     const getArticle = spawn('python3', ['../../caitlyn_py/getArticle.py', request.body[0]]);
//     let   articleData = '';
    
//     console.log('getting Article...', request.body[0]);
    
//     getArticle.stdout.on('data', function (data) {

//         console.log(`Pipe data from python script => ${data} ${typeof(data)}, ${data.keys}`);

//         articleData += data.toString();
//     })

//     getArticle.on('close', (code) => {
        
//         console.log(articleData);

//         if (!articleData) { response.status(400).send('There was a problem retrieving your info.'); }
//         else              { articleData  = JSON.parse(articleData.replace(/'/g, '"')
//                                                                  .replace( /\*\*\*/g, "''" ));
//                             response.send(articleData);
//                           }        
//     })
// }








// function getNewStories (request, response, next) {


//     console.log('retrieving archive...');
        
//     pool.query('SELECT article_id FROM archive', (err, res) => {

//         if (err) { console.log(err.message); response.send(err.message); }
//         else     { 
            
//             console.log('archive retrieved.\n checking for new stories...');  

//             const storyIds      = res.rows.map(story => story.article_id); 
//             const getNewStories = spawn('python3', ['../../caitlyn_py/caitlynScraper.py', storyIds]);
//             let   storiesData   = '';
        
//             getNewStories.stdout.on('data', function (data) { 

//                 console.log(`Pipe data from python script vvvv\n\n${data}\n\n}`);
        
//                 storiesData += data.toString();
//             })
        
//             getNewStories.on('close', (code) => {
                
//                 console.log('closing connection now...');  
        
//                 if (storiesData.length === 3)  {    console.log('Didn\'t find any new stories.');
//                                                     return response.send('Didn\'t find any new stories.'); 
//                                                 }
//                 else { 

//                         try {   


//                                 const translatedJson = JSON.parse(storiesData.replace( /'/g,      '"'  )
//                                                                              .replace( /\*\*\*/g, "''" )
//                                                                     ); 
                                
//                                                                     console.log('Date type is: ',typeof new Date(translatedJson[0].date))
                                
//                                 const archiveValues  =  translatedJson.map( obj =>  `(  '${ obj.article_id                    }', 
//                                                                                         '${ obj.image                         }', 
//                                                                                         '${ obj.headline                      }', 
//                                                                                         '${ obj.description                   }', 
//                                                                                         '${ obj.link                          }',
//                                                                                         '${ new Date(obj.date).toISOString()  }' 
//                                                                                         )`
//                                                                             ).join(",");

//                                 const emailValues    =  translatedJson.map( (obj, index) => `(  '${ obj.article_id }',
//                                                                                                     ${ index          } 
//                                                                                                 )` 
//                                                                             ).join(",");


//                                 const transaction = `
//                                                         BEGIN;

//                                                             INSERT INTO archive (   article_id, 
//                                                                                     image, 
//                                                                                     headline, 
//                                                                                     description, 
//                                                                                     link,
//                                                                                     date
//                                                                                 ) 
//                                                                     VALUES ${archiveValues};

//                                                             INSERT INTO next_email (    article_id, 
//                                                                                         rank
//                                                                                     ) 
//                                                                     VALUES ${emailValues};

//                                                         COMMIT;
//                                                     `;
//                                                                 console.log('response before => ',response);
//                                 pool.query(transaction, (err, res) => {

//                                     if (err)    { console.log(`error messasge: `, err.message);       
//                                                 }
//                                     else        { console.log(`new stories successfully archived!\nHere's the reponse => ${response}`)   
//                                                     response.send(translatedJson);         
//                                                     response.locals.emailData = translatedJson;
//                                                     return next();                                                                          
//                                                 } 
//                                 })
                                                                                                                                        
//                             } 
//                 catch (err) {  
//                                 console.log(err);
//                                 return response.status(400).send('There was a problem parsing the json.'); 
//                             }
//                     }        

                
//             })
//         }
//     }) 
// }



// function getScheduledStories (request, response, next) {

//     console.log('checking for scheduled stories...')

//     const emailDataQuery =  `        SELECT archive.article_id, 
//                                             archive.image, 
//                                             archive.headline, 
//                                             archive.description, 
//                                             archive.link, 
//                                             next_email.rank
//                                        FROM archive
//                                  INNER JOIN next_email 
//                                          ON archive.article_id = next_email.article_id
//                                    ORDER BY rank DESC;
//                             `;

//     pool.query(emailDataQuery, (err, res) => {

//                 if (err)                                           {    console.log(err.message); 
//                                                                         return response.send(err.message);            
//                                                                    }
//         else  if (res.rows.length === 0)                           {    console.log(`no stories scheduled at present\nchecking for new stories instead...`); 
//                                                                         return getNewStories(); 
//                                                                    }
//         else  if (request.originalUrl === '/db/scheduledStories')  {    return response.send(res.rows) 
//                                                                    }
//         else                                                       {    response.locals.emailData = res.rows;
//                                                                         return next();
//                                                                    }                                                                              
//     })
// } 



// function getEmails (request, response, next) {



//     pool.query('SELECT email, email_token FROM emails', (err, res) => {
                
//                 if ( err )                  {   console.log(err.message); 
//                                                 return response.send(err.message);            
//                                             }
//         else  if ( res.rows.length === 0 )  {   console.log(`no emails saved`); 
//                                                 return response.send(`no emails saved`); 
//                                             }

//         else if ( request.originalUrl === 
//                    '/db/getEmailList'   )   {  return response.send(res.rows.map(email => email.email))
//                                             }
//         else                                {  response.locals.emailList = res.rows;
//                                                console.log(`got email list: ${response.locals.emailList}`);
//                                                return next();
//                                             }                                    

//     })
// }


// function subscribe (request, response) {

//     console.log('reqres => ',request,response);

//     const email      = request.body[0];
//     const emailToken = crypto.randomBytes(32).toString("hex");

//     const query      =  `INSERT INTO emails (email, email_token) VALUES ($1, $2)`;
                        
//     pool.query( query, [email, emailToken], (err, res) => {
//         if (!err) { console.log(res.rows);    response.send(res); }
//         else      { console.log(err.message); response.send(err.message); }
//     })
    

// }
    


      







// const newCategory = (request, response) => {

//     console.log('nu category coming...');
    
//     const category      =   request.body[0];
//     const rank          =   request.body[1];
//     const parameters    =   rank === 'DELETE'   ?   [ category  ]   :   [ category, rank, false, '' ];

//     const query1        =   rank === 'DELETE'   ?    `DELETE FROM categories
//                                                             WHERE category_name = $1;`
                    
//                                                 :    `INSERT INTO categories (category_name, rank, active, blurb)
//                                                            VALUES ($1, $2, $3, $4);
//                                                      `;

//     const query2        =   rank === 'DELETE'   ?   `DROP TABLE "${category}"`
                    
//                                                 :   `CREATE TABLE "${category}" (
//                                                         id serial primary key,
//                                                         headline text not null,
//                                                         story_url text not null,
//                                                         image_url text not null,
//                                                         image_alt text not null,
//                                                         date date not null,
//                                                         rank integer not null
//                                                     );`;

//     pool.connect((err, client, release) => {

//         if (err) { return console.error('Error acquiring client', err.stack) }

//         client.query('BEGIN', (err, res) => {

//             if (err) { return console.error('Error starting transaction', err.stack) }

//             client.query(query1, parameters, (err) => {

//                 if (err) { return client.query('ROLLBACK', () => {   release(); 
//                                                                      console.error('Error executing query 1', err.stack);
//                                                                      response.status(400).send(err.stack)
//                                                                  })
//                          }
                
//                 else     {  console.log(res.data);  }

//                 client.query(query2, (err, res) => {
            
//                     if (err) { return client.query('ROLLBACK', () =>    {   release();
//                                                                              console.error('Error executing query 2', err.stack);
//                                                                              response.status(400).send(err.stack)
//                                                                         })
//                              }
                    
//                     else     {  console.log(res.data);  }

//                     client.query('COMMIT', (err, res) => {
            
//                         if (err) { return client.query('ROLLBACK', () =>    {   release();
//                                                                                 console.error('Error committing transaction', err.stack);
//                                                                                 response.status(400).send(err.stack)
//                                                                             })
//                                  }

//                         else     {
//                                     release();
//                                     console.log('Transaction completed successfully');
//                                     response.send( rank === 'DELETE' ? 'category successfully deleted!' : 'new category added!')
//                                  }
//                     })
//                 })
//             })
//         })
//     }) 
// }








// const getData = (request, response) => {

//     console.log(request.body);

//     let   table        = request.body[0];
//     let   filters      = request.body[1];
    
//     let columns, limit, orderBy, groupBy;
    
//     if (request.body[2])  {( { 
//                                 orderBy,
//                                 limit,
//                                 groupBy,
//                                 columns    } = request.body[2]
//                           )}
          
   
//     let query          = !columns ? `SELECT *          FROM "${table}"`
//                                   : `SELECT ${columns} FROM "${table}"`;
//     let parameters     = [];
//     let index          =  1;


//     if (filters) {

//         query += ' WHERE ';

//         for (let i = 0; i < filters.length; i++) {              
                                                            
//             if        (filters[i].length === 2)              {      query += `${filters[i][0]} = $${index} AND `; 
//                                                                     parameters.push(filters[i][1]); console.log(typeof(filters[i][1]));
//                                                                     index += 1;          
//                                                              }
//             else if   (       filters[i][2]  === 'sub'   )   {      query += `${filters[i][0]} = ${filters[i][1]}    `
//                                                                                      //Don't remove these spaces ^^^^
//                                                              }
//             else if   (typeof(filters[i][2]) === 'string')   {      query += `${filters[i][0]} ${filters[i][2]} $${index} AND `; 
//                                                                     parameters.push(filters[i][1]); console.log(typeof(filters[i][1]));
//                                                                     index += 1;          
//                                                              }
//             else if   (filters[i].length === 3)              {      query += `${filters[i][0]} > $${index}   AND `+
//                                                                              `${filters[i][0]} < $${index+1} AND `;  
//                                                                     parameters.push(parseInt(filters[i][1]), parseInt(filters[i][2]));
//                                                                     index += 2;                                                          
//                                                              } 
//             else                                             {      continue;      }
//         }
//         query = query.slice(0,-4);
//     }

//     if (groupBy) {                                query += ` GROUP BY ${groupBy}`;
//                  }
//     if (orderBy) { typeof(orderBy) === 'string' ? query += ` ORDER BY ${orderBy} DESC`
//                                                 : query += ` ORDER BY ${orderBy[0]} ASC`;
//                  }
//     if (limit)   {                                query += ` LIMIT ${limit}`; 
//                  }
    

//     console.log('parameter => ', parameters[0]);
//     console.log(query, `\n`, parameters);
    
//     pool.query(query, parameters, (err, res) => {
//             if (!err) { console.log(res.rows);    response.send(res.rows);    }
//             else      { console.log(err.message); response.send(err.message); }
//         })
// }


// const deleteData = (request, response) => {

//     const table  = request.body[0];
//     const pkName = request.body[1];
//     const id     = request.body[2];
//     const rank   = request.body[3];

//     const deleteQuery  = `DELETE FROM "${table}" WHERE ${pkName} =$1`;
//     const cleanUpQuery = `UPDATE "${table}" SET rank = rank-1 WHERE rank > $1`;

//     if (rank) {

//         pool.query(deleteQuery, [id], (err, res) => {
//             if (err) { console.log(err.message); response.send(err.message);      }
//             else     { pool.query(cleanUpQuery, [rank], (err, res) => {
//                 if (!err) { console.log(res);         response.send(res);         }
//                 else      { console.log(err.message); response.send(err.message); }
//             })}
//         })
//     } else {

//         pool.query(deleteQuery, [id], (err, res) => {
//             if (err) { console.log(err.message); response.send(err.message); }
//             else     { console.log(res);         response.send(res);         }
//         })
//     }
// }

// const reRankData = (request, response) => {

//     const table       = request.body[0];
//     const pkName      = request.body[1];
//     const id          = request.body[2];
//     const oldRank     = request.body[3];
//     const newRank     = request.body[4];
    
//     let parameters1   = [ oldRank, newRank ]; 
//     let parameters2   = [ newRank, id      ];

//     let query1;
//       oldRank > newRank ? query1 = `UPDATE "${table}" SET rank = rank+1 WHERE (rank < $1 AND rank >= $2)`
//     : oldRank < newRank ? query1 = `UPDATE "${table}" SET rank = rank-1 WHERE (rank > $1 AND rank <= $2)`
//     :                               response.status(400).send('data error (rank === newRank)');
   
//     let query2                   = `UPDATE "${table}" SET rank = $1 WHERE (${pkName} = $2)`;


//     pool.query(query1, parameters1, (err, res) => {
//         if  (err)  { console.log('query1error: ', err.message); response.send(err.message); }
//         else       { console.log(res);
//                     pool.query(query2, parameters2, (err2, res2) => {
//                         if  (err)  { console.log('query2error: ', err.message); response.send(err.message); }
//                         else       { console.log('check2', res2);    response.send(res.rows);    }
//                     })}
//     })

// } 

// async function addData (request, response) {


//     let table      = request.body[0];
//     let columns    = request.body[1].join(', ');
//     let parameters = request.body[2];
//     let returning  = request.body[3];

//     let values     = parameters.map((column, index) =>'$'+(index+1)).join(', ')
//     let query      = `INSERT INTO "${table}" (${columns}) VALUES (${values});`

//     if (returning) { query+=' RETURNING '+returning; }

//     console.log(parameters);
    
//         pool.query(query, parameters, (err, res) => {
//             if (err) { console.log(err.stack);  response.send(err.message)  } 
//             else     {                          response.send(res.rows)     }
//         })
// }


// async function logPassword (request, response) {

//     let table       = request.body[0];
//     let fkKeyValue  = request.body[1];
//     let password    = request.body[2];
    
//     let hashedPass  = await bcrypt.hash(password, 10);
//     let parameters  = [ fkKeyValue[1], hashedPass ];
//     let query       = 'INSERT INTO '+table+' ('+fkKeyValue[0]+', password) VALUES ($1, $2)';

//     pool.query(query, parameters, (err, res) => {
//         if (err) { console.log(err.stack);  response.send(err.message)  } 
//         else     {                          response.send(res.rows)     }
//     })

// }

// const updateData = (request, response) => {
//     console.log('updating...');
    
//     let table      = request.body[0];
//     let columns    = request.body[1];
//     let parameters = request.body[2];
//     let pkKeyValue = request.body[3];
//     let query      = 'UPDATE '+table+' SET ';
   
//     console.log(columns.length, parameters.length)
//     console.log(request.body)

//     for (let i = 0; i < columns.length; i++) {
//         let value = i +1;
//         query += columns[i]+' = $'+value+', ';
//     }
//     query = query.slice(0,-2)+' WHERE '+pkKeyValue[0]+' = $'+(columns.length+1);
//     console.log(query);
//     console.log([].concat(parameters, pkKeyValue[1]))

//     pool.query(query, [].concat(parameters, pkKeyValue[1]), (err, res) => {
//         if (err) { console.log(err.stack);  response.send(err.message)  } 
//         else     { console.log('rowcount => ',res.rowCount); console.log(res);        response.send(res)     }
//     })
// }






// const checkPassword = (request, response) => {

//     let table          = request.body[0];
//     let pkKeyValue     = request.body[1];
//     let password       = request.body[2];
//     let query          = `SELECT * FROM `+table+` WHERE `+pkKeyValue[0]+` = $1`
    
//     console.log(query); 
//     pool.query(query, [pkKeyValue[1]], async (err, res) => {

//         if (err)   { console.log(err.message); return response.status(400).send(err.message); }
//         else       { 
//             console.log('query for ',pkKeyValue[1],' => ',res.rows)

//             if (res.rows.length === 0) { return response.status(400).send('database error'); }

//             let stashedPass = res.rows[0].password; console.log('stashed pass => '+stashedPass); console.log('password => ', password);
            
//             let match = await bcrypt.compare(password, stashedPass);

//             console.log('match => ', match);

//             if (match) {  console.log('MATCH!');   response.send('password matches');   }   
//             else       {  console.log('no match'); response.send('no match');           }  

             
//         }
//     })
// }



// const registerReset = (request, response) => {

//     let id     = request.body.resetId;
//     let fk     = request.body.fk;
//     let table  = request.body.pwTable;
//     let token  = response.locals.resetToken;
//     let query  = `UPDATE ${table} SET token = $1, reset_at = $2 WHERE ${fk} = $3`;

//     pool.query(query, [ token, Date.now(), id ], (err, res) => {

//             if (err) { console.log(err.stack);  response.status(400).send(err.message)  } 
//             else     {                          response.send('reset re-registered')    }
//     })

// }

// const resetPassword = async (request, response) => {

//     console.log('resetFunction\n'+request.body);
    
//     let id         =  request.body[0];
//     let newPass    =  request.body[1];
//     let table      =  request.body[2];
//     let fk         =  request.body[3];
//     let hashedPass =  await bcrypt.hash(newPass, 10);
//     let query      = `UPDATE ${table} SET password = $1 WHERE ${fk} = $2`


//     pool.query(query, [hashedPass, id], (err, res) => {
//         if (err) { console.log(err.stack);  response.send(err.message)           } 
//         else     { console.log(res);        response.send('password reset')      }
//     })
// }


// const newPasswordLogin = (request, response) => {

//     let table = request.body[0];
//     let idKey = request.body[1];
//     let id    = request.body[2];

//     let query = `SELECT * FROM ${table} WHERE ${idKey} = $1`

//     pool.query(query, [id], (err, res) => {
//         if (err) { console.log(err.stack);  response.send(err.message);  } 
//         else     { console.log(res);        response.send(res.rows);     }
//     })
// }


  
// module.exports = { getData, 
//                    addData, 
//                    getEmails, 
//                    subscribe, 
//                    getArticle, 
//                    deleteData, 
//                    reRankData,
//                    updateData,
//                    logPassword,
//                    newCategory,
//                    checkPassword, 
//                    registerReset,
//                    resetPassword,
//                    getNewStories,
//                    newPasswordLogin,
//                    getScheduledStories,
//                 };





