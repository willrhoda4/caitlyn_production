





const { spawn } = require('child_process');
const   bcrypt  = require('bcrypt');
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










function getNewStories (request, response, next) {  


    console.log('retrieving archive...');
        
    pool.query('SELECT article_id FROM archive', (err, res) => {

        if (err) { console.log(err.message); response.send(err.message); }
        else     { 
            
            console.log('archive retrieved. \nchecking for new stories...');  

            const storyIds      = res.rows.map(story => story.article_id); 
            const getNewStories = spawn('python3', ['../../caitlyn_py/caitlynScraper.py', storyIds]);
            let   storiesData   = '';
        
            getNewStories.stdout.on('data', function (data) { 

                console.log(`Pipe data from python script:\n\n${data}\n\n}`);
        
                storiesData += data.toString();
            })
        
            getNewStories.on('close', (code) => {
                
                console.log('closing connection now...');  
        
                if (storiesData.length === 3)  {    console.log('Didn\'t find any new stories.');
                                                    return request.originalUrl === '/scheduledStories' ?    response.send('No new stories. No scheduled stories')
                                                                                                       :    next(); 
                                               }
                else { 

                        try {   


                                const translatedJson = JSON.parse(storiesData.replace( /'/g,      '"'  )
                                                                             .replace( /\*\*\*/g, "''" )
                                                                 ); 
                                                                
                                const archiveValues  =  translatedJson.map( obj => `(   '${ obj.article_id                    }', 
                                                                                        '${ obj.image                         }', 
                                                                                        '${ obj.headline                      }', 
                                                                                        '${ obj.description                   }', 
                                                                                        '${ obj.link                          }',
                                                                                        '${ new Date(obj.date).toISOString()  }' 
                                                                                    )`
                                                                          ).join(",");

                                const emailValues    =  translatedJson.map( (obj, index) => `(  '${ obj.article_id }',
                                                                                                 ${ index          } 
                                                                                             )` 
                                                                          ).join(",");


                                const transaction = `
                                                        BEGIN;

                                                            INSERT INTO archive (   article_id, 
                                                                                    image, 
                                                                                    headline, 
                                                                                    description, 
                                                                                    link,
                                                                                    date
                                                                                ) 
                                                                 VALUES ${archiveValues};

                                                            INSERT INTO next_email  (   article_id, 
                                                                                        rank
                                                                                    ) 
                                                                 VALUES ${emailValues};

                                                        COMMIT;
                                                    `;

                                pool.query(transaction, (err, res) => {

                                    if (err)    {   console.log(`error messasge:  `, err.message);   
                                                    return response.status(400).send(err.message);    
                                                }
                                    else        {   console.log(`new stories successfully archived!`);
                                                    response.send(translatedJson);         
                                                    return next();                                                                          
                                                } 
                                })
                                                                                                                                        
                            } 
                catch (err) {  
                                console.log(err);
                                return response.status(400).send('There was a problem parsing the json.'); 
                            }
                    }        
            })
        }
    }) 
}




function getScheduledStories (request, response, next) {

    console.log('checking for scheduled stories...');

    const emailDataQuery =  `        SELECT archive.article_id, 
                                            archive.image, 
                                            archive.headline, 
                                            archive.description, 
                                            archive.link, 
                                            next_email.rank
                                       FROM archive
                                 INNER JOIN next_email 
                                         ON archive.article_id = next_email.article_id
                                   ORDER BY rank DESC;
                            `;

    pool.query(emailDataQuery, (err, res) => {'/scheduledStories'

              if (err)                                             {    console.log(err.message); 
                                                                        return response.send(err.message);            
                                                                   }
                                                                   
        else  if (res.rows.length === 0)                           {    console.log(`No stories scheduled at present.`);

                                                                        if (request.orignalUrl === '/scheduledStories') {
                                                                            
                                                                            console.log(`Checking for new stories instead...`); 
                                                                            return getNewStories(); 

                                                                        } else {

                                                                            return response.send('No new or scheduled stories to promote.');
                                                                        }         
                                                                   }
        else  if (request.originalUrl === '/scheduledStories')     {    return response.send(res.rows) 
                                                                   }
        else                                                       {    response.locals.emailData = res.rows;
                                                                        return next();
                                                                   }                                                                              
    })
} 




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




function subscribe (request, response) {


    const email      = request.body[0];
    const emailToken = crypto.randomBytes(32).toString("hex");

    const query      =  `INSERT INTO emails (email, email_token) VALUES ($1, $2)`;
                        
    return db.simpleQuery(response, query, [email, emailToken]);
    
}
    


    

      








  
module.exports = {
                   getEmails, 
                   subscribe, 
                   getNewStories,
                   getScheduledStories,
                };





