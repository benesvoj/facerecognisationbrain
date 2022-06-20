import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain-100.png';

const Logo = () => {
    return(
        <div className='ma4 mt0' style={{borderRadius: 5}}>
            <Tilt
                className="Tilt br2 shadow-2"
                style={{backgroundColor: 'darkgreen', height: '100px', width: '100px'}}
            >
                <div className='inner-element pa3'>
                    <img src={brain} alt='logo' />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;