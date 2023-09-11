




import ButtonBank       from '../components/ButtonBank.js';

import { useState, 
         useEffect,
         useRef    }    from 'react';


import iconLeft         from '../images/icon_arrowLeft.svg';
import iconRight        from '../images/icon_arrowRight.svg';
import iconMenu         from '../images/icon_menu.svg';



// Navigator is the navigation bar that appears at the bottom of the portfolio.
// it's 10vh tall and wall-to-wall width, but it basically comprises a simple menu.
export default function Navigator ({currentPage, pageChange, sampleNames, awardsDisplayed}) {

  
    const [ animation,      setAnimation      ] = useState(false);
    const [ nubDisplayed,   setNubDisplayed   ] = useState(false);
    const [ menuDisplayed,  setMenuDisplayed  ] = useState(false);
    const [ linksDisplayed, setLinksDisplayed ] = useState(false);
    
    const   menuRef                             = useRef(null);

    let     pageCount                           = sampleNames.length + 4;




    //clickhandlers for navigation
    function clickLeft  () { currentPage !== 0              && pageChange(currentPage-1)  };
    function clickRight () { currentPage !== pageCount      && pageChange(currentPage+1)  };
    function clickMenu  () { !menuDisplayed                  ? setAnimation('open') 
                                                             : setAnimation('close');     };
    


    // orchestrates cascading animation for nav
    useEffect(() => {

            if (animation === 'open' ) {                       setNubDisplayed(true); 
                                            setTimeout(() => { setMenuDisplayed(true);   }, 150) 
                                            setTimeout(() => { setLinksDisplayed(true);  }, 550)
                                        }
        else if (animation === 'close') {                      setLinksDisplayed(false);
                                            setTimeout(() => { setMenuDisplayed(false);  }, 400)
                                            setTimeout(() => { setNubDisplayed(false);   }, 550) 
                                        }
        else                            {                    return;                           
                                        }
        
    }, [animation])

    const menuAnimation =  animation === 'close' ?  'animate-menuClose' : 'animate-menuOpen';
    const nubAnimation  =  animation === 'close' ?  'animate-nubClose'  : 'animate-nubOpen ';
    
    
    







    //closes nav in event of outside mouseclick
    function handleClickOutside (event) {
            
        if ( menuDisplayed && !menuRef.current.contains(event.target) ) {  setAnimation('close'); }
    }; 
    useEffect(() => {

        document.addEventListener("mousedown", handleClickOutside);

        return () => { document.removeEventListener("mousedown", handleClickOutside); }
    });




//generates list of links for menu
    function menuLinks () {

        function menuLink (name, index) {

            function clickHandler () {

                if (currentPage !== index) { pageChange(index); setAnimation('close'); } 
            }

            return (  
                
                    <p          key={index}
                            onClick={clickHandler}
                          className={  `${ linksDisplayed ? 'opacity-1' : 'opacity-0'} 
                                        mb-3 transition-all duration-300
                                        ${currentPage === index   ?   'text-black'

                                                                : `
                                                                    inline-block relative 
                                                                    w-fit
                                                                    cursor-pointer
                                                                    text-gray-500
                                                                    

                                                                    after:absolute
                                                                    after:w-full after:h-[2px]
                                                                    after:scale-x-0
                                                                    after:bottom-0 after:left-0
                                                                    after:bg-gray-500
                                                                    after:origin-bottom-left
                                                                    after:transition-all after:duration-300

                                                                    hover:after:scale-x-100
                                                                    hover:after:origin-bottom-left
                                                                  `
                                        }`
                                    }
                      >{name}</p>
                            )
        }

        // list of links created dynamically depending on sampleNames array.
        const pages = [].concat(    [ 'Front Page',
                                      'Bio'           ],
                                       sampleNames,
                                     [ 'Contact' ,     
                                       'Subscribe'    ]  
                               )

        // if awardsDisplayed, insert 'Awards' before 'Contact'
        // if it isn't, then we've got one less page to count.
        awardsDisplayed     ?   pages.splice(pages.length-2, 0, 'Awards')
                            :   pageCount--;

        return pages.map((page, index) => menuLink(page, index));
    }


   

 

    return (
  
  
    
      
      <div className='w-screen h-[10%]  
                      flex items-center justify-end
                      pr-12
                      ' 
      >

        <div className='relative'>


            <div      ref={menuRef}
                className={`
                            w-[120%] h-fit
                            pl-6 py-8
                            absolute bottom-[130%] left-[-10%]
                            bg-white shadow-inner 
                            rounded border border-gray-300 
                            ${ menuDisplayed ? menuAnimation : 'hidden' } origin-bottom
                            flex flex-col
                           `}
            >
               {  menuLinks() }
            </div>
            


            <div className={`
                            w-[20%] h-[30%]
                            ${ nubDisplayed ? nubAnimation : 'hidden' } 
                            border-x border-t border-gray-300
                            absolute bottom-full right-[40%] 
                            `}
            />
            
            
            <ButtonBank
                    names={      [ 'back',            'menu',       'forward'                       ]  }
                    icons={      [  iconLeft,          iconMenu,     iconRight                      ]  }
                    onClicks={   [  clickLeft,         clickMenu,    clickRight                     ]  }
                    conditions={ [  currentPage !== 0, null,         currentPage!== pageCount       ]  }
            />

        </div>
      </div>

  
  );
}