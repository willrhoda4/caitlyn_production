




import { useState, useEffect, useCallback } from 'react';

import Axios from 'axios';

import Input  from '../../components/Input.js';
import Button from '../../components/Button.js';

import EditorButtons from '../../components/EditorButtons.js';





export default function Categories () {

    const [ categoryData,        setCategoryData      ] = useState([]);
    const [ newCategory,         setNewCategory       ] = useState('');
    const [ newCategoryError,    setNewCategoryError  ] = useState(false);
    const [ newCategoryStatus,   setNewCategoryStatus ] = useState(false);

    function newStatus (status) {

        setNewCategoryStatus(status);
        setTimeout(() => setNewCategoryStatus(false), 3000);
    }

    
    
    const loadData = useCallback(() => {

        
        Axios.post('http://localhost:3000/getData',   [ 'categories', null, { orderBy: 'rank' } ] )
        .then(   res => { console.log(res.data); setCategoryData(res.data) }                      )
        .catch(  err => console.log(err)                                                          );
        
    }, [])


    useEffect(() =>   { loadData()                                     }, [loadData]    );

    useEffect(() =>   { setNewCategoryError(newCategory.length === 0); }, [newCategory] );


    function categorySuite (category, catIndex) {

        const changeBlurb = (state) => {
            
            const newState = categoryData.map((category, index) => { if (index !== catIndex) { return     category                 }
                                                                     else                    { return {...category, blurb: state } }
                                                                   }
                                             )
            setCategoryData(newState);
        }
            
           
        return (
            <div key={catIndex}>

                <Input 
                    type='textArea'
                    name={category.category_name} 
                    state={categoryData[catIndex].blurb}
                    setter={changeBlurb}
                    error={false}
                />
                   <p className={`  text-sm
                                    transition-colors
                                    ${ category.active ? 'text-green-300' : 'text-red-300' }
                                 `}
                    >{ category.active ? 'online' : 'editing' }</p>

                <div className='flex'>


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

            </div>
        )
    }


    // }
    function addCategory () {

        if (newCategoryError) { return newStatus('Can\'t have a category without a name...'); }

        const newRank = categoryData.length+1;

        Axios.post('http://localhost:3000/newCategory', [  newCategory, newRank ])
             .then(   res => { console.log('category added!'); 
                               loadData()       
                             }
                   )
             .catch(  err => { console.log(err);
                               err.response.data.startsWith('error: duplicate key') ? newStatus('This category already exists')
                                                                                    : newStatus(err.response.data);
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
                error={newCategoryError}
                wrapStyle='pl-2 w-5/6'
            />

            <div className='flex items-center'>

                <Button
                    name='Create Category'
                    onClick={addCategory}
                />  

                <p>{newCategoryStatus}</p>        
    
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
    






