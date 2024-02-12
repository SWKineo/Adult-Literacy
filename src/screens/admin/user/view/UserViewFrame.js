import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import ListContainer from '../../../../components/ListContainer/ListContainer';

class UserViewFrame extends Component {

  constructor(props) {
    super(props)


    this.state = {
      items: [
      ],
      actions: [
        {
          title: "View",
          redirect: "/admin/progress"
        },
        {
          title: "Edit",
          redirect: "/admin/user/update"
        }
      ],
      rightItem: {
        title: "Create User",
        redirect: "/admin/user/create"
      }
    }
  }

  componentWillMount(){

    fetch("http://rr.acg.maine.edu:1337/user/all",{
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        items: data.data.map((item) => {
          return(
            {
              value: `Name: ${item.first_name} ${item.last_name} Username: ${item.user_code}   Passcode: ${item.pass_code}`,
              id: item.id
            }
          )
        })
      })
    })
  }

  render() {
    return (
      <div>
        <Banner/>
        <Header title="View Users" rightItem={this.state.rightItem} history={this.props.history}/>
        <ListContainer items={this.state.items} actions={this.state.actions} history={this.props.history}/>
      </div>
    )
  }
}

export default UserViewFrame;
