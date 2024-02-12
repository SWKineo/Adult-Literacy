import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import ListContainer from '../../../../components/ListContainer/ListContainer';

class WordViewFrame extends Component {

  constructor(props) {
    super(props)

    this.state = {
      items: [

      ],
      actions: [
        {
          title: "Edit",
          redirect: "/admin/word/update"
        }
      ],
      rightItem: {
        title: "Create Word",
        redirect: "/admin/word/create"
      }
    }
  }

  componentWillMount(){
    fetch("http://rr.acg.maine.edu:1337/wordset/all",{
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        items: data.data.map((item) => {
          return(
            {
              //NEEDS WORK
              value: `Primary: ${item.primary_word} First Distractor: ${item.first_distractor} Second Distractor: ${item.second_distractor}`,
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
        <Header title="View Words" rightItem={this.state.rightItem} history={this.props.history}/>
        <ListContainer items={this.state.items} actions={this.state.actions} history={this.props.history}/>
      </div>
    )
  }
}

export default WordViewFrame;
