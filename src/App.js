import React, { Component } from 'react';

import './App.css';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Rank from './Components/Rank/Rank.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';

const ParticlesOptions = {
    particles: {
      number: {
        value: 200,
        density: {
          enable : true,
          value_area: 800
        }
      }
    }
}

const app = new Clarifai.App({
 apiKey: '663f402a5ed949cb89f701dbf26a0a73'
});

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: 'Faiza',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  /*componentDidMount(){
    fetch('http://localhost:3001')
    .then(response => response.json())
    .then(console.log);
  }*/

  calulateFaceLocation = (data) => {
    const claraifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImg');
    const width = image.width;
    const height = Number(image.height);
    return {
      leftCol: claraifaiFace.left_col * width,
      topRow: claraifaiFace.top_row * height,
      rightCol: width - (claraifaiFace.right_col * width),
      bottomRow: height - (claraifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box : box});
  }

  onInputChange = (event) => {
      this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageURL: this.state.input})
      app.models.predict(Clarifai.FACE_DETECT_MODEL,
        this.state.input).then(
      (response) => this.displayFaceBox( this.calulateFaceLocation(response))
      .catch(err => console.log('my err')) );
  }

  onRouteChange = (route) => {
    if(route === 'signout')
    {
      this.setState({isSignedIn: false});
    } else if (route === 'home'){
      this.setState ({isSignedIn: true});
    }

    this.setState({route: route});
 }

	render() {
    const { isSignedIn, route, box, imageURL} = this.state;
		return (
    		<div className="App">

          <Particles  className = "particles"
                params={ParticlesOptions}
                style={ {
                  width: '100%',
                  }} />

          <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/> 

            {
              route === 'home' 
              ? <div> 
                  <Logo />
                  <Rank />
                  <ImageLinkForm 
                      onInputChange = {this.onInputChange} 
                      onButtonSubmit = {this.onButtonSubmit}/>
                  <FaceRecognition 
                      box = {box} 
                      imageURL = {imageURL}/>
               </div>
              : (
                  route === 'register'
                    ? <Register onRouteChange = {this.onRouteChange}/>
                    : <SignIn onRouteChange = {this.onRouteChange}/>
                )
            }
    </div>
    );
  }
}

export default App;
