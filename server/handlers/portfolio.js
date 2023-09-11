






const db        = require('./database.js');









// creates a new category and adds it to the database.
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
                                [],
                                'new category added!!'
                         );
}



// deletes a category and removes it from the database.
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
                                [],
                                'category deleted!!'
                         );
}






  
module.exports =    { 
                        newCategory,
                        deleteCategory,
                    };





