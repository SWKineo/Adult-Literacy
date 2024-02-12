import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import EntryContainer from '../../../../components/EntryContainer/EntryContainer';

class UserUpdateFrame extends Component {

  constructor(props) {
    super(props)

    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUserData = this.getUserData.bind(this);

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      items: [
        {
          type: "text",
          placeholder: "First Name",
          handler: this.updateFirstName,
        },
        {
          type: "text",
          placeholder: "Last Name",
          handler: this.updateLastName
        },
        {
          type: "text",
          placeholder: "Usercode (Letters)",
          handler: this.updateUsername,
          maxlength: "4"
        },
        {
          type: "text",
          placeholder: "Password (Numbers)",
          handler: this.updatePassword,
          maxlength: "4"
        },
        {
          type: "submit",
          value: "Update",
          handler: this.handleSubmit
        },
      ]
    }
  }

  updateFirstName(e) {
    this.setState({
      firstName: e.target.value
    })
  }

  updateLastName(e) {
    this.setState({
      lastName: e.target.value
    })
  }

  updateUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  updatePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  componentWillMount(){
    this.getUserData()
  }

  handleSubmit(e) {
    var form = new FormData();
    form.append('first_name', (this.state.firstName === "" ? this.state.defaultFirstName : this.state.firstName));
    form.append('last_name', (this.state.lastName === "" ? this.state.defaultLastName : this.state.lastName));
    form.append('user_code', (this.state.username === "" ? this.state.defaultUsername : this.state.username));
    form.append('pass_code', (this.state.password === "" ? this.state.defaultPassword : this.state.password));
    form.append('user_id', this.props.match.params.id)

    fetch("http://rr.acg.maine.edu:1337/user/update",{
      method: "POST",
      body: form
    }).then(results => {
      return results.json();
    }).then(data => {
      this.props.history.push("/admin/user");
    })

  }

  getUserData(){
    fetch(`http://rr.acg.maine.edu:1337/user/${this.props.match.params.id}`,{
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        defaultFirstName: data.data.first_name,
        defaultLastName: data.data.last_name,
        defaultUsername: data.data.user_code,
        defaultPassword: data.data.pass_code,
        items: [
          {
            type: "text",
            handler: this.updateFirstName,
            placeholder: data.data.first_name
          },
          {
            type: "text",
            handler: this.updateLastName,
            placeholder: data.data.last_name
          },
          {
            type: "text",
            handler: this.updateUsername,
            maxlength: "4",
            placeholder: data.data.user_code
          },
          {
            type: "text",
            handler: this.updatePassword,
            maxlength: "4",
            placeholder: data.data.pass_code
          },
          {
            type: "submit",
            value: "Update",
            handler: this.handleSubmit
          },
        ]
      })

    })
  }

  render() {
    return (
      <div>
        <Banner />
        <Header title="Update User" history={this.props.history}/>
        <EntryContainer items={this.state.items} />
      </div>
    )
  }
}

export default UserUpdateFrame;
