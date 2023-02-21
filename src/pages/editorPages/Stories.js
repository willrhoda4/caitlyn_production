





import { useState, 
         useEffect, 
         useCallback } from 'react';

import Axios           from 'axios';

import StoryTable      from '../../components/StoryTable.js';

import Input           from '../../components/Input.js';
import Button          from '../../components/Button.js';






export default function Stories () {



  const [ headline,        setHeadline        ] = useState('');
  const [ url,             setUrl             ] = useState('');
  const [ alt,             setAlt             ] = useState('');
  const [ image,           setImage           ] = useState('');
  const [ date,            setDate            ] = useState('');
  const [ category,        setCategory        ] = useState('');
  
  const [ headlineError,   setHeadlineError   ] = useState(false);
  const [ urlError,        setUrlError        ] = useState(false);
  const [ altError,        setAltError        ] = useState('');
  const [ imageError,      setImageError      ] = useState(false);
  const [ dateError,       setDateError       ] = useState(false);
  const [ categoryError,   setCategoryError   ] = useState('');

  // const [ categories,      setCategories      ] = useState([]);
  // const [ storyData,       setStoryData       ] = useState([]);
  const [ data,            setData            ] = useState([]);

  const [ scrapeStatus,    setScrapeStatus    ] = useState('');

  
  

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


  


  const getData = (reqBody) => Axios.post('http://localhost:3000/getData', reqBody);



  const loadData = useCallback(() => {

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData() }, []);





  function saveStory () {

    console.error('an error');

    const newRank = data[data.findIndex(type => type.category_name === category)].stories.length+1;

    console.log(newRank)

    Axios.post('http://localhost:3000/addData', [     category, 
                                                      [ 'headline', 'story_url', 'image_url', 'image_alt', 'date', 'rank'    ], 
                                                      [  headline,   url,         image,       alt,         date,   newRank  ]
                                                   ])
         .then(  res => { console.log(res); loadData()}       )
         .catch( err => console.log(err) )

  }


  function getInfo () {

    setScrapeStatus('retrieving info...')

    setHeadline('');
    setDate('');
    setImage('');
    setAlt('');

    Axios.post( 'http://localhost:3000/getArticle', [ url ] )
         .then(  res => {
                          console.log(res);

                          if (res.code === 'ERR_BAD_REQUEST') { return setScrapeStatus('there was an error.') } 
                          else  {

                            setScrapeStatus('info retrieved!');
                            setTimeout(() => setScrapeStatus(''), 3000);

                            setHeadline(res.data[0]);
                            setDate(res.data[1]);
                            setImage(res.data[2]);
                            setAlt(res.data[3]);
                            
                          }
                        }                )
         .catch( err => {
                          console.log(err);
                          setScrapeStatus('there was an error.')
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

              {<p>{scrapeStatus}</p>}

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

            <Button
                name='Upload Story'
                onClick={saveStory}
            />

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
