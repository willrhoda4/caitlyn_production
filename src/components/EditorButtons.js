







import ButtonBank        from './ButtonBank.js';

import promoteIcon      from '../images/icon_arrowUp.svg';
import demoteIcon       from '../images/icon_arrowDown.svg';
import deleteIcon       from '../images/icon_trash.svg';
import updateIcon       from '../images/icon_upload.svg';
import activateIcon     from '../images/icon_activate.svg'


import Axios            from 'axios';  




// Provides a bank of buttons for the editor pages.
export default function EditorButtons ({    id, 
                                            name,
                                            rank, 
                                            index,
                                            table,
                                            state,
                                            blurbs,
                                            pkName,
                                            active,
                                            loadData,
                                            setState,
                                            dataSize  }) { 



    // the stock arrays are for features used on all tables.
    const stockNames              = [ 'delete',      'promote',      'demote'                 ];
    const stockIcons              = [ deleteIcon,     promoteIcon,    demoteIcon              ];
    const stockFunctions          = [ deleteItem,     promoteItem,    demoteItem              ];

    // the category arrays are used only for the categories table,
    // which requires a couple extra features.
    const categoryNames           = [ 'update',      'activate'                               ];
    const categoryIcons           = [  updateIcon,    activateIcon                            ];
    const categoryFunctions       = [  updateBlurb,   activateCategory                        ];
    
    // the buttonConditions array is used to determine which buttons should be rendered,
    // in the case of rank 0 (last place), the demote button is not rendered, and in the case
    // of the top-rated item in the list, the promote button is not rendered.
    const buttonConditions        = [  undefined,     index !== 0,    index !== dataSize-1    ];

    // use ternaries to determine which arrays to use for the button bank.
    const buttonNames             =   table !== 'categories' ? stockNames     : stockNames.concat(categoryNames);
    const buttonIcons             =   table !== 'categories' ? stockIcons     : stockIcons.concat(categoryIcons);
    const buttonFunctions         =   table !== 'categories' ? stockFunctions : stockFunctions.concat(categoryFunctions);



    // updates the category blurb in the database,
    // following user confirmation.
    function updateBlurb () {


        const warning = `Are you sure you want to update the category blurb for ${name}?`;
        
        window.confirm(warning) &&    Axios.put('http://localhost:3000/updateData',  [      'categories', 
                                                                                        [   'blurb'             ], 
                                                                                        [    blurbs[index]      ],
                                                                                        [ [ 'category_id', id ] ]
                                                                                     ])
                                          .then(  res => loadData()                   )
                                         .catch(  err => console.log(err)             );
                                    }





    // activates or deactivates a category,
    // essentially toggling its visibility on the website.
    function activateCategory () {

        const warning = active ? 'Deactivating this category will make it invisible to your website visitors. Are you sure you want to take this category offline?'
                               : `Activating this category will make it immediately live on your website. Are you sure you want to proceed?`;

        window.confirm(warning) && Axios.put('http://localhost:3000/updateData',         [      'categories', 
                                                                                            [   'active'            ], 
                                                                                            [   !active             ],
                                                                                            [ [ 'category_id', id ] ]
                                                                                         ])
                                       .then(  res => {loadData(); console.log(res);  }   )
                                      .catch(  err => console.log(err)                    );
    }
    

    

    

    
    // deletes an item from the database or newsletter state,
    // deleting a category requires a different endpoint
    // since it requires deleting a table in addition to a row from categories.
    function deleteItem() {


        const warning   = table === "next_newsletter"     ? `Are you sure you want to remove this story from this month's newsletter?`
                                                          : "Are you sure you want to delete this item from the database?";
      
        const deleteData = () => table !== "categories"   ? Axios.post("http://localhost:3000/deleteData",     [ table, pkName, id, rank ] )
                                                          : Axios.post("http://localhost:3000/deleteCategory", [ name, "DELETE"          ] );
                                                        
        const newState   =                                  state.filter((item) => item.article_id !== id);


        window.confirm(warning) && 

                          (table === "next_newsletter")   ? setState(newState)
                                                          : deleteData().then( res => loadData() );
        
      }








    // demotes an item in the database or newsletter state,
    // note that we decrement the rank of the item being demoted,
    // but we increment the index, as they're loaded inversely.
    function demoteItem () {  

        // if the table is not the newsletter, we need to re-rank the data in the database.
        if (table !== 'next_newsletter') {

            let reqBody =  [ table, pkName, id, rank, rank-1 ];
                    
            Axios.post( `${process.env.REACT_APP_API_URL}reRankData`,  reqBody   )  
                 .then(  res => loadData()                                       )
                .catch(  err => console.log(err)                                 );  
  
        } else {

            // if the table is the newsletter, we need to re-rank the data in the state.
            // create a shallow copy of the state, swap the item with the one above it,
            // and then set the state to the new array.
            let newState = [...state];

            [ newState[index], newState[index + 1] ] = [ newState[index + 1], newState[index] ];

            setState(newState);
        }
    }



    // promotes item works just like demote item, but in reverse.
    function promoteItem () {  

        if (table !== 'next_newsletter') {

            let reqBody =  [ table, pkName, id, rank, rank+1 ];
                    
            Axios.post( `${process.env.REACT_APP_API_URL}reRankData`,  reqBody   )  
                 .then(  res => loadData()                                       )
                .catch(  err => console.log(err)                                 );  
  
        } else {

            let newState = [...state];

            [ newState[index], newState[index - 1] ] = [ newState[index - 1], newState[index] ];

            setState(newState);
        }
    }




    

   // render the button bank.
    return (

            <ButtonBank
                names={      buttonNames      }
                icons={      buttonIcons      }
                onClicks={   buttonFunctions  }
                conditions={ buttonConditions }
            />
    )
}