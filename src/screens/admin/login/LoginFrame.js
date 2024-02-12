import React, { Component } from "react";
import Header from '../../../components/Header/Header';
import EntryContainer from '../../../components/EntryContainer/EntryContainer';
import { StatusCircle, IconButton } from '../../../components/UserComponents'
import logo from './logo.svg';
import emailIcon from './email.svg';
import "./LoginFrame.css";

class AdminLoginFrame extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.signIn = this.signIn.bind(this);
    this.redirectEmail = this.redirectEmail.bind(this);

    this.state = {
      email: "",
      password: "",
      items: [
        {
          type: "email",
          placeholder: "Email",
          handler: this.updateEmail
        },
        {
          type: "password",
          placeholder: "Password",
          handler: this.updatePassword
        },
        {
          type: "submit",
          value: "Sign In",
          handler: this.signIn
        }
      ]
    }
  }

  updateEmail(e){
    this.setState ({
      email: e.target.value
    })
    console.log("hello");
  }

  updatePassword(e) {
    this.setState ({
      password: e.target.value
    })
    console.log("hello");
  }

  handleLogin(e){
    console.log("hello");
  }

  signIn(e) {
    console.log(sessionStorage.getItem('token'))
    var form = new FormData();
    form.append('email', this.state.email);
    form.append('password', this.state.password);

    fetch("http://rr.acg.maine.edu:1337/admin/login",{
      method: "POST",
      body: form
    }).then(results => {
      return results.json();
    }).then(data => {
      if(data.token !== undefined){
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userType', "admin");
        this.props.history.push("admin/user");
      }else{

      }
    })
  }

  redirectEmail() {
    //this.props.history.push(`http://apple.com`)
    window.location = 'mailto:sara.flanagan@maine.edu'
  }

  componentWillMount(){
  }

  render() {
    return (
      <div className="loginContiner">
        <p className="Logo-text">Responsive Reading</p>
        <Logo src={logo} />
        <Header title="Sign In"/>
        <EntryContainer items={this.state.items} />
        <div className="emailButton">
          <IconButton icon={emailIcon} onClick={this.redirectEmail}/>
        </div>
      </div>
    );
  }
}

//   constructor(props) {
//     super(props);
//     this.handleClick = this.handleClick.bind(this);
//   }
//   handleClick(e) {
//     console.log("Click happened");
//     console.log(e.target.value);
//   }
//
//   render() {
//     return <NewButton handleClick={this.handleClick} value="Click Me!"/>
//   }
//
// }

// class NewButton extends Component {
//
//   render() {
//     return (
//       <button value="20" onClick={this.props.handleClick}>{this.props.value}</button>
//     )
//   }
// }

function Logo(props) {
  return (<img className="logo" src={props.src} alt="" />);
}

export default AdminLoginFrame;
