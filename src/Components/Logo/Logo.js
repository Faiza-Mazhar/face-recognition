import React from 'react';
import Tilt from 'react-tilt';
import brain from './img.png' ;
//import './Logo.css';

const Logo = () => {
	return (
		<div className = 'ma4 mt0'>
				<div>
					<Tilt className="Tilt br2 shadow-2" 
						options={{ max : 35 }} 
						style={{ height: 100, width: 100 }} >
	 					<div className="Tilt-inner pa2 "> 
	 					<img style = {{ paddingTop: '18px'}}src = {brain} alt = 'Logo'/> 
	 					</div>
					</Tilt>
				</div> 

		</div>
	);
}

export default Logo;