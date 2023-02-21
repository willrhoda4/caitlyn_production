






import Button from "../../components/Button.js";




export default function Bio ({toContact, animation}) {

    let bio = `I’m an award-winning journalist based out of Winnipeg, Canada, where I’ve been writing for CBC Manitoba since 2019. Thinking of trusting me with your story? Keep clicking to see examples of my work, some of my qualifications and a list of ways to get in touch. Subjects I’m especially interested in include climate, public health and the economy. `

    return (
    
        <div className={`h-full w-full
                         flex flex-col justify-center items-center
                        `}
        >
            <div className={`min-h-1/2
                             mx-10 my-10 
                             flex
                             ${ animation === 'vanishing' ? 'animate-slideOutUp' : 'animate-slideInDown'}
                            `}
            >
                    <p className='first-letter:text-8xl
                                  first-letter:leading-3
                                  first-line:uppercase
                                  font-serif text-lg text-justify
                                  pl-4 pt-8
                                  border-l-[30px] border-black
                                 '>{bio}
                    </p>
            </div>


            <div className={`flex flex-col
                             transition-opacity duration-500
                             ${ animation === 'vanishing' ? 'opacity-0' : 'opacity-1'}
                            `} 
            >

                <a target="_blank" 
                    rel="noreferrer" 
                    href='https://www.cbc.ca/news/canada/manitoba/author/caitlyn-gowriluk-1.4845371'
                    className='mb-5'

                >
                    <Button 
                        name='read my latest at cbc.ca'
                    />
                </a> 
                            
                <Button 
                    name='skip to the contact page' 
                    onClick={toContact} 
                />

            </div>

        </div>
    )
}