import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import EntryContainer from '../../../../components/EntryContainer/EntryContainer';

class UserViewFrame extends Component {

  constructor(props) {
    super(props)

    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      items: [
        {
          type: "text",
          placeholder: "First Name",
          handler: this.updateFirstName
        },
        {
          type: "text",
          placeholder: "Last Name",
          handler: this.updateLastName
        },
        {
          type: "text",
          placeholder: "Usercode(Letters)",
          handler: this.updateUsername,
          maxlength: "4"
        },
        {
          type: "text",
          placeholder: "Password(Numbers)",
          handler: this.updatePassword,
          maxlength: "4"
        },
        {
          type: "submit",
          value: "Create",
          handler: this.handleSubmit
        },
      ],
      rightItem: {
        title: "Create Admin",
        redirect: "/admin/admin/create"
      }
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

  handleSubmit(e) {
    var form = new FormData();
    form.append('first_name', this.state.firstName);
    form.append('last_name', this.state.lastName);
    form.append('user_code', this.state.username);
    form.append('pass_code', this.state.password);

    fetch("http://rr.acg.maine.edu:1337/user/create",{
      method: "POST",
      body: form
    }).then(results => {
      return results.json();
    }).then(data => {
      this.props.history.push("/admin/user");
    })

  }

  render() {
    return (
      <div>
        <Banner />
        <Header title="Create User" history={this.props.history} rightItem={this.state.rightItem}/>
        <EntryContainer items={this.state.items} />
      </div>
    )
  }
}

export default UserViewFrame;
