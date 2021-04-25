import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  boxes: [],
  route: 'signin',
  isProfileOpen: false,
  isSignedIn: false,
  errorMessage: '',
  user: {
    id: '',
    name: '',
    email: '',
    imageNum: 0,
    joined: '',
    age: 0,
    pet: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  toggleModal = () => {
    this.setState(state => ({
      ...state,
      isProfileOpen: !state.isProfileOpen,
    }));
  }

  calculateFaceLocations = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(data)
    if (!data.outputs[0].data.regions) return false;
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
  }

  displayFaceBox = (boxes) => {
    if(!boxes) return this.setState({ errorMessage: 'Zero face detected.' });
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ errorMessage: '' })
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = async () => {
    try {
      // step1: check token and input
      const token = window.localStorage.getItem('token');
      if (!token) {
        this.setState(initialState);
        window.localStorage.removeItem('token');
        return;
      }
      if (!this.state.input) throw new Error('Invalid input.');

      // step2: make an extenral api call.
      const apiRes = await fetch('/imageurl', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          input: this.state.input
        })
      });
      if (apiRes.status === 500) {
        throw new Error(`Unable to connect server.`)
      }
      const apiData = await apiRes.json();
      if (apiData.type === 'error') {
        throw new Error(apiData.message)
      }
      this.displayFaceBox(this.calculateFaceLocations(apiData));

      // step3: intract with database.
      const imageNumRes = await fetch('/image', {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token
        }
      });
      if (imageNumRes.status === 500) {
        throw new Error(`Unable to connect server.`)
      }
      const imageNumData = await imageNumRes.json();
      if (imageNumData.type === 'error') {
        throw new Error(imageNumData.message)
      }
      this.setState({ user: { ...this.state.user, imageNum: imageNumData } });
    } catch (err) {
      console.log(err.message);
      this.setState({ errorMessage: err.message });
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        imageNum: data.imageNum,
        joined: data.joined,
        pet: data.pet,
        age: data.age
      }
    })
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
      window.localStorage.removeItem('token');
    } else if (route === 'home') {
      this.setState({ isSignedIn: true, route: route })
    }
    else this.setState({ route: route });
  }

  async componentDidMount() {
    try {
      const token = window.localStorage.getItem('token');
      if (token) {
        const session = await fetch('/auth', {
          method: 'post',
          headers: {
            'Content-type': 'application/json',
            'Authorization': token
          }
        })
        if (session.status === 500) {
          throw new Error(`Unable to connect server.`)
        }
        const sessionData = await session.json();
        if (sessionData.type === 'error') {
          throw new Error(sessionData.message)
        }
        else if (sessionData && !sessionData.type) {
          const profile = await fetch(`/profile`, {
            method: 'get',
            headers: {
              'Content-type': 'application/json',
              'Authorization': token
            }
          })
          if (profile.status === 500) {
            throw new Error(`Unable to connect server.`)
          }
          const profileData = await profile.json();
          if (profileData.type === 'error') {
            throw new Error(profileData.message)
          }
          else if (profileData && profileData.email) {
            this.loadUser(profileData);
            this.onRouteChange('home');
          }
        }
      }
    } catch (err) {
      console.log(err.message);
      this.setState({ errorMessage: err.message });
    }
  }

  render() {
    const { isSignedIn, input, route, boxes, isProfileOpen, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal} />
        {
          isProfileOpen &&
          <Modal>
            <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser} initialState={initialState} onRouteChange={this.onRouteChange} />
          </Modal>
        }
        {route === 'home'
          ? <div>
            <Rank
              name={this.state.user.name}
              imageNum={this.state.user.imageNum}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />

            <div className='error-message'>{this.state.errorMessage}</div>
            <FaceRecognition boxes={boxes} imageUrl={input} />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;