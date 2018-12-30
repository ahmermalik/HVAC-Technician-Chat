import React, { Component } from "react";
import FormContainer from "./containers/FormContainer/FormContainer";
import SearchContainer from "./containers/SearchContainer/SearchContainer";
import IncomingMessageContainer from "./containers/IncomingMessageContainer/IncomingMessageContainer";
import GroupedMessageContainer from "./containers/GroupedMessageContainer/GroupedMessageContainer";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import moment from 'moment';
import { subscribeToMessage } from "./socket";
import "./App.css";

const styles = {
  root: {
    flexGrow: 1,
    width: "100%"
  }
};



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousComponent: "",
      activeComponent: "GroupedMessageContainer",
      tabValue: 0,
      messageNumber: "",
      messages: []
    };

    const {REACT_APP_HOST, REACT_APP_PORT} = process.env;

    subscribeToMessage(
      `http://${REACT_APP_HOST}:${REACT_APP_PORT}`,
      (err, data) => {
        console.log(data);
        let messages = this.state.messages;
        messages.push({
          incoming: true,
          contactPhone: data.From,
          body: data.Body,
          timestamp: new moment().unix()
        });
        this.setState({
          messages
        })
      }
    )
  }

  addMessage = (messageData) => {
    console.log(messageData)
    let messages = this.state.messages;
    messages.push(messageData);
    this.setState({
      messages
    });
  }


  setMessages = (messageData) => {
    console.log('setMessages() called');
    console.log(messageData);
    this.setState({messages: messageData || []});
  }

  // map function to grab number, message, and time from all messages in json object
  componentDidMount = () => {
    this.loadAllMessages();
}

loadAllMessages = () => {
  var headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa(`${process.env.REACT_APP_USERID}:${process.env.REACT_APP_USERPASS}`));
    fetch(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/all`, {headers})
      .then(response => response.json())
      .then(messages => {
        var messageData = messages.map(msg => {
          return {
            incoming: msg.incoming,
            contactPhone: msg.contactPhone,
            body: msg.body,
            timestamp: msg.timestamp,
            media: msg.media
          };
        })
        this.setState({messages:messageData});

})
}




  showReplyForm = (contactPhone) => {
    this.setState({
      contactPhone
    });
    this.changeComponent(null, 1);
  }

//Change rendered component based on numerical value passed
  changeComponent = (event, value) => {
    console.log(value);
    const indexToComponents = {
      0: "GroupedMessageContainer",
      1: "FormContainer"
    };
    const newComponent = indexToComponents[value];
    this.setState({
      previousComponent: this.state.activeComponent,
      activeComponent: newComponent,
      previousTabValue: this.state.tabValue,
      tabValue: value
    });
  }

  goBack = () => {
    this.setState({
      previousComponent: this.state.activeComponent,
      activeComponent: this.state.previousComponent,
      tabValue: this.state.previousTabValue,
      previousTabValue: this.state.tabValue
    });
  }



  render() {
    const { classes } = this.props;
    const renderView = viewComponent => {
      console.log(viewComponent);
      switch (viewComponent) {
        case "GroupedMessageContainer":
          return(
            <GroupedMessageContainer
              showReplyForm={this.showReplyForm}
              messages={this.state.messages}

              />
          )
        case "FormContainer":
          return (
            <FormContainer
              addMessage={this.addMessage}
              contactPhone={this.state.contactPhone}
              goBack={this.goBack}
            />
          );
      }
    };

    return (
      <div className="main-container">
        <div className="mdc-typography">
          <AppBar className="appbarstyle" position="static">
            <Tabs
              value={this.state.tabValue}
              onChange={this.changeComponent}
              centered
            >
              <Tab
                label="Messages"
                componentName="GroupedMessageContainer"
                title="Messages"
              />
              <Tab
                label="Send"
                componentName="FormContainer"
                title="Send"
              />
               
            </Tabs>
          </AppBar>
          <SearchContainer setMessages={this.setMessages} loadAllMessages={this.loadAllMessages}/>
        </div>

        {renderView(this.state.activeComponent)}
      </div>
    );
  }
}

export default withStyles(styles)(App);
