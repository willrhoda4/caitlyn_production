





import { useState, 
         useEffect, 
         useCallback } from 'react';

import Axios           from 'axios';

import StoryTable      from '../../components/StoryTable.js';

import Input           from '../../components/Input.js';
import Button          from '../../components/Button.js';





// Stories is the page where the user can add, edit, and delete stories from their portfolio.
export default function Stories ({newStatus}) {


  // form state
  const [ headline,        setHeadline        ] = useState('');
  const [ url,             setUrl             ] = useState('');
  const [ alt,             setAlt             ] = useState('');
  const [ image,           setImage           ] = useState('');
  const [ date,            setDate            ] = useState('');
  const [ category,        setCategory        ] = useState('');
  
  // form errors
  const [ headlineError,   setHeadlineError   ] = useState(false);
  const [ urlError,        setUrlError        ] = useState(false);
  const [ altError,        setAltError        ] = useState(false);
  const [ imageError,      setImageError      ] = useState(false);
  const [ dateError,       setDateError       ] = useState(true);
  const [ categoryError,   setCategoryError   ] = useState(true);

  // data state
  const [ data,            setData            ] = useState([]);

  // status messages
  const [ scrapeStatus,    setScrapeStatus    ] = useState('');
  const [ storyStatus,     setStoryStatus     ] = useState('');



  // clears the form
  function clearForm (keepUrl) {

      !keepUrl && setUrl('');
      setHeadline('');
      setAlt('');
      setImage('');
      setDate('');
      setCategory('');
  }


  // displays a message to the user when they scrape a story.
  function newScrapeStatus (status) { newStatus(setScrapeStatus, status, 'scrapeStatusGraf') };

  
  // displays a message to the user when they add a story.
  function newStoryStatus  (status) { newStatus(setStoryStatus,  status, 'storyStatusGraf' ) };











  
  // error handling effects for form inputs
  useEffect(() =>   { setHeadlineError(headline.length === 0);  }, [headline]  );

  useEffect(() =>   { setAltError(alt.length === 0);            }, [alt]       );

  useEffect(() =>   { date       &&  setDateError(false);       }, [date]      );
  
  useEffect(() =>   { category   &&  setCategoryError(false);   }, [category]  );

  useEffect(() => {  try { new URL(url);  
                           setUrlError(false);
                         } 
               catch (e) { setUrlError(true);
                         }
  }, [url]);

  useEffect(() => {  try { new URL(image);
                           setImageError(false);
             } catch (e) { setImageError(true);
                         }
  }, [image]);


  

  // all-terrain data getter
  const getData = (reqBody) => Axios.post('http://localhost:3000/getData', reqBody);


  // load data from database
  // it first retrieves a list of categories, then for each category it retrieves a list of stories
  const loadData = useCallback(() => {

    clearForm();

    getData([ 'categories', null, { orderBy: 'rank' } ] )
      .then(  res => {

                const categories = res.data;

                const requests = categories.map( (category, index) => {

                  return  getData( [ categories[index].category_name, null, { orderBy: 'rank' } ])
                            .then(   res2 => { 
                                              return {
                                                       ...category,
                                                       stories: res2.data
                                                     }  
                                            }
                                 )
                           .catch(   err => { console.error(err); }              );
                });
            
                Promise.all( requests                         )
                      .then( res => {   setData(res);  } )
                     .catch( err => {   console.error(err); } );
                
                
              }       
           )
     .catch(  err => console.log(err)                   );

  }, [])

  // load data on initial page load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData() }, []);




  // adds a story to the database
  function saveStory () {

    // make sure all fields are filled out
    if (

      headlineError   ||        
      urlError        ||        
      altError        ||        
      imageError      ||        
      dateError       || 
     !category        ||       
      categoryError   ){ return newStoryStatus('no blank fields, please.') }

    // calculates the next available rank for a given category
    const newRank = data[data.findIndex(type => type.category_name === category)].stories.length+1;


    Axios.post('http://localhost:3000/addData', [     category, 
                                                      [  'headline', 'story_url', 'image_url', 'image_alt', 'date', 'rank'    ], 
                                                      [[  headline,   url,         image,       alt,         date,   newRank  ]]
                                                   ])
         .then(  res => { newStoryStatus('Story successfully saved!'); loadData()} )
         .catch( err =>   newStoryStatus(`There was an error: ${err}`)             )

  }


  // sends request to story_scraper micro service to scrape the url for info
  // note that it only works for CBC.ca stories.
  function getInfo () {


    // error handling
         if (  urlError  )               { return newScrapeStatus('invalid url!')                       }
    
    else if ( !url.includes('cbc.ca/') ) { return newScrapeStatus('only CBC.ca stories are supported!') }

    else                                 {        setScrapeStatus('retrieving info...')                 }            
     
      clearForm(true);

      // send request
      Axios.post( `${process.env.REACT_APP_STORY_SCRAPER}getArticle/`, { url: url } )
          .then(  res => {
                            console.log(res);

                          
                            if (res.code === 'ERR_BAD_REQUEST') { return newScrapeStatus('there was an error.'); } 
                            else  {

                              newScrapeStatus('info retrieved!');
                              setTimeout(() => setScrapeStatus(''), 3000);

                              setHeadline(res.data[0]);
                              setDate(res.data[1]);
                              setImage(res.data[2]);
                              setAlt(res.data[3]);
                              
                            }
                          }                )
          .catch( err => {
                            console.log(err);
                            newScrapeStatus('there was an error.');
                          }
               )
  }




  return (
    <>

        <form className=' p-4 
                          flex flex-col items-start
                        '>


            <Input
                type='text' 
                name='URL' 
                state={url}
                setter={setUrl}
                error={urlError}
            />

            <div className='flex items-center'>

              <Button
                  name='Get Info'
                  onClick={getInfo}
              />

              {<p id='scrapeStatusGraf'>{scrapeStatus}</p>}
       
            </div>


            <Input
                type='text' 
                name='Headline' 
                state={headline}
                setter={setHeadline}
                error={headlineError}
            /> 

            <Input 
                type='date'
                name='Date' 
                state={date}
                setter={setDate}
                error={dateError}
            />
                    

            <Input
                type='text' 
                name='Image' 
                state={image}
                setter={setImage}
                error={imageError}
            />
            
            <Input
                type='text' 
                name='Image Description' 
                state={alt}
                setter={setAlt}
                error={altError}
            />
            
            <Input 
                type='select'
                name='Category' 
                state={category}
                setter={setCategory}
                error={categoryError}
                options={data.map(category => category.category_name)}
            />

            <div className='flex items-center'>

              <Button
                  name='Upload Story'
                  onClick={saveStory}
              />

              {<p id='storyStatusGraf'>{storyStatus}</p>}

            </div>

        </form>

        <div className='flex flex-col'>
          {     data.length > 0 &&
                data.map((category, index) => <StoryTable 
                                                  key={category.category_id}
                                                  category={category.category_name}
                                                  storyData={category.stories}
                                                  loadData={loadData}
                                              />
                        )
          }
        </div>        
      </>
    );
  }
