import React, { Component } from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import Card from "@material-ui/core/Card";
import TextArea from "../../components/TextArea.js";
import "./SearchContainer.css";
import Button from "@material-ui/core/Button";

class FormContainer extends Component {
  state = {
    search: ""
  };

  constructor(props) {
    super(props);
  }

  handleSearchChange = e => {
    this.setState({ search: e.target.value }, () => {
      console.log(this.state.search);
      axios
        .get("/search/" + this.state.search)
        .then(response => {
          console.log(response.data);
          if (response.data) {
            this.props.setMessages(response.data || []);
          }
        })
        .catch(error => {
          console.error("you have an err:", error);
        });
    });
  };

  handleClearForm = e => {
    this.setState({
      search: ""
    });
    this.props.loadAllMessages();
  };

  render() {
    return (
      <div className="searchMessageCard">
        <Card>
          <form className="search-container" onChange={this.handleSearchChange}>
            <div className="title-sub">
              <TextArea
                title="Find Message"
                labelClassName="search-label"
                className="searchContactPhone"
                rows={1}
                resize={false}
                content={this.state.search}
                name="search"
                onKeyUp={this.handleSearchChange}
                placeholder="Search a number"
              />
            </div>
          </form>
          <div className="search-btn">
            <Button
              variant="contained"
              color="primary"
              className="mdc-button--raised "
              onClick={this.handleClearForm}
            >
              Reset
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default FormContainer;
