





import ButtonBank        from './ButtonBank.js';

import promoteIcon      from '../images/icon_arrowUp.svg';
import demoteIcon       from '../images/icon_arrowDown.svg';
import deleteIcon       from '../images/icon_trash.svg';
import updateIcon       from '../images/icon_upload.svg';
import activateIcon     from '../images/icon_activate.svg'


import Axios            from 'axios';  

import { useState, useEffect, useCallback  }     from 'react';


export default function EditorButtons ({    id, 
                                            name,
                                            rank, 
                                            index,
                                            table,
                                            blurbs,
                                            pkName,
                                            active,
                                            loadData,
                                            dataSize  }) { 

    const [ loading, setLoading ] = useState(false);

    const stockNames              = [ 'delete',      'promote',      'demote'        ];
    const stockIcons              = [ deleteIcon,     promoteIcon,    demoteIcon     ];
    const stockFunctions          = [ deleteItem,     promoteItem,    demoteItem     ];

    const categoryNames           = [ 'update',      'activate'                      ];
    const categoryIcons           = [  updateIcon,    activateIcon                   ];
    const categoryFunctions       = [  updateBlurb,   activateCategory               ];
    
    const buttonConditions        = [ null,  index !== 0,    index !== dataSize-1    ];

    const buttonNames             =   table !== 'categories' ? stockNames     : stockNames.concat(categoryNames);
    const buttonIcons             =   table !== 'categories' ? stockIcons     : stockIcons.concat(categoryIcons);
    const buttonFunctions         =   table !== 'categories' ? stockFunctions : stockFunctions.concat(categoryFunctions);



    function updateBlurb () { 
        
     
        Axios.put('http://localhost:3000/updateData',  [    'categories', 
                                                          [ 'blurb'           ], 
                                                          [  blurbs[index]    ],
                                                          [ 'category_id', id ]
                                                       ])
             .then(  res => loadData()                     )
             .catch( err => console.log(err)               )
    }

    function activateCategory () {

        let warning = active ? 'Deactivating this category will make it invisible to your website visitors. Are you sure you want to take this category offline?'
                             : `Activating this category will make it immediately live on your website. Are you sure you want to proceed?`;

        window.confirm(warning) && Axios.put('http://localhost:3000/updateData', [    'categories', 
                                                                                    [ 'active'          ], 
                                                                                    [ !active           ],
                                                                                    [ 'category_id', id ]
                                                                                 ])
                                       .then(  res => {loadData(); console.log(res);  }             )
                                       .catch( err => console.log(err)               )
    }
    

    

    

    
    
    function deleteItem () {   


        const warning = table === 'next_email' ? 'Are you sure you want to remove this story from this month\'s newsletter?'
                                               : 'Are you sure you want to delete this item from the database?';

        const deleteData = () => table !== 'categories'      ?   Axios.post('http://localhost:3000/deleteData',  [ table, pkName, id, rank ])
                                                             :   Axios.post('http://localhost:3000/deleteCategory', [ name,  'DELETE'         ]);

        window.confirm(warning)  &&  deleteData().then(res => { console.log(res); loadData() });   
    }


    function demoteItem () {  

        if (loading) return;
        setLoading(true);

        let reqBody =  [ table, pkName, id, rank, rank-1 ];
                
        Axios.post('http://localhost:3000/reRankData',  reqBody                 )  
             .then(  res => { loadData(); setLoading(false); }                  )
             .catch( err => console.log(err)                                    );  
  
    }


    function promoteItem () { 

        if (loading) return;
        setLoading(true);

        let reqBody =  [ table, pkName, id, rank, rank+1 ];
        
        Axios.post('http://localhost:3000/reRankData',  reqBody                     )
             .then(  res => { console.log(res); loadData(); setLoading(false); }    )
             .catch( err => console.log(err)                                        );  
     
    }


    
    

   
    return (

            <ButtonBank
                names={      buttonNames      }
                icons={      buttonIcons      }
                onClicks={   buttonFunctions  }
                conditions={ buttonConditions }
            />
          
    )
}