





const { spawn } = require('child_process');

const db        = require('./database.js');


const Pool = require('pg').Pool


const pool = new Pool({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'caitlyn',
                        password: 'rootUser',
                        port: 5432
                     })




// function atomicQuery (request, response, queries, parameters, successMsg) { console.log('GOT THIS => ',queries, parameters);


//     let steps = 0;


//     function step (err, client, release) {

//         let index = steps;
//         let gear  = parameters[index] ? [ queries[index], parameters[index] ] 
//                                       : [ queries[index]                    ];

//         if (steps !== queries.length) {

//             steps++;

//             client.query(...gear, (err, res) => {

//                 if (err) { return client.query('ROLLBACK', () => {   release(); 
//                                                                      console.error(`Error executing query ${steps}`, err.stack);
//                                                                      response.status(400).send(err.stack)
//                                                                  })
//                          }
                
//                 else     {  console.log(res.data);  
//                             step(err, client, release);
//                          }
//             })

//         } else {

//             client.query('COMMIT', (err, res) => {
            
//                 if (err) { return client.query('ROLLBACK', () =>    {   release();
//                                                                         console.error('Error committing transaction', err.stack);
//                                                                         response.status(400).send(err.stack)
//                                                                     })
//                          }

//                 else     {
//                             release();
//                             console.log('Transaction completed successfully');
//                             response.send(successMsg);
//                          }
//             })
//         }
//     }

//     pool.connect((err, client, release) => {

//         if (err) { return console.error('Error acquiring client', err.stack) }

//         client.query('BEGIN', (err, res) => {

//             if (err) { return console.error('Error starting transaction', err.stack) }

//             step(err, client, release);
//         })
//     }) 

// }




function getArticle (request, response) {

    const getArticle = spawn('python3', ['../../caitlyn_py/getArticle.py', request.body[0]]);
    let   articleData = '';
    
    console.log('getting Article...', request.body[0]);
    
    getArticle.stdout.on('data', function (data) {

        console.log(`Pipe data from python script => ${data} ${typeof(data)}, ${data.keys}`);

        articleData += data.toString();
    })

    getArticle.on('close', (code) => {
        
        console.log(articleData);

        if (!articleData) { response.status(400).send('There was a problem retrieving your info.'); }
        else              { articleData  = JSON.parse(articleData.replace(/'/g, '"')
                                                                 .replace( /\*\*\*/g, "''" ));
                            response.send(articleData);
                          }        
    })
}




function newCategory (request, response) {

    console.log('nu category coming...');
    
    const category      =    request.body[0];
    const rank          =    request.body[1];
    const parameters    =  [ category, rank, false, '' ];

    const query1        =   `INSERT INTO categories (category_name, rank, active, blurb)
                                  VALUES ($1, $2, $3, $4);
                            `;

    const query2        =   `CREATE TABLE "${category}" (
                                id serial primary key,
                                headline text not null,
                                story_url text not null,
                                image_url text not null,
                                image_alt text not null,
                                date date not null,
                                rank integer not null
                            );`;

    return db.atomicQuery(      request, 
                                response,
                                [ query1,       query2 ],
                                [ parameters,          ],
                                'new category added!!'
                         );
}




function deleteCategory (request, response) {

    console.log('preparing to delete category...');
    
    const category      =   request.body[0];

    const query1        =   `DELETE FROM categories
                                   WHERE category_name = $1;`;

    const query2        =   `DROP TABLE "${category}"`;

    return db.atomicQuery(      request, 
                                response,
                                [   query1,     query2 ],
                                [ [ category ]         ],
                                'category deleted!!'
                         );
}






  
module.exports =    { 
                        getArticle,  
                        newCategory,
                        deleteCategory,
                    };





