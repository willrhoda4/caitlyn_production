





const Pool = require('pg').Pool


const pool = new Pool({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'caitlyn',
                        password: 'rootUser',
                        port: 5432
                     })






// accepts an array of queries, parameters, and callbacks, then
// executes the queries in order, passing the results to the callbacks.
function atomicQuery (request, response, queries, parameters, callbacks, successMsg, next) { 


    // start at the first query.
    let steps = 0;

    // recursive function that executes the queries in order.
    function step (err, client, release) {

        // set our index before incrementing steps.
        // if there is a parameter at the index, pass it in with the query.
        let index = steps;
        let gear  = parameters[index] ? [ queries[index], parameters[index] ] 
                                      : [ queries[index]                    ];

        // if there are still queries left to execute, execute the next one.
        if (steps !== queries.length) {

            // increment steps.
            steps++;

            // execute the query.
            client.query(...gear, (err, res) => {

                // if there is an error, rollback the transaction and send the error message.
                if (err) { return client.query('ROLLBACK', () => {   release(); 
                                                                     console.error(`Error executing query ${steps}`, err.stack);
                                                                     response.status(400).send(err.stack)
                                                                 })
                         }
                
                // if there is no error, execute the callback (if defined) and move on to the next query.
                else     {  console.log(res.data);
                            callbacks[index] && callbacks[index](res.data, response);  
                            step(err, client, release);
                         }
            })


        // if there are no more queries to execute, commit the transaction.
        } else {

            client.query('COMMIT', (err, res) => {
            
                // if there is an error, rollback the transaction and send the error message.
                if (err) { return client.query('ROLLBACK', () =>    {   release();
                                                                        console.error('Error committing transaction', err.stack);
                                                                        response.status(400).send(err.stack)
                                                                    })
                         }

                // if there is no error, release the client and send the success message.
                else     {
                            release();
                            console.log('Transaction completed successfully');
                            next ? next () : response.send(successMsg);
                         }
            })
        }
    }

    // start the transaction.
    pool.connect((err, client, release) => {

        if (err) { return console.error('Error acquiring client', err.stack) }

        client.query('BEGIN', (err, res) => {

            if (err) { return console.error('Error starting transaction', err.stack) }

            // execute the first query.
            step(err, client, release);
        })
    }) 

}






// accepts a query, parameters, and a callback, then 
// executes the query and passes the results to the callback.
function simpleQuery(response, query, parameters, cleanUp, next) {

    const gear = parameters ? [query, parameters] : [query];

    pool.query(...gear, (err, res) => {
        
        if (err) { console.log(err.stack);
                   response.status(400).send(err.message);
                 } 
        else     { cleanUp && cleanUp(res.rows, response);
                   next     ? next() : response.send(res.rows); 
                 }
    });
};








/* 
Universal getData function that accepts request bodies in this format => [  'table_name', 
                                                                           [[array, of], [filter, arrays]]],
                                                                           { 
                                                                                orderBy: optional,
                                                                                groupBy: option_object,
                                                                                limit:   7
                                                                                columns: comma-separated string of columns to select. Default is *
                                                                           },
                                                                          ]
*/


const getData = (request, response) => {



    let table        = request.body[0];
    let filters      = request.body[1];
    
    let columns, limit, orderBy, groupBy;
    
    if (request.body[2])  {( { 
                                orderBy,
                                limit,
                                groupBy,
                                columns    } = request.body[2]
                          )}
          
   
    let query          = !columns  ?  `SELECT * FROM "${table}"`  : `SELECT ${columns} FROM "${table}"`;
    let parameters     = [];
    let index          =  1;

    
    console.log(`generating getData query for ${table}...`);


    if (filters) {

        query += ' WHERE ';

        for (let i = 0; i < filters.length; i++) {                  console.log(query);
                  
            // filter arrays with length 2 look for strict equivalence and are parameterized
            if        (filters[i].length === 2)              {      query += `${filters[i][0]} = $${index} AND `; 
                                                                    parameters.push(filters[i][1]);
                                                                    index += 1;          
                                                             }
            // filter arrays with length 3 and the string 'or' at index 2 are treated the same as filter arrays with
            // length 2, but chained together with an OR.           NOTE: DO NOT REMOVE THIS TRAILING SPACE vvvv
            else if   (       filters[i][2]  === 'or'    )   {      query += `${filters[i][0]} = $${index} OR  `;
                                                                    parameters.push(filters[i][1]);
                                                                    index += 1;          
                                                             }
            // else if   (       filters[i][2]  === 'sub'   )   {      query += `${filters[i][0]} = ${filters[i][1]}    `
            //                                                                          //Don't remove these spaces ^^^^
            //                                                  }
            // other filter arrays with length three and a string at index 2 pass in the string in lieu of =
            else if   (typeof(filters[i][2]) === 'string')   {      query += `${filters[i][0]} ${filters[i][2]} $${index} AND `; 
                                                                    parameters.push(filters[i][1]);
                                                                    index += 1;          
                                                             }
            // other filter arrays with length three are assumed to have numbners at index 1 and 2 which will be treated
            // as upper and lower limits for the range being queired.                                            
            else if   (filters[i].length === 3)              {      query += `${filters[i][0]} > $${index}   AND `+
                                                                             `${filters[i][0]} < $${index+1} AND `;  
                                                                    parameters.push(parseInt(filters[i][1]), parseInt(filters[i][2]));
                                                                    index += 2;                                                          
                                                             } 
            else                                             {      continue;      }
        }
        query = query.slice(0,-4);
    }

    
    // the following three if statements handle any extrap properties passed in the request body's option object, if present.
    if (groupBy) {                                query += ` GROUP BY ${groupBy}`;
                 }
    if (orderBy) { typeof(orderBy) === 'string' ? query += ` ORDER BY ${orderBy} DESC`
                                                : query += ` ORDER BY ${orderBy[0]} ASC`;
                 }
    if (limit)   {                                query += ` LIMIT ${limit}`; 
                 }
    

    console.log(`query: ${query}\n`);

    
    return simpleQuery(response, query, parameters);
}





// accepts a table name, a primary key name, and an id, then deletes the row with the matching id.
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
                              [],
                                'data successfully deleted'
                          );
    } else {

        return simpleQuery(response, query1, [id]);
    }
}






// accepts a table name, a primary key name, an id, an old rank, and a new rank, then 
// updates the rank of the row with the matching id.
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

    console.log(`reRanking data for ${table}\n`);

    return atomicQuery(      request, 
                             response,
                            [ query1,      query2       ],
                            [ parameters1, parameters2  ],
                            [],
                             'rank successfully updated'
                      );
} 





// accepts a table name, an array of columns, a two-dimensional array of parameters, and a returning clause, then
// inserts a new row into the table with the specified columns and parameters.
async function addData (request, response) {


    // destructure the request body.
    // convert columns to a string.
    let table        = request.body[0];
    let columns      = request.body[1].join(', ');
    let columnCount  = request.body[1].length;
    let parameters   = request.body[2];
    let returning    = request.body[3];


    // transform the parameters array into a values string.
    let values     =    parameters.map((row, rowIndex) => {

                            // make a string of parameter placeholders for each row.
                            // get the values into an array, then join them together with commas.
                            // return the string wrapped in parentheses and followed by a comma.
                            const      rowValues = row.map((value, colIndex) => `$${ colIndex + 1 + (rowIndex * columnCount) }` ).join(', ');
                            return `(${rowValues}),`;


                        // join the rows together with spaces and remove the trailing comma.
                        }).join(' ').slice(0,-1);

    // build the query.
    let query      = `INSERT INTO "${table}" (${columns}) VALUES ${values};`;

    // if there's a returning clause, add it to the end.
    if (returning) { query+=' RETURNING '+returning; }

    // execute the query.   
    // flatten the parameters array before passing it in.                        
    simpleQuery(response, query, parameters.flat());
}









// accepts a table name (string), an array of columns, an array of values,
// and a two-dimensional array of conditions, then updates the row with the matching conditions.
// the conditions array must be in the format [[column, value], [column, value], ...]
// here's an example of a request body:
//
    // const reqBody = [
    //       'archive',
    //     [ 'headline',  'link', 'image',  'description'   ],
    //     [  headline,    link,   imageUrl, description    ],
    //   [ [ 'article_id', articleId                        ] ]
    // ]
const updateData = (request, response) => {

    
    // destructure the request body.
    const table      = request.body[0];
    const columns    = request.body[1];
    const parameters = request.body[2];
    const conditions = request.body[3];
    
    // log to the console before starting query
    console.log(`Updating table ${table} \n`);

    // build a string of comma-separated column names and parameter placeholders for the SET clause.
    const colString  = columns.map( (column, index)    => `${column} = $${index+1}`).join(', ');

    // build a string of AND-separated column names and parameter placeholders for the WHERE clause.
    const conString  = conditions.map( (condition, index) => `${condition[0]} = $${index+1+columns.length}`).join(' AND ');

    // build the query.
    let query = `UPDATE ${table} SET ${colString} WHERE ${conString};`;

    // log the query to the console.
    console.log(`${query}\n`);

    // combine the parameters and condition values into a single array.
    const values = parameters.concat( conditions.map( condition => condition[1] ) );

    // execute the query.
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




