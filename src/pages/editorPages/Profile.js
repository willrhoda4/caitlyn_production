




import { useState, useEffect } from 'react';

import Input from '../../components/Input';


export default function Profile () {

    const [ construction, setConstruction ] = useState(false);


    return (
        <div className='p-10'>
            <p>The Profile</p>
            <Input
                type='toggle'
                name='construction mode'
                state={construction}
                setter={setConstruction}
                options={[ 'off', 'on' ]}
            />
        </div>
    )
}