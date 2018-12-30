import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Image from "material-ui-image";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Switch from "@material-ui/core/Switch";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import "./GroupedMessageContainer.css";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-balham.css";
import "@material-ui/core/styles";
import { Call as CallIcon, Message as MessageIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { List, ListItem } from "@material-ui/core";

const styles = theme => ({
  root: {},
  container: {
  }
});

// ====== This is the component within messagelist which has two prop types. date and time.
class MessageItem extends Component {
  render() {
    const { media } = this.props;
    let liStyle = {};
    let pStyle = {
      "text-align": "right"
    };

    if (this.props.incoming) {
      // TODO - refactor and use className + CSS - BRW
      liStyle = {};
      pStyle = {
        "text-align": "left",
        "background-color": "#eeeeee",
        color: "#000000"
      };
    }

    return (
      <ListItem style={{ display: "list-item" }}>
        <div className="message-timestampborder">
          <div className="message-timestamp">
            {moment.unix(this.props.timestamp).format("M/D/YYYY @ hh:mm a")}
          </div>
        </div>
        <div style={pStyle} className="message-content">
          {this.props.body}
        </div>
        <div className="message-media">
          {media &&
            media.map(({ url }, index) => (
              <Image
                key={`${index}-${url}`}
                src={url}
                className="message-image"
                style={{ marginBottom:"5px" }}
              />
            ))}
        </div>
      </ListItem>
    );
  }
}
// ====== this is the message list container which is a prop in the groupedmessage container
class MessageList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    checked: true
  };

  handleChange = () => {
    this.setState(state => ({ checked: !state.checked }));
  };

  showReplyForm = () => {
    this.props.showReplyForm(this.props.contactPhone);
  };

  doCall = () => {
    this.props.doCall(this.props.contactPhone);
  };

  renderMessageItem = messageItem => {
    const { incoming, timestamp, body, media, contactPhone } = messageItem;
    return (
      <MessageItem
        timestamp={timestamp}
        incoming={incoming}
        body={body}
        media={media}
        contactPhone={contactPhone}
        showReplyForm={this.props.showReplyForm}
      />
    );
  };

  render() {
    const { checked } = this.state;

    return (
      <div className="message-list Collapse">
        <div>
          <div className="list-header">
            <div className="number-display">{this.props.contactPhone}</div>
            <Switch
              checked={checked}
              onChange={this.handleChange}
              aria-label="Collapse"
            />
            <div className="action-row">
              <Button className="btn-message">
                <a href={`tel:${this.props.contactPhone}`}>
                  <CallIcon className="call-color" />
                </a>
              </Button>
              <Button className="btn-message" onClick={this.showReplyForm}>
                <MessageIcon />
              </Button>
            </div>
          </div>
        </div>
        <Collapse in={checked} style={{ width: "100%" }}>
          <List disablePadding>
            {this.props.messages.map(this.renderMessageItem)}
          </List>
        </Collapse>
      </div>
    );
  }
}
// === this is the main component that is having props being passed through it from the form container.
class GroupedMessageContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    function groupBy(objectArray, property) {
      return objectArray.reduce(function(acc, obj) {
        let key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }

    const groupedNumbers = groupBy(this.props.messages, "contactPhone");

    return (
      <div id="responsive-wrapper" className="container-center">
        {Object.values(groupedNumbers).map((messageData, index) => {
          const { contactPhone } = messageData[0];

          return (
            <div className={classes.root}>
              <div className="messageCard">
                <Card>
                  <Typography variant="Roboto" color="textPrimary">
                    <MessageList
                      contactPhone={contactPhone}
                      messages={messageData.reverse()}
                      showReplyForm={this.props.showReplyForm}
                    />
                  </Typography>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(GroupedMessageContainer);
