import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import posed from 'react-pose'
import Sound from 'react-sound'
import { withUserAgent } from 'react-useragent'
import { IconButton } from '../../../components/UserComponents'
import './ProgressFrame.css'
import iconLogout from './icon-logout.svg'
import iconAudio from '../icon-audio.svg'

class Word {
    // constructor(text, id, progress) {
    //     this.id = id
    //     this.primary_word = text
    //     this.first_distractor
    //     this.second_distractor
    //     this.audio_file
    //     this.audio_file_descriptive
    //     // this.progress
    // }
}
Word.prototype.PROGRESS_NONE = "none"
Word.prototype.PROGRESS_ATTEMPTED = "attempted"
Word.prototype.PROGRESS_PASSED = "passed"

class ProgressFrame extends Component {
    constructor(props) {
        super(props)

        let autoPlayPrompt = !/Safari/.exec(props.ua.md.ua)

        this.state = {
            wordList: [],
            playingPrompt: autoPlayPrompt,
            wordsActive: true
        }

        this.logout = this.logout.bind(this)

        setInterval(_ => {
            this.setState({ playingPrompt: true })
        }, 20000)

        this.fetchWordAttempts = 0
        this.fetchProgressAttempts = 0
        this.audioStarted = false

        this.fetchWords = this.fetchWords.bind(this)
        this.fetchProgress = this.fetchProgress.bind(this)
        this.emptyWords = this.emptyWords.bind(this)
    }

    fetchWords() {
        fetch("http://rr.acg.maine.edu:1337/wordset/all", { 
            method: "GET"
        }).then(results => {
            return results.json()
        }).then(data => {
            // If the request failed, try again
            if (data.error) {
                if (this.fetchWordAttempts < 5) {
                    this.fetchWordAttempts++
                    this.fetchWords()
                }
                return
            }

            let words = []
            for (let i = 0; i < data.data.length; i++) {
                let w = data.data[i]
                w.progress = "none"
                words[w.id] = w
            }

            while(words.length < 25) {
                words.push({ primary_word: "test" })
            }
            this.setState({ wordList: words })
        })
    }

    fetchProgress() {
        fetch(`http://rr.acg.maine.edu:1337/attempt/${sessionStorage.getItem('user_id')}`, {
            method: "GET"
        }).then(results => {
            return results.json()
        }).then(data => {
            // If the request failed, try again
            if (data.error) {
                if (this.fetchProgressAttempts < 5) {
                    this.fetchProgressAttempts++
                    this.fetchProgress()
                }
                return
            }

            for (let i = 0; i < data.data.length; i++) {
                let attempt = data.data[i]

                if (this.state.wordList[attempt.word_id] !== undefined) {
                    let currentProgress = this.state.wordList[attempt.word_id].progress
                    // console.log(`componentDidMount: Current progress on ${this.state.wordList[attempt.word_id].primary_word} is ${currentProgress}`)
                    if ((currentProgress === "passed" && attempt.progress !== "none" && attempt.progress !== "attempted")
                        || (currentProgress === "attempted" && attempt.progress !== "none")
                        || currentProgress === "none"
                        || currentProgress === undefined) {

                        // eslint-disable-next-line
                        this.state.wordList[attempt.word_id].progress = attempt.progress
                        this.setState({
                            wordList: this.state.wordList
                        })
                    }
                }

            }
        })
    }

    componentDidMount() {
        console.log("Calling componentDidMount!")
        
        this.fetchWords()
        this.fetchProgress()
    }

    logout() {
        sessionStorage.setItem('token', null)
        this.props.history.push("/")
    }

    emptyWords() {
        this.setState({ wordsActive: false })
    }

    render() {
        return(
            <div className="Progress">
                <Sound
                    url="http://rr.acg.maine.edu/adult_lit/Directions.m4a"
                    playStatus={this.state.playingPrompt ? Sound.status.PLAYING : Sound.status.STOPPED}
                    onFinishedPlaying={() => { this.setState({ playingPrompt: false })}}
                />
                <div className="Progress-words" >
                    {this.state.wordList.map(word => {
                        return(
                            <WordTile active={this.state.wordsActive} emptyWords={this.emptyWords} key={word.id} word={word} />
                        )
                    })}
                </div>
                <div className="Progress-buttons">
                    <div className="button-logout"><IconButton icon={iconLogout} onClick={this.logout} /></div>
                    <div className="button-audio"><IconButton icon={iconAudio} onClick={() => { this.setState({ playingPrompt: true })}} /></div>
                </div>
            </div>
        )
    }
}
ProgressFrame.defaultProps = {
    id: 0
}

const TileButton = posed.button({
    normal: {
        scale: 1,
        transition: { duration: 250 }
    },
    hovered: {
        scale: 1.05,
        transition: { duration: 100 }
    },
    exit: {
        scale: 0.0,
        opacity: 0,
        transition: { duration: 300 }
    },
    loading: {
        scale: 0.0,
        transition: { duration: 100 }
    }
})
class WordTile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            clicked: false,
            redirect: false,
            pose: "loading"
        }

        this.tileClick = this.tileClick.bind(this)
    }
    
    componentDidMount() {
        this.setState({ pose: "normal" })
    }

    tileClick(word) {
        this.setState({ clicked: true })
        
        this.setState({
            pose: "exit"
        })
        // Remove the other word tiles on the page
        setTimeout(_ => this.props.emptyWords(), 100)
        setTimeout(_ => this.setState({ redirect: true }), 500)
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/practice/${this.props.word.id}`} />
        } else {
            return(
                <TileButton 
                    className={`word-tile ${this.props.word.progress}` + (this.props.word.primary_word === "I" ? " letter-I" : "")}
                    onClick={this.tileClick}
                    onMouseEnter={() => this.setState({ pose: "hovered" })}
                    onMouseLeave={() => { if (this.state.pose !== "exit") this.setState({ pose: "normal" })}}
                    pose={this.props.active ? this.state.pose : "exit" }
                >
                    {this.props.word.primary_word}
                </TileButton>
            )
        }
    }
}

export default withUserAgent(ProgressFrame)
export { Word }