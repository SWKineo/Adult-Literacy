import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import EntryContainer from '../../../../components/EntryContainer/EntryContainer';

class WordViewFrame extends Component {

  constructor(props) {
    super(props)

    this.updatePrimaryWord = this.updatePrimaryWord.bind(this);
    this.updateFirstDistractor = this.updateFirstDistractor.bind(this);
    this.updateSecondDistractor = this.updateSecondDistractor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createWord = this.createWord.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleDesFile = this.handleDesFile.bind(this)

    this.state = {
      primaryWord: "",
      firstDistractor: "",
      secondDistractor: "",
      file: "",
      desFile: "",
      items: [
        {
          type: "text",
          placeholder: "Primary Word",
          handler: this.updatePrimaryWord
        },
        {
          type: "file",
          placeholder: "Primary Word File",
          handler: this.handleFile
        },
        {
          type: "file",
          placeholder: "Primary Word File Descriptive",
          handler: this.handleDesFile
        },
        {
          type: "text",
          placeholder: "First Distractor",
          handler: this.updateFirstDistractor
        },
        {
          type: "text",
          placeholder: "Second Distractor",
          handler: this.updateSecondDistractor
        },
        {
          type: "submit",
          value: "Create",
          handler: this.handleSubmit
        },
      ]
    }
  }

  updatePrimaryWord(e) {
    this.setState({
      primaryWord: e.target.value
    })
  }

  updateFirstDistractor(e) {
    this.setState({
      firstDistractor: e.target.value
    })
  }

  updateSecondDistractor(e) {
    this.setState({
      secondDistractor: e.target.value
    })
  }

  handleFile(e){
    this.setState({
      file: e.target.files[0]
    })
  }

  handleDesFile(e){
    this.setState({
      desFile: e.target.files[0]
    })
  }

  handleSubmit(e) {
    this.createWord();
    this.props.history.push("/admin/word");
  }

  createWord(e) {

    var form = new FormData();
    form.append('primary_word', this.state.primaryWord);
    form.append('first_distractor', this.state.firstDistractor);
    form.append('second_distractor', this.state.secondDistractor);
    form.append('audio_file', this.state.file);
    form.append('audio_file_descriptive', this.state.desFile);

    fetch("http://rr.acg.maine.edu:1337/wordset/create",{
      method: "POST",
      body: form
    }).then(results => {
      return results.json();
    }).then(data => {

    })
  }

  render() {
    return (
      <div>
        <Banner />
        <Header title="Create Word" history={this.props.history}/>
        <EntryContainer items={this.state.items} />
      </div>
    )
  }
}

export default WordViewFrame;
