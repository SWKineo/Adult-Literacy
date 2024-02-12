import React, { Component } from "react"
import { Redirect } from 'react-router'
import LoginBar from "./LoginBar"
import { StatusCircle, IconButton } from '../../../components/UserComponents'
import emailIcon from './email.svg';
import "./LoginFrame.css"
import logo from "./logo.svg"

class LoginFrame extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: "",
      usernameStatus: "empty",
      passwordStatus: "empty",
      activeField: "username",
      redirect: false
    }

    this.handleInput = this.handleInput.bind(this)
    this.checkUsername = this.checkUsername.bind(this)
    this.attemptLogin = this.attemptLogin.bind(this)
    this.redirectEmail = this.redirectEmail.bind(this)
  }

  // componentWillMount(){
  //   if(sessionStorage.getItem('token') !== null){
  //     this.props.history.push("/student");
  //   }
  // }

  componentDidMount() {
    window.addEventListener('keydown', this.handleInput)
  }

  handleInput(e) {
    if (!e.key) return
    let key = e.key.toLowerCase()

    // console.log(`key: ${key}, keyCode: ${keyCode} a.charCode: ${'a'.charCodeAt(0)}`)

    if (key.length > 1 && key !== 'backspace') {
      return
    } else if ((key < 'a' || key > 'z') && (key < '0' || key > '9')) {
      return
    }

    // if ((keyCode < 65 /* keyCode for 'a' */ || keyCode > 90 /* keyCode for 'z' */)
    //       && (keyCode < 48 /* keyCode for '0' */ || keyCode > 57 /* keyCode for '9' */)
    //       && key != 'backspace') {
    //   return
    // }

    if ( e.preventDefault) e.preventDefault()

    switch(key) {
      // Handle backspace
      case 'backspace':
        if (this.state.activeField === "username" && this.state.username.length > 0) {
          // Backspace in the username field
          this.setState({
            username: this.state.username.substr(0, this.state.username.length - 1),
            usernameStatus: "empty"
          })
        } else if (this.state.activeField === "password") {
          if (this.state.password.length > 0) {
            // Backspace in the password field
            this.setState({
              password: this.state.password.substr(0, this.state.password.length - 1),
              passwordStatus: "empty"
            })
          } else {
            // Backspace out of the password field
            this.setState({
              username: this.state.username.substr(0, this.state.username.length - 1),
              usernameStatus: "empty",
              activeField: "username"
            })
          }
        }
        break;
      default:
        // Handle characters
        if (this.state.activeField === "username" && key >= 'a' && key <= 'z') {
          if (this.state.username.length < 3) {
            // Normal typing in the username field
            this.setState({ username: this.state.username + key})
          } else if (this.state.username.length !== 4) {
            // Finishing the username and checking its validity

            // Check username
            this.checkUsername(this.state.username + key)
            this.setState({
              username: this.state.username + key
            })
          }
        } else if (this.state.activeField === "password" && key >= '0' && key <= '9') {
          if (this.state.password.length < 3) {
            this.setState({
              password: this.state.password + key
            })
          } else if (this.state.password.length < 4) {
            // If login hasn't been attempted yet, trying logging in
            if (this.state.passwordStatus !== "correct") {
              this.attemptLogin(this.state.username, this.state.password + key)
            }
          }
        }
    }
  }

  checkUsername(username) {
    // fetch(`/user/exists/${username}`, {
    //   method: "GET"
    // }).then(results => {
    //   return results.json()
    // }).then(({ data, error }) => {

    //   if (error || !data.exists) {
    //     // Username doesn't exist
    //     this.setState({
    //       usernameStatus: "wrong"
    //     })
    //   } else {
    //     // Username exists
    //     this.setState({
    //       usernameStatus: "correct",
    //       activeField: "password"
    //     })
    //   }
    // })

    console.log(username)

    if (username === "abcd") {
      this.setState({
        usernameStatus: "correct",
        activeField: "password"
      })
    } else {
      this.setState({ usernameStatus: "wrong" })
    }
  }

  attemptLogin(username, password) {
    // console.log("ATTEMPTING LOGIN")
    // var form = new FormData();
    // form.append('user_code', username);
    // form.append('password', password);

    // fetch("http://rr.acg.maine.edu:1337/user/login", {
    //   method: "POST",
    //   body: form
    // }).then(results => {
    //   return results.json();
    // }).then(({ error, data } ) => {
    //   if (error) {
    //     this.setState({ passwordStatus: "wrong" })
    //   } else {
    //     sessionStorage.setItem('token', data.token)
    //     sessionStorage.setItem('userType', "user");
    //     sessionStorage.setItem('user_id', data.id)
    //     this.setState({ passwordStatus: "correct" })

    //     // Enable the <Redirect /> to the progress page
    //     setTimeout(() => {
    //       console.log("The status of the login page is " + this.state.redirect)
    //       this.setState({ redirect: true })
    //     }, 800)
    //   }
    // })

    if (username === "abcd" && password === "1234") {
      sessionStorage.setItem('token', "default")
      sessionStorage.setItem('userType', "user");
      sessionStorage.setItem('user_id', username)
      this.setState({
        redirect: true,
        passwordStatus: "correct"
      })
    } else {
      this.setState({
        password: password,
        passwordStatus: "wrong"
      })
    }
  }

  cycleFields() {
    let newMode = ""

    switch (this.state.exampleStatus) {
      case "none":
        newMode = "correct"
        break
      case "correct":
        newMode = "wrong"
        break
      default:
        newMode = "none"
    }

    this.setState({
      exampleStatus: newMode,
      activeField: this.state.activeField === "username" ? "password" : "username"
    })
  }

  redirectEmail() {
    //this.props.history.push(`http://apple.com`)
    window.location = 'mailto:sara.flanagan@maine.edu'
  }


  render() {
    return (
      <div className="Login" tabIndex="0">
        {this.state.redirect ? <Redirect to='/student' /> : null}
        <p className="Logo-text">Responsive Reading</p>
        <Logo />
        <div className="LoginBar-holder">
          <LoginBar
            attemptStatus={this.state.usernameStatus}
            mode="username"
            text={this.state.username}
            active={this.state.activeField === "username"}
            update={(key) => this.handleInput({ key: key })}
	        />
          <div style={{height: "10vh"}} />
          <LoginBar
            attemptStatus={this.state.passwordStatus}
            mode="password"
            text={this.state.password}
            active={this.state.activeField === "password"}
            update={(key) => this.handleInput({ key: key })}
          />
          <div className="emailButton">
            <IconButton icon={emailIcon} onClick={this.redirectEmail}/>
          </div>
          </div>
      </div>
    )
  }
}

function Logo(props) {
  return (
    <img className="Logo" src={logo} alt="" />
  )
}

export default LoginFrame
