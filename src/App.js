import React, {Component} from 'react'
import _ from "lodash"
import './App.css'
import {firestore} from "./firebase"
import Header from './Header'

class App extends Component {

    constructor(props) {
        super(props)
        this.getAllRecords = this.getAllRecords.bind(this)
        this.getLastCheck = this.getLastCheck.bind(this)
        this.getAllErrors = this.getAllErrors.bind(this)
    }

    state = {
        allrecords: [],
        allerrors: [],
        lastCheck: {}
    }

    componentWillMount() {
        console.log(this.props.allrecords)
        if (!this.state.allrecords.size > 0) {
            this.getAllRecords()
            this.getLastCheck()
            this.getAllErrors()
        }
    }

    getAllRecords() {
        let allRecords = [];
        // firestore.collection('syngentcheck').orderBy('timestamp', 'desc').get().then((snapshot) => {
        firestore.collection('syngentcheck').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    console.log('New Record AllRecords: ', change.doc.data());
                    allRecords = this.state.allrecords
                    allRecords.push(change.doc.data())
                    console.log(allRecords)
                    this.setState({allrecords:  _.orderBy(allRecords,['timestamp'],['desc'])})
                }
            })
            //   snapshot.forEach((doc) => {
            //   // console.log(doc.id, '=>', doc.data());
            //   //   allRecords.push(doc.data())
            // });
            // this.setState({allrecords: allRecords})
              console.log('size: ', this.state.allrecords.length)
              console.log( 'original: ',(this.state.allrecords))
              console.log( 'sorted: ', _.orderBy(this.state.allrecords,['timestamp'],['desc']))
            //   console.log( 'head: ', _.head(_.orderBy(this.state.allrecords,['timestamp'],['desc'])))
            //   console.log('=============')
            //   console.log(_.filter(this.state.allrecords,['live', false]))
            //   console.log(_.orderBy(_.filter(this.state.allrecords,['live', false]),['timestamp'],['desc']))
            //   console.log(_.head(_.orderBy(_.filter(this.state.allrecords,['live', false]),['timestamp'],['desc'])))

        })
    }

    getLastCheck() {
        firestore.collection('syngentcheck').orderBy('timestamp', 'desc').limit(1).onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    console.log('Last Check: ', change.doc.data());
                    this.setState({lastCheck: change.doc.data()})
                }
            })
        })
    }

    getAllErrors() {
        let allErrors = [];
        firestore.collection('syngentcheck').where('live', '==', false).orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    console.log('New Error Record: ', change.doc.data());
                    allErrors = this.state.allerrors
                    allErrors.push(change.doc.data())
                    _.orderBy(allErrors,['timestamp'],['desc'])
                    this.setState({allerrors: allErrors})
                }
            })
        })
    }

    render() {
        return (
            <div className="App">

                <Header lastCheck={_.head(_.orderBy(this.state.allrecords, ['timestamp'], ['desc']))}
                        lastError={_.head(_.orderBy(_.filter(this.state.allrecords, ['live', false]), ['timestamp'], ['desc']))}/>

            </div>
        );
    }
}

export default App;
