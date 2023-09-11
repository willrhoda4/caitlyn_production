




// simple button component.
// basically a home for the tailwind classes.
export default function Button ({name, onClick, id}) {

    return <button 
            id={id}
            type='button'
            onClick={onClick}
            className='
                          rounded-lg 
                          border border-gray-300 
                          bg-white 
                          px-5 py-2.5 m-2
                          text-center text-sm font-medium text-gray-700 
                          shadow-sm shadow-inner
                          transition-all 
                            hover:bg-gray-100 
                            focus:ring focus:ring-gray-100 
                            disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400
                      '
            >{name}</button>
}