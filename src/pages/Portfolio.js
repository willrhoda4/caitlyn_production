




import { useState, 
         useEffect    } from 'react';
  
import Axios            from 'axios'
  
import Title            from '../pages/portfolioPages/Title.js'
import Bio              from '../pages/portfolioPages/Bio.js'
import Samples          from '../pages/portfolioPages/Samples.js'
import Qualifications   from '../pages/portfolioPages/Qualifications.js'
import Contact          from './portfolioPages/Contact.js'
import Subscribe        from './portfolioPages/Subscribe.js';  

import Navigator       from '../components/Navigator.js';





export default function Portfolio ({newStatus}) {

  const [ currentPage,    setCurrentPage    ] = useState(0);
  const [ animation,      setAnimation      ] = useState(false);
  
  const [ data,           setData           ] = useState([]);
  const [ credentialData, setCredentialData ] = useState([]);


  
  
 
  useEffect(() => {

    const getData = (reqBody) => Axios.post('http://localhost:3000/getData', reqBody);

    getData([ 'categories', null, { orderBy: 'rank' } ] )
    .then(  res => {

              const categories = res.data.filter(category => category.active);

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



    getData([ 'awards', null, { orderBy: 'rank' } ] )
      .then(   res => setCredentialData(res.data)   )
     .catch(   err => console.log(err)              );

  }, [])
 
 


  


  //triggers page changes and accompanying animation.
  function pageChange (page) {

                        setAnimation('vanishing');
    setTimeout(() => {  setCurrentPage(page);
                        setAnimation('appearing')
                     }, 400);
  }

                  

  const toContact = () => pageChange(lastIndex-1);
  
  const samples   = data.map((category, index) => <Samples
                                                          categoryData={category}
                                                          sampleData={category.stories}
                                                          animation={animation}
                                                        />
                                  )

  const pages     = [].concat(  [ <Title          animation={animation}                       />, 
                                  <Bio            animation={animation} toContact={toContact} />  ],
                                   samples,
                                [ <Qualifications animation={animation} data={credentialData} />, 
                                  <Contact        animation={animation} newStatus={newStatus} />, 
                                  <Subscribe      animation={animation} newStatus={newStatus} />  ]
                             )

  const lastIndex = pages.length-1;


 


  return (
  
  
    <div className='  w-screen h-screen
                      flex flex-col
                    '
    >

      <div className='w-screen h-[90%] '>
        { pages[currentPage] }
      </div>
      
      <Navigator
        currentPage={currentPage}
        pageChange={pageChange}
        sampleNames={data.map(category => category.category_name)}
      />

    </div>
  
  );
}