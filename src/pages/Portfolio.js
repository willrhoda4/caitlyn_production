








import { useState, 
         useEffect    } from 'react';
  
import Axios            from 'axios'
  
import Title            from '../pages/portfolioPages/Title.js'
import Bio              from '../pages/portfolioPages/Bio.js'
import Samples          from '../pages/portfolioPages/Samples.js'
import Qualifications   from '../pages/portfolioPages/Qualifications.js'
import Contact          from './portfolioPages/Contact.js'
import Subscribe        from './portfolioPages/Subscribe.js';  
import Construction     from './utilityPages/Construction.js';

import Navigator       from '../components/Navigator.js';




// Portfolio is the  component for the public-facing portfolio.
export default function Portfolio ({newStatus}) {





  const [ currentPage,      setCurrentPage     ] = useState(0);
  const [ animation,        setAnimation       ] = useState(false);
  
  const [ data,             setData            ] = useState([]);
  const [ credentialData,   setCredentialData  ] = useState([]);

  const [ construction,     setConstruction    ] = useState(false);
  const [ awardsDisplayed,  setAwardsDisplayed ] = useState(false);

  
  // parse category names into a string for the bio page.
  const   topics      = data.map( category => category.category_name.toLowerCase() )

  const   topicString = topics.length === 1  ?    topics[0]
                                             : `${topics.slice(0, -1).join(', ')} and ${topics.slice(-1)}`;
  
                                             


  // fires on initial render to get all data from the database.
  useEffect(() => {


    // getData is a helper function that makes a post request to the server.
    const getData = (reqBody) => Axios.post(`${process.env.REACT_APP_API_URL}getData`, reqBody);

    // category data is the biggest hassle.
    getData([ 'categories', null, { orderBy: 'rank' } ] )
      .then(  res => {


               // first get all categories from the category table,
              const categories = res.data.filter(category => category.active);

              // then iterate through each category and create an array of promises,
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
          
              // then use Promise.all to wait for all promises to resolve,
              // slap the response right into state as an array of objects. 
              Promise.all( requests                         )
                    .then( res => {   setData(res);  console.log(res)} )
                   .catch( err => {   console.error(err); } );
              
              
            }       
          )
    .catch(  err => console.log(err) );

    


    // get the awards data        
    getData([ 'awards', null, { orderBy: 'rank' } ] )
      .then(   res => setCredentialData(res.data)   )
     .catch(   err => console.log(err)              );

    // see if we're even displaying it
    getData([ 'misc', [['description', 'awards_displayed']] ] )
      .then(   res => setAwardsDisplayed(res.data[0].active)    )
     .catch(   err => console.log(err)                          );

    // make sure we're not in construction mode
     getData([ 'misc', [['description', 'construction']] ] )
     .then(   res => setConstruction(res.data[0].active)   )
    .catch(   err => console.log(err)                      );

    

  }, [])
 
 


  


  //triggers page changes and accompanying animation.
  function pageChange (page) {

                        setAnimation('vanishing');
    setTimeout(() => {  setCurrentPage(page);
                        setAnimation('appearing')
                     }, 400);
  }

                  
  // helper function to get to the contact page.
  const toContact = () => pageChange(lastIndex-1);
  

  // create an array of Samples components, one for each category.
  const samples   = data.map((category, index) => <Samples 
                                                          categoryData={category}
                                                          sampleData={category.stories}
                                                          animation={animation}
                                                        />
                                  )

  // create an array of all pages, including the samples.
  // Qualifications is only displayed if awardsDisplayed is true.
  // Pass in string of category topics to Bio to be parsed into copy.
  const pages     = [].concat(  [                    <Title          animation={animation}                                           />, 
                                                     <Bio            animation={animation} toContact={toContact} topics={topicString} />  ],
                                                      samples,
                                [                    <Contact        animation={animation} newStatus={newStatus} />, 
                                                     <Subscribe      animation={animation} newStatus={newStatus} />  ]
                             )

  // hast to be declared after pages
  const lastIndex = pages.length-1;

    // if awardsDisplayed, insert Qualifications before 'Contact'
    awardsDisplayed && pages.splice(pages.length-2, 0, <Qualifications animation={animation} data={credentialData} />);
 


  return (
  
  
    <div className='  w-screen h-screen
                      flex flex-col
                    '
    >

      {
          !construction ? <>
                            <div className='w-screen h-[90%] '>
                              { pages[currentPage] }
                            </div>

                            <Navigator
                              currentPage={currentPage}
                              pageChange={pageChange}
                              sampleNames={data.map(category => category.category_name)}
                              awardsDisplayed={awardsDisplayed}
                            />
                          </>
                        
                        : <Construction />
      }

    </div>
  
  );
}