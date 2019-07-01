import React, { Component } from 'react';

import './App.css';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Rank from './Components/Rank/Rank.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js';
import Particles from 'react-particles-js';

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




const initialState = {
  input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
    }
  
  loadUser = (data) => {
    this.setState(
      {
        user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }
    })
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
        fetch('http://localhost:3001/imageurl', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            input: this.state.input
            })
          })
        .then(response => response.json())
        .then(response => {
          if(response){
            fetch('http://localhost:3001/image', {
            method : 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign (this.state.user, {entries: count}))
            })
            .catch(console.log);
      }
      this.displayFaceBox( this.calulateFaceLocation(response))
    })
      .catch(err => console.log(err)) ;
  }

  onRouteChange = (route) => {
    if(route === 'signout')
    {
      this.setState(initialState);
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
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm 
                      onInputChange = {this.onInputChange} 
                      onButtonSubmit = {this.onButtonSubmit}/>
                  <FaceRecognition 
                      box = {box} 
                      imageURL = {imageURL}/>
               </div>
              : (
                  route === 'register'
                    ? <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
                    : <SignIn onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
                )
            }
    </div>
    );
  }
}

export default App;
