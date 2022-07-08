import {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";

const particlesOptions = {
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: false,
                mode: "push",
            },
            onHover: {
                enable: true,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            push: {
                quantity: 10,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
        },
    },
    particles: {
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
            enable: true,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: {
                default: "bounce",
            },
            random: false,
            speed: 3,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 30,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: {min: 1, max: 5},
        },
    },
    detectRetina: true,

}

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signIn',
    isSignedIn: false,
    user: {
        id: '',
        email: '',
        name: '',
        entries: 0,
        joined: '',
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);

        return {
            leftCol: (clarifaiFace.left_col * width),
            topRow: (clarifaiFace.top_row * height),
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        // console.log(box);
        this.setState({box: box});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});

        fetch(`${process.env.REACT_APP_BACKEND_URL}imageurl`, {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response) {
                    fetch(`${process.env.REACT_APP_BACKEND_URL}image`, {
                        method: 'put',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this
                                .setState(Object
                                    .assign(this.state.user, {entries: count}
                                    )
                                )
                        })
                        .catch(console.log);
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err))
    }

    onRouteChange = (route) => {
        if (route === 'signOut') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                email: data.email,
                name: data.name,
                entries: data.entries,
                joined: data.joined,
            }
        });
    }

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state;

        const particlesInit = async (main) => {
            // console.log(main);
            await loadFull(main);
        };

        const particlesLoaded = (container) => {
            // console.log(container);
        };

        return (
            <div className="App">
                <Particles
                    className='particles'
                    id="tsparticles"
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={particlesOptions}
                />
                <Navigation
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                {route === 'home'
                    ? <div>
                        <Logo/>

                        <Rank
                            name={this.state.user.name}
                            entries={this.state.user.entries}
                        />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            imageUrl={imageUrl}
                            box={box}
                        />
                    </div>
                    : (
                        route === 'signIn'
                            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )

                }
            </div>
        );
    }

}

export default App;
