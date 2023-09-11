





import {  useState, 
          useEffect, 
          useMemo, 
          useCallback } from 'react';

import    Axios         from 'axios';

import    AwardTable    from '../../components/AwardTable.js';

import    Input         from '../../components/Input.js';
import    Button        from '../../components/Button.js';





// Future page to display awards and degrees.
// It can be toggled on and off in the admin panel,
export default function Awards () {



    
    const [ award,                setAward                ] = useState('');
    const [ date,                 setDate                 ] = useState('');
    const [ category,             setCategory             ] = useState('');
    const [ institution,          setInstitution          ] = useState('');
    
    const [ awardError,           setAwardError           ] = useState(false);
    const [ dateError,            setDateError            ] = useState(false);
    const [ categoryError,        setCategoryError        ] = useState(false);
    const [ institutionError,     setInstitutionError     ] = useState(false);
    
    const [ awards,               setAwards               ] = useState([]);
    const [ degrees,              setDegrees              ] = useState([]);

    const [ awardsDisplayed,      setAwardsDisplayed      ] = useState(false);
    


    // memoized array that we call on to render data
    // and refresh our database, as needed.
    const   awardGear =      useMemo(() => {
        return  [
                  [ 'award',    awards,     setAwards   ],
                  [ 'degree',   degrees,    setDegrees  ]
                ];
    }, [awards, degrees])

    

    // error-handling effects for form inputs.
    useEffect(() =>   { setAwardError(award.length === 0);              }, [award]        );

    useEffect(() =>   { setInstitutionError(institution.length === 0);  }, [institution]  );

    useEffect(() =>   { date       &&  setDateError(false);             }, [date]         );
    
    useEffect(() =>   { category   &&  setCategoryError(false);         }, [category]     );


    // updates the database whenver awardsDisplayed changes.
    const getDisplayStatus = useCallback(() => {

      Axios.put(`${process.env.REACT_APP_API_BASE_URL}updateData`, [    'misc',
                                                                       [ 'active' ],
                                                                       [ awardsDisplayed ],
                                                                       [[ 'description', 'awards_displayed' ]]
                                                                    ] )
            .then(  res => console.log(res) )
            .catch( err => console.log(err) );

    }, [awardsDisplayed])


  // loads data from the database.
  // uses filter to sort data into the appropriate
  // category, then sets state via awardGear.
  const loadData = useCallback(() => {

    Axios.post('http://localhost:3000/getData',  [ 'awards', null, { orderBy: 'rank' } ]                                      )
         .then(  res => awardGear.forEach( (type, index) => type[2](res.data.filter(award => award.category === type[0] ) ) ) )
        .catch(  err => console.log(err)                                                                                      );

  }, [awardGear])
  


  // loads data on page load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); getDisplayStatus() }, [])
  
  // updates the database when awardsDisplayed changes.
  useEffect(() => {             getDisplayStatus() }, [awardsDisplayed, getDisplayStatus])


  // adds a new qualification to the database.
  function saveAward () {

    // counts how many awards are in the category,
    // then adds one to that number to get the new rank.
    const newRank = awardGear[awardGear.findIndex( (type, index) => type[0] === category)][1].length+1;

    // adds the new award to the database,
    // then reloads the data.
    Axios.post('http://localhost:3000/addData', [    'awards', 
                                                   [  'award', 'institution', 'date', 'category', 'rank'    ], 
                                                   [[  award,   institution,   date,   category,   newRank  ]]
                                                ])
         .then(  res => loadData()       )
         .catch( err => console.log(err) )

  }





  return (
      <>
        <div className='p-4'>
          <Input
            type='toggle' 
            name='awardsDisplayed' 
            state={awardsDisplayed}
            setter={setAwardsDisplayed}
            error={awardError}
            options={['offline', 'online']}
            confirm={'are you sure?'}
          />   
        </div>

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
