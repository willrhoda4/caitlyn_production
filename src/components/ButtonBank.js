






export default function ButtonBank ({names, icons, onClicks, conditions, wrapStyle, currentState}) {
    
   
   
    function button (name, icon, onClick, thisCondition, index) {
    
        const buttonClass = 'rounded-md bg-white px-4 m-0.5 text-center text-sm font-medium hover:bg-gray-100';
        const dummyClass  = 'rounded-md bg-white px-7 m-0.5 text-center text-sm font-medium hover:bg-gray-100';

        const condition   = !conditions || thisCondition == null ? true : thisCondition; 

        return (<div key={index}>
            {   condition   ?  <button type='button' onClick={onClick} className={buttonClass} >
                                        {   icon    ?   <img alt={name+'icon'} 
                                                             src={icon} 
                                                             className={ currentState === name ? 'transition-all brightness-50' 
                                                                                               : 'transition-all'
                                                                        }
                                                        />
                                                    :   <p className={ `    transition-colors 
                                                                            ${ name === currentState ? 'text-black' 
                                                                                                     : 'text-gray-300' 
                                                                             }
                                                                      `}
                                                        >{name}</p>
                                        }
                                    </button>
                            :   <button type='button' className={dummyClass} />
            }
        </div>)
    }




    return (
        <div className={wrapStyle}>
            <div className='    w-fit
                                rounded-lg border border-gray-300 
                                shadow-sm
                                flex items-center
                        '
            >
                {   onClicks.length !== 0 &&
                    onClicks.map((icon, index) => {     const buttonName =                names[index];
                                                        const buttonIcon =   icons      ? icons[index]      : null;  
                                                        const onClick    =                onClicks[index];
                                                        const condition  =   conditions ? conditions[index] : null;

                                                        const parameters = [ buttonName, buttonIcon, onClick, condition ];

                                                        return button(...parameters, index)
                                                  }
                                )
                }
            </div>
        </div>
    )
}