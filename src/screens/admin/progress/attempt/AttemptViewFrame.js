import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import date from 'date-and-time';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import sketch from './sketch.js';
import './AttemptViewFrame.css';


class AttemptViewFrame extends Component {

  constructor(props) {
    super(props)


    //console.log(date.parse('2018-07-31T14:21:37.000Z', 'YYYY-MM-DDTHH:mm:ss.000Z'))

    this.state = {
      wordset: "",
      date: "",
      status: "",
      firstRoundClicks: [

      ],
      secondRoundClicks: [

      ],
      thirdRoundClicks: [

      ],
      leftItem: {
        title: "◀ Back",
        redirect: "/admin/user"
      }
    }
  }

  componentWillMount(){
    this.getAttemptData()

  }

  getAttemptData(){
    fetch(`http://rr.acg.maine.edu:1337/attempt/attempt/${this.props.match.params.id}`, {
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        wordset: data.data.primary_word,
        date: date.parse(data.data.start_date, 'YYYY-MM-DDTHH:mm:ss.000Z'),
        status: data.data.progress
      })
      this.getClicks()
    })


  }

  getClicks(){
    fetch(`http://rr.acg.maine.edu:1337/attempt/click/${this.props.match.params.id}`,{
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({

        firstRoundClicks: data.data.filter((item) => {
          return item.round === 1;
        }),
        secondRoundClicks: data.data.filter((item) => {
          return item.round === 2;
        }),
        thirdRoundClicks: data.data.filter((item) => {
          return item.round === 3;
        })
      })
      this.setState({
        firstRoundClicks: this.state.firstRoundClicks.map((item) => {
          return (
            {
              click: item.selection_type,
              time: date.subtract(date.parse(item.creation_date,'YYYY-MM-DDTHH:mm:ss.000Z'), this.state.date).toSeconds()
            }
          );
        }),
        secondRoundClicks: this.state.secondRoundClicks.map((item) => {
          return (
            {
              click: item.selection_type,
              time: date.subtract(date.parse(item.creation_date,'YYYY-MM-DDTHH:mm:ss.000Z'), this.state.date).toSeconds()
            }
          );
        }),
        thirdRoundClicks: this.state.thirdRoundClicks.map((item) => {
          return (
            {
              click: item.selection_type,
              time: date.subtract(date.parse(item.creation_date,'YYYY-MM-DDTHH:mm:ss.000Z'), this.state.date).toSeconds()
            }
          );
        })
      })
    })
  }

  render() {

    if(this.state.thirdRoundClicks !== undefined){
      var firstData = {
          clicks : this.state.firstRoundClicks
      }

      var secondData = {
          duration: 30,
          clicks : this.state.secondRoundClicks
      }

      var thirdData = {
          duration: 30,
          clicks : this.state.thirdRoundClicks
      }
    }

    return (
      <div>

        <Banner/>
        <Header title="Users Attempt" leftItem={this.state.leftItem} history={this.props.history}/>
        <div className="dataContiner" id="dataContiner">
          <div>
            Word: {this.state.wordset} <br />
            Date: {this.state.date.toString()} <br />
            Status: {this.state.status === "none" ? "incomplete" : this.state.status} <br />
          </div>
          <div>
            <h3>Clicks During First Round:</h3>
            <Graph data={firstData}/>
          </div>
          <div>
            <h3>Clicks During Second Round:</h3>
            <Graph data={secondData}/>
          </div>
          <div>
            <h3>Clicks During Third Round:</h3>
            <Graph data={thirdData} />
          </div>
        </div>
      </div>
    )
  }
}

function Graph(props){
  return(
    <P5Wrapper sketch={sketch} data={props.data}/>
  )
}

export default AttemptViewFrame;
