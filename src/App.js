import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Search} from 'semantic-ui-react';
import axios from "axios";
import _ from 'lodash';
// const searchURL = "https://cors-anywhere.herokuapp.com/"+"https://vtiger7.crmvgo.com/websv/"+"?function=GetAccountListByAccountName&accountname="
//const searchURL = "https://vtiger7.crmvgo.com/websv/"+"?function=GetAccountListByAccountName&accountname="
const searchURL = "http://192.168.122.1/api/"+"?function=GetAccountListByAccountName&accountname="
var acclist = [];
var idlist = [];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isLoading : false,
       results: [],
       value: '',
       idacc: '',
       acc:'',
       checkdis : false,
       loadingPage:false,
       typing: false,
       typingTimeout: 0
    };
    this.resetComponent = this.resetComponent.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this. handleSearchChange.bind(this);
    this.callservice = this.callservice.bind(this);
}

resetComponent(){
  this.setState({ isLoading: false, results: [], value: '',checkdis : false })
}

handleResultSelect(e, { result }){
  this.setState({ value: result.title,idacc:result.accid,acc:result.title,checkdis : true })
}

handleSearchChange(e, { value }){

this.setState({ value,typing: true })
var text = value
if (text.length == 0) {
  clearTimeout(this.state.typingTimeout);
  this.resetComponent()
}
if(text.length >= 3){
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }  

    this.setState({
      typing: false,
      typingTimeout: setTimeout(() => {
        this.callservice(text)
        }, 1000),
      isLoading: true
    });
}

}

callservice(data){

  const re = new RegExp(_.escapeRegExp(data), 'i')
  // console.log("re"+re)
  axios
  .get(searchURL+ data,{
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
    }
  })
  .then(response => {
    if(JSON.stringify(response.status) != '200'){
          console.log("status fail:"+response.status)
    }else{
        acclist = []
        idlist = []
      if(Array.isArray(response.data) == true)
      {
        var resarray = response.data;
        resarray.map((result,index) => {
            acclist.push({title: result.accountname,accid:result.id});
            idlist.push(result.id);
        })
        if(acclist.length != 0){
          const isMatch = result => re.test(result)

          this.setState({
            isLoading: false,
            results: acclist
          })
        }               
      }else{
        this.setState({
          isLoading: false,
          results : [{title : "no result found."}]
        })
      }

    }
  })
  .catch(error => {
    console.log(error)  
  })
}

  render() {
    const { isLoading, value, results } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          PPPPPPPPPPPPPPPPPPPPPPTo get started, edit <code>src/App.js</code> and save to reload.
        </p>
           
        <Search
              fluid
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={this.handleSearchChange}
              showNoResults = {false}
              results={results}
              value={value}
              input={{ fluid: true }}
              {...this.props}
            />

      </div>
    );
  }
}

export default App;
