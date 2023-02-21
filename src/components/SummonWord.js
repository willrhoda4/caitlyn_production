





import { useState, useEffect } from 'react';




export default function SummonWord ({word, delay, interval}) {

    const [ letters,    setLetters ] = useState([]);
    const   characters               = word.split('');  
    const   ids                      = characters.map( (letter, index) => { return word+'Letter_'+index } );


    //breaks word into h1 letter elements and stores them in state
    useEffect(() => {

        const elements  = characters.map( (letter, index) => { return   <h1        id={ ids[index]  }
                                                                                  key={ ids[index]  }
                                                                            className='text-6xl font-serif
                                                                                       transition-opacity opacity-0
                                                                                       duration-500
                                                                                      '
                                                                        >{characters[index]}</h1>
                                                             } 
                                        );
      
        setLetters(elements);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    //Initiates animation sequence once state is ready
    useEffect(() => {

        function triggerWord () {

            const randomIds = ids.sort(() => Math.random() - 0.5);


            for (let i = 0; i < randomIds.length; i++) {

                let letter = document.getElementById(randomIds[i]);
                let pause  = interval ? interval*i : 250*i;

                setTimeout(() => letter.classList.replace('opacity-0', 'opacity-1'), pause)
            }
        }

        letters && !delay ? triggerWord() : setTimeout(triggerWord, delay);
        
    }, [delay, ids, interval, letters])


    return  <> 
                <div className='flex w-fit'>{letters}</div>
            </>
}