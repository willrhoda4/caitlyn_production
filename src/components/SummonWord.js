





import { useState, useEffect } from 'react';



// handles the animation for the Front Page.
export default function SummonWord ({word, delay, interval}) {



    const [ letters,    setLetters ] = useState([]);

    // start with a word, break it into letters, and assign each letter a unique id.
    const   characters               = word.split('');  
    const   ids                      = characters.map( (letter, index) => { return word+'Letter_'+index } );


    //turn your characters into h1 letter elements and stores them in state
    useEffect(() => {

        const elements  = characters.map( (letter, index) => { return   <h1        id={ ids[index]  }
                                                                                  key={ ids[index]  }
                                                                            className='text-6xl md:text-7xl lg:text-8xl
                                                                                       font-serif
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

        // triggers the animation sequence
        function triggerWord () {

            // randomizes the order in which the letters appear
            const randomIds = ids.sort(() => Math.random() - 0.5);


            // iterates through the letters in your random order.
            for (let i = 0; i < randomIds.length; i++) {
                
                let letter = document.getElementById(randomIds[i]);
                
                // if the letter exists, make it visible
                if (letter) {
                    
                    // for each letter, set a timeout to make it visible
                    // the timeout is based on the interval prop, which is the time between each letter's appearance
                    // if no interval prop is provided, the default is 250ms
                    let pause  = interval ? interval*i : 250*i;
                    setTimeout(() => letter.classList.replace('opacity-0', 'opacity-1'), pause);
                    
                }
            }
        }

        // if no delay prop is provided, trigger the animation sequence immediately
        letters && !delay ? triggerWord() : setTimeout(triggerWord, delay);
        
    }, [delay, ids, interval, letters])


    return  <> 
                <div className='flex w-fit'>{letters}</div>
            </>
}