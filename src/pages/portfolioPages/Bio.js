






import Button from "../../components/Button.js";



// portfolio page 2
// displays a simple bio and links to CBC.ca and the contact page.
export default function Bio ({toContact, animation, topics}) {

    // hard-coded bio.
    let bio = `I’m a digital journalist based in Winnipeg, Canada, where I’ve been writing for CBC Manitoba since 2019. Thinking of trusting me with your story? Keep clicking to see samples of my work. Topics I’m interested in include ${topics}.`

    return (
    
        // fullscreen container
        <div className={`h-full w-full
                         flex flex-col justify-center items-center
                        `}
        >
            {/* animation-handling bio wrapper */}
            <div className={`min-h-1/2
                             max-w-[600px]
                             mx-10 my-10 
                             flex
                             ${ animation === 'vanishing' ? 'animate-slideOutUp' : 'animate-slideInDown'}
                            `}
            >
                    {/* bio */}
                    <p className='first-letter:text-8xl
                                  first-letter:leading-3
                                  first-line:uppercase
                                  font-serif text-lg text-justify
                                  pl-4 pt-8
                                  border-l-[30px] border-black
                                 '>{bio}
                    </p>
            </div>

            {/* a flex column for the buttons */}
            <div className={`flex flex-col
                             transition-opacity duration-500
                             ${ animation === 'vanishing' ? 'opacity-0' : 'opacity-1'}
                            `} 
            >

                {/* link to author page on CBC */}
                <a target="_blank" 
                    rel="noreferrer" 
                    href='https://www.cbc.ca/news/canada/manitoba/author/caitlyn-gowriluk-1.4845371'
                    className='mb-5'

                >
                    <Button 
                        name='read my latest at cbc.ca'
                    />
                </a> 
                            
                {/* shortcut to contact page */}
                <Button 
                    name='skip to the contact page' 
                    onClick={toContact} 
                />

            </div>

        </div>
    )
}