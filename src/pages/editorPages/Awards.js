





import { useState, useEffect, useMemo, useCallback } from 'react';

import Axios from 'axios';

import AwardTable    from '../../components/AwardTable.js';

import Input from '../../components/Input.js';
import Button from '../../components/Button.js';






export default function Awards () {



    
    const [ award,                setAward                ] = useState('');
    const [ date,                 setDate                 ] = useState('');
    const [ category,             setCategory             ] = useState('');
    const [ institution,          setInstitution          ] = useState('');
    
    const [ awardError,           setAwardError           ] = useState(false);
    const [ dateError,            setDateError            ] = useState(false);
    const [ categoryError,        setCategoryError        ] = useState(false);
    const [ institutionError,     setInstitutionError     ] = useState(false);
    
    const [ awards,          setAwards          ] = useState([]);
    const [ degrees,         setDegrees         ] = useState([]);
    
    const   awardGear =      useMemo(() => {
        return  [
                  [ 'award',    awards,     setAwards   ],
                  [ 'degree',   degrees,    setDegrees  ]
                ];
    }, [awards, degrees])

    

    useEffect(() =>   { setAwardError(award.length === 0);              }, [award]);

    useEffect(() =>   { setInstitutionError(institution.length === 0);  }, [institution]);

    useEffect(() =>   { date       &&  setDateError(false);             }, [date]      );
    
    useEffect(() =>   { category   &&  setCategoryError(false);         }, [category]  );



  const loadData = useCallback(() => {

    Axios.post('http://localhost:3000/getData',  [ 'awards', null, { orderBy: 'rank' } ] )
         .then(  res => {   console.log(res.data);
                          for (let i = 0; i < awardGear.length; i++) {
                            awardGear[i][2](res.data.filter(award => award.category === awardGear[i][0]))
                          }
                        }
              )
        .catch(  err => console.log(err) );

  }, [awardGear])
  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData() }, [])

  function saveAward () {

    const newRank = awardGear[awardGear.findIndex( (type, index) => type[0] === category)][1].length+1;

    console.log(newRank)

    Axios.post('http://localhost:3000/addData', [    'awards', 
                                                   [ 'award', 'institution', 'date', 'category', 'rank'    ], 
                                                   [  award,   institution,   date,   category,   newRank  ]
                                                ])
         .then(  res => loadData()       )
         .catch( err => console.log(err) )

  }


  return (
      <>

        <form className=' p-4 
                          flex flex-col items-start
                        '>


          <Input
            type='text' 
            name='Award' 
            state={award}
            setter={setAward}
            error={awardError}
          />


          <Input
            type='text' 
            name='Institution' 
            state={institution}
            setter={setInstitution}
            error={institutionError}
          />


          <Input 
            type='date'
            name='Date' 
            state={date}
            setter={setDate}
            error={dateError}
          />
                   
          
          <Input 
            type='select'
            name='Category' 
            state={category}
            setter={setCategory}
            error={categoryError}
            options={awardGear.map(story => story[0])}
          />

          <Button
            name='Upload Award'
            onClick={saveAward}
          />

        </form>

        <div className='flex flex-col'>
          { awardGear.map((category, index) => <AwardTable 
                                                  category={category[0]}
                                                  index={index}
                                                  awardData={category[1]}
                                                  loadData={loadData}
                                                />
                         )
          }
        </div>        
      </>
    );
  }
