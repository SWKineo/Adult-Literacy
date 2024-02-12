import React, { Component } from 'react';
import Banner from '../../../../components/Banner/Banner';
import Header from '../../../../components/Header/Header';
import EntryContainer from '../../../../components/EntryContainer/EntryContainer';

class WordUpdateFrame extends Component {

  constructor(props) {
    super(props)

    this.updatePrimaryWord = this.updatePrimaryWord.bind(this);
    this.updateFirstDistractor = this.updateFirstDistractor.bind(this);
    this.updateSecondDistractor = this.updateSecondDistractor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getWordData = this.getWordData.bind(this);
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
          value: "Update",
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
    var form = new FormData();
    form.append('primary_word', (this.state.primaryWord === "" ? this.state.defaultPrimaryWord : this.state.primaryWord));
    form.append('first_distractor', (this.state.firstDistractor === "" ? this.state.defaultFirstDistractor : this.state.firstDistractor));
    form.append('second_distractor', (this.state.secondDistractor === "" ? this.state.defaultSecondDistractor : this.state.secondDistractor));
    form.append('word_id', this.props.match.params.id)
    form.append('audio_file', this.state.file);
    form.append('audio_file_descriptive', this.state.desFile);

    fetch("http://rr.acg.maine.edu:1337/wordset/update",{
      method: "POST",
      body: form
    }).then(results => {
      return results.json();
    }).then(data => {
      this.props.history.push("/admin/word");
    })

  }

  componentWillMount() {
    this.getWordData()
  }

  getWordData(){
    fetch(`http://rr.acg.maine.edu:1337/wordset/${this.props.match.params.id}`,{
      method: "GET"
    }).then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        defaultPrimaryWord: data.data.primary_word,
        defaultFirstDistractor: data.data.first_distractor,
        defaultSecondDistractor: data.data.second_distractor,
        items: [
          {
            type: "text",
            placeholder: data.data.primary_word,
            handler: this.updatePrimaryWord
          },
          {
            type: "file",
            placeholder: "Primary Word File",
            handler: this.handleFile,
          },
          {
            type: "file",
            placeholder: "Primary Word File Descriptive",
            handler: this.handleDesFile,
          },
          {
            type: "text",
            placeholder: data.data.first_distractor,
            handler: this.updateFirstDistractor
          },
          {
            type: "text",
            placeholder: data.data.second_distractor,
            handler: this.updateSecondDistractor
          },
          {
            type: "submit",
            value: "Update",
            handler: this.handleSubmit
          }
        ]
      })

    })
  }

  render() {
    return (
      <div>
        <Banner />
        <Header title="Update Word" history={this.props.history}/>
        <EntryContainer items={this.state.items} />
      </div>
    )
  }
}

export default WordUpdateFrame;
