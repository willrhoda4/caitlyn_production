





import { useEffect } from 'react';


// portfolio page displaying awards and degrees.
// it's rendered conditionally, depending on whether the admin has activated it.
// if it is activated, it comes before the contact page.
export default function Qualifications ({data, animation}) {


    // separate degrees and awards into two arrays.
    const degrees = data.filter(credential => credential.category === 'degree');
    const awards  = data.filter(credential => credential.category === 'award');


    // onload effect to trigger cascading fade-in animation.
    useEffect(() => {
        
        
        function summonCredentials () {             

            // get the longest array length.
            // so no qualifications get left behind
            const longest = awards.length > degrees.length ? awards.length : degrees.length;
        
            // loop to the longest length
            for (let i = 0; i < longest; i++) {

                // there should be an award and degree with class qualification_i
                const credentials = document.getElementsByClassName('qualification_'+i);

                // and they should fade in at the same time
                const fadeIn      = () => [...credentials].forEach( credential => credential.classList.replace('opacity-0', 'opacity-1') );

                // we stagger the fade-in effect by 150ms per iteration.
                setTimeout(fadeIn, i*150);
            }
        }

        // wait for the page to load, then summon the credentials.
        setTimeout(summonCredentials, 400);

    }, [awards.length, degrees.length])


    // returns a table of credentials.
    // we'll have one for degrees and one for awards.
    function credentialTable (category, credentials) {

        // returns a single credential.
        function credential (credential, index) {  

            return (
                <div key={credential.award_id}
                     className={`   h-fit w-full max-w-[800px]
                                    my-3 px-4
                                    flex justify-between
                                    transition-opacity duration-300 opacity-0
                                    ${'qualification_'+index}
                               `}
                >
                    <div className='flex flex-col'>
                        <p className='font-bold'>{credential.award}</p>
                        <p                      >{credential.institution}</p>
                    </div>
                        <p                      >{credential.date.slice(0,10)}</p>
                </div>
            )
        }

        return (

            // the table is a flex column hugging the right side of the screen.
            <div className={`   h-fit w-full max-w-[1000px]
                                self-end
                                flex flex-col
                                mb-[5vh]
                                ${ animation === 'vanishing' && 'animate-slideOutRight' }
                           `}
            >
                {/* title banner */}
                <div className={`   w-full h-16
                                    flex items-center
                                    bg-black
                                    animate-slideInLeft
                               `}
                >
                    {/* title */}
                    <p className='font-serif text-xl text-white 
                                  pl-4
                                 '                    
                    >{category}</p>
                </div>

                {/* credentials */}
                <div className='flex flex-col w-full h-fit'>
                    { credentials.map((qualification, index) => credential(qualification, index)) }
                </div>

            </div>
        )
    } 

    return (
        <div className={`   w-screen h-5/6 
                            pl-[10%]
                            flex flex-col justify-around
                            pt-[20%]
                       `}
        >
            {   credentialTable(  'Degrees', degrees  )   }
            {   credentialTable(  'Awards',  awards   )   }
        </div>
    )
}                             
