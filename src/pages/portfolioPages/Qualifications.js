





import { useEffect } from 'react';



export default function Qualifications ({data, animation}) {

    const degrees = data.filter(credential => credential.category === 'degree');
    const awards  = data.filter(credential => credential.category === 'award');

    useEffect(() => {
        
        function summonCredentials () {             console.log('summoning');

            const longest = awards.length > degrees.length ? awards.length : degrees.length;

            for (let i = 0; i < longest; i++) {

                const credentials = document.getElementsByClassName('qualification_'+i); console.log(credentials)

                const fadeIn      = () => [...credentials].forEach( credential => credential.classList.replace('opacity-0', 'opacity-1') );

                setTimeout(fadeIn, i*150);
            }
        }

        setTimeout(summonCredentials, 400);

    }, [awards.length, degrees.length])

    function credentialTable (category, credentials) {

        console.log(degrees, awards);


        function credential (credential, index) {  

            return (
                <div key={credential.award_id}
                     className={`   w-full h-10
                                    my-3 px-2
                                    flex justify-between
                                    items-start
                                    transition-opacity duration-300 opacity-0
                                    ${'qualification_'+index}
                               `}
                >
                    <div className='flex flex-col'>
                        <p className='font-bold'>{credential.award}</p>
                        <p                      >{credential.institution}</p>
                    </div>
                        <p>{credential.date.slice(0,10)}</p>
                </div>
            )
        }

        return (
            <div className={`   w-full h-fit
                                flex flex-col
                                pt-[20%]
                                ${ animation === 'vanishing' && 'animate-slideOutRight' }
                           `}
            >
                <div className={`   w-full h-16
                                    flex items-center
                                    bg-black
                                    animate-slideInLeft
                               `}
                >
                    <p className='font-serif text-xl text-white 
                                  pl-4
                                 '                    
                    >{category}</p>
                </div>
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
