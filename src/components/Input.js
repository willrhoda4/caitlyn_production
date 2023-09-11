








// world class multi-functional input component.
// handles most input types, including select, toggle, and date.
// all components are required to have a name and type prop (strings), 
// as well as state, setter and error state. options are required for select and toggle.
// options.length == 2 for toggle, and options.length > 0 for select.
// confirm is an optional prop for toggle, and is a string that will be passed to window.confirm.
// wrapStyle is an optional prop for styling the wrapper div.
export default function Input ({
                                    id,
                                    name, 
                                    type, 
                                    state, 
                                    error, 
                                    setter, 
                                    confirm,
                                    options, 
                                    wrapStyle
                               }) {

    const inputClass =`
                            w-full
                            p-1 
                            rounded-md 
                            border ${ !error ? 'border-gray-300' : 'border-pink-300' }
                            shadow-sm 
                                focus:border-primary-400
                                focus:ring 
                                focus:ring-primary-200 
                                focus:ring-opacity-50
                     `; 

    const field      = type === 'text'       ?  <input
                                                    id={id}  
                                                    name={name}
                                                    className={inputClass}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    required 
                                                 />

                     : type === 'textArea'   ?  <textarea
                                                    id={id}       
                                                    type='textArea'
                                                    rows='8'
                                                    name={name}
                                                    className={inputClass}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    required 
                                                />
                    
                     : type === 'date'       ?  <input
                                                    id={id}  
                                                    type={'date'}
                                                    name={name}
                                                    className={inputClass}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    required 
                                                />

                    // we use a default hidden value of --select an option-- for the first option.
                     : type === 'select'     ?  <select
                                                    id={id}    
                                                    name={name}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option key={0} value='null' defaultValue hidden>--select an option--</option>
                                                    { options.map( (choice, index) =>   <option 
                                                                                            key={index+1} 
                                                                                            value={choice} >{choice}
                                                                                        </option>
                                                                )
                                                    }
                                                </select>

                    // toggle is a bit different, it takes an array of two options                                            
                     : type === 'toggle'    ?   <div className='flex items-center m-2'> 

                                                    {/* //first option (left) */}
                                                    <p className='text-l'>{options[0]}</p>

                                                    {/* wrapper for the switch */}
                                                    <div className={`
                                                                        h-4 w-8
                                                                        m-2
                                                                        bg-gray-300
                                                                        rounded-2xl
                                                                   `}
                                                    >
                                                        {/* the actual ball that bounces back and forth */}
                                                        <div className={`
                                                                            h-4 w-4
                                                                            bg-gray-100
                                                                            shadow-inner
                                                                            rounded-2xl
                                                                            transition-all
                                                                            ${state && 'translate-x-4'}
                                                                       `}
                                                        />
                                                    </div>

                                                    {/* second option (right) */}
                                                    <p className='text-l'>{options[1]}</p>
                                                    
                                                    {/* the actual checkbox that is hidden */}
                                                    {/* if a confirm condition is passed in, check it before changing state. */}
                                                    <input
                                                                  id={id} 
                                                                type='checkbox' 
                                                           className={`
                                                                            absolute
                                                                            opacity-0
                                                                            cursor-pointer
                                                                            h-0 w-0
                                                                            display-none
                                                                     `}
                                                                name={name}
                                                               value={state}
                                                            onChange={ e => { confirm ? window.confirm(confirm) && setter(e => !e)
                                                                                      :                            setter(e => !e)
                                                            
                                                                            }
                                                                     }
                                                    />
                                                </div>
                     : null;



                   
                    
   
    return (
        <div className={`
                            ${wrapStyle ? wrapStyle : 'w-[90%]'}
                       `}
        >
            <label className='
                                p-2
                                w-9/12
                             '>
                <h3 className='font-sans'>{name}</h3>
                {field}
            </label>
        </div>
    )
}
