import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import ListContainer from '../../../../components/ListContainer/ListContainer';
import date from 'date-and-time';

class UserViewFrame extends Component {

  constructor(props) {
    super(props)


    this.state = {
      items: [
      ],
      actions: [
        {
          title: "View",
          redirect: "/admin/attempt"
        }
      ],
      leftItem: {
        title: "◀ Back",
        redirect: "/admin/user"
      }
    }
  }

  componentWillMount(){
    fetch(`http://rr.acg.maine.edu:1337/attempt/${this.props.match.params.id}`,{
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        items: data.data.map((item) => {
          return(
            {
              value: `Word: ${item.primary_word} Status: ${item.progress === "none" ? "incomplete" : item.progress} Start Date: ${date.parse(item.start_date, 'YYYY-MM-DDTHH:mm:ss.000Z')}`,
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
        <Header title="Users Progress" leftItem={this.state.leftItem} history={this.props.history}/>
        <ListContainer items={this.state.items} actions={this.state.actions} history={this.props.history}/>
      </div>
    )
  }
}

export default UserViewFrame;
