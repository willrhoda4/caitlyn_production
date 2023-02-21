




export default function Input ({name, state, setter, error, type, options, wrapStyle}) {

    const inputClass = error ? 'w-full p-1 rounded-md border border-pink-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50' 
                             : 'w-full p-1 rounded-md border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50';

    const field      = type === 'text'       ?  <input  
                                                    name={name}
                                                    className={inputClass}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    required 
                                                 />

                     : type === 'textArea'   ?  <textarea       
                                                    type='textArea'
                                                    rows='8'
                                                    name={name}
                                                    className={inputClass}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    required 
                                                />
                    
                     : type === 'date'       ?  <input  
                                                    type={'date'}
                                                    name={name}
                                                    className={inputClass}
                                                    value={state}
                                                    onChange={(e) => setter(e.target.value)}
                                                    required 
                                                />

                     : type === 'select'     ?  <select    
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

                     : type === 'toggle'    ?   <div className='flex items-center m-2'> 
                                                    <p className='text-l'>{options[0]}</p>
                                                    <div className={`
                                                                        h-4 w-8
                                                                        m-2
                                                                        bg-gray-300
                                                                        rounded-2xl
                                                                   `}
                                                    >
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
                                                    <p className='text-l'>{options[1]}</p>
                                                    <input      type='checkbox' 
                                                           className={`
                                                                            absolute
                                                                            opacity-0
                                                                            cursor-pointer
                                                                            h-0 w-0
                                                                            display-none
                                                                     `}
                                                                name={name}
                                                               value={state}
                                                            onChange={ e => setter(e => !e)}
                                                    />
                                                </div>
                     : null;



                   
                    
   
    return (
        <div className={wrapStyle}>
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
