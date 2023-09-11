




import { useState, useEffect, useCallback } from 'react';

import Axios from 'axios';

import Input  from '../../components/Input.js';
import Button from '../../components/Button.js';

import EditorButtons from '../../components/EditorButtons.js';




// editor page for the categories table.
export default function Categories ({newStatus}) {

    const [ categoryData,        setCategoryData      ] = useState([]);
    const [ newCategory,         setNewCategory       ] = useState('');
    const [ addAttempted,        setAddAttempted      ] = useState(false);

    const [ newCategoryError,    setNewCategoryError  ] = useState(false);
    const [ newCategoryStatus,   setNewCategoryStatus ] = useState(false);


    
    // refreshes categoryData state with database call
    const loadData = useCallback(() => {

        
        Axios.post(`${process.env.REACT_APP_API_URL}getData`,   [ 'categories', null, { orderBy: 'rank' } ] )
        .then(   res =>   setCategoryData(res.data)                                               )
        .catch(  err =>   console.log(err)                                                        );
        
    }, [])


    // load state on initial page load
    useEffect(() =>   { loadData()                                     }, [loadData]    );

    // don't allow any nameless categories
    useEffect(() =>   { setNewCategoryError(newCategory.length === 0); }, [newCategory] );


    // provides a simple interface for editing a category table row.
    function categorySuite (category, catIndex) {


        // clickhandler function updates the blurb state of a category.
        // it's necessary because all the category blurb states are stored in an array.
        // updating database is handled by EditorButtons component.
        const changeBlurb = (state) => {
            
            const newState = categoryData.map((category, index) => { if (index !== catIndex) { return     category                 }
                                                                     else                    { return {...category, blurb: state } }
                                                                   }
                                             )
            setCategoryData(newState);
        }
            
           
        return (

            <div key={catIndex} className='w-[90%]'>

                {/* text area for blurb editing */}
                <Input 
                    type='textArea'
                    name={category.category_name} 
                    state={categoryData[catIndex].blurb}
                    setter={changeBlurb}
                    error={false}
                    wrapStyle={'w-[90%]'}
                />

                {/* simple indicator displays whether the category is live. */}
                <p className={`  text-sm
                                transition-colors
                                ${ category.active ? 'text-green-300' : 'text-red-300' }
                                `}
                >{ category.active ? 'online' : 'editing' }</p>


                {/* in addition to deleting and reranking, editor buttons for
                    categories can trigger blurb updates and page activations/deactions */}
                <EditorButtons 
                        id={category.category_id} 
                        name={category.category_name}
                        rank={category.rank} 
                        index={catIndex}
                        table={'categories'}
                        blurbs={categoryData.map(category => category.blurb)}
                        pkName={'category_id'}
                        active={category.active}
                        loadData={loadData}
                        dataSize={categoryData.length}
                />




            </div>
        )
    }


    // simple function to create a new category.
    // it requires a bespoke endpoint as it involves
    // creating a new table, as well as a fresh row
    // in the category table.
    function addCategory () {


        if (newCategoryError) { 
                                setAddAttempted(true); 
                                return newStatus( setNewCategoryStatus, `Can't have a category without a name...`); 
                              }

        // rank is set based on the length of the categoryData array,
        const newRank = categoryData.length+1;

        // the category name is capitalized to help
        // identify user-created tables in the database.
        const categoryCapitalized = newCategory[0].toUpperCase() + newCategory.slice(1);

        Axios.post(`${process.env.REACT_APP_API_URL}newCategory`, [  categoryCapitalized, newRank ])
             .then(   res => { 
                               setAddAttempted(false);
                               loadData()       
                             }
                   )
             .catch(  err => { 
                               err.response.data.startsWith('error: duplicate key') ? newStatus( setNewCategoryStatus, 'This category already exists')
                                                                                    : newStatus( setNewCategoryStatus, err.response.data);
                             }
                   );
    }
    
   
    
    
      return (
        <div>
         

            <Input 
                type='text'
                name='Category' 
                state={newCategory}
                setter={setNewCategory}
                error={newCategoryError && addAttempted}
                wrapStyle='pl-2 w-[80%]'
            />

            <div className='flex items-center'>

                <Button
                    name='Create Category'
                    onClick={addCategory}
                />  

                <p id='statusGraf'>{newCategoryStatus}</p>        
    
            </div>

            <form className=' p-4 
                              flex flex-col items-start
                            '>
    
                {   categoryData.length > 0 &&
                        categoryData.map((category, index) => categorySuite(category, index))
                }
    
    
            </form>
    
               
        </div>
        );
      }
    






