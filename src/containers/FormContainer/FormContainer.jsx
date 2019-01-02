import axios from "axios";
import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from '@material-ui/core/CardMedia';
import Button from "@material-ui/core/Button";
import moment from 'moment';
import TextArea from "../../components/TextArea.js";
import SingleInput from "../../components/SingleInput.js";
import "./FormContainer.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import Typography from "@material-ui/core/Typography";
import "react-notifications/lib/notifications.css";
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

class FormContainer extends Component {
  state = {
    body: "",
    contactPhone: this.props.contactPhone || "",
    messageLength: 0
  }

  constructor(props) {
    super(props);
  }

  handleFullMessageChange = (e) => {
    const length = e.target.value.length;

    if (length > 160) {
      return;
    }

    this.setState({
      body: e.target.value,
      messageLength: length
    });
  }

  handleFullNumberChange = (e) => {
    this.setState({ contactPhone: e.target.value }, () =>
      console.log("tel: ", this.state.contactPhone)
    );
  }

  handleClearForm = (e) => {
    this.setState({
      body: "",
      contactPhone: "",
      messageLength: ""
    });
  }

  handleSetMessage = (e) => {
    const genericMessage ="This is Adam attempting to schedule your A/C service appointment. Please call or text us at 123-245-2525.";
    this.setState({
      body: genericMessage 
    });
  }


  handleFormSubmit = (e) => {
    e.preventDefault();
    const clearForm = this.handleClearForm;
    const number = phoneUtil.parseAndKeepRawInput(
      this.state.contactPhone,
      "US"
    );
    const formattedNumber = phoneUtil.format(number, PNF.E164);
    const formPayload = {
      message: this.state.body,
      recipient: formattedNumber
    };

    this.props.addMessage({
      body: this.state.body,
      contactPhone: formattedNumber,
      timestamp: moment().unix()
    })
    console.log("This is sent as a POST request: ", formPayload);

    axios
      .post("/api/send", formPayload)
      .then(data => {
        console.log(data);
        NotificationManager.info("Success: Message sent");
        clearForm();
      })
      .catch(error => {
        NotificationManager.error("Error: Message not sent");
        console.error(error);
      });
  }

  render() {
    return (
      <div className="messageCard">
        <Card>
          <Typography>
            <form className="form-container" onSubmit={this.handleFormSubmit}>
             
              <div className="numberForm">
                <SingleInput
                  inputType="tel"
                  className=""
                  labelClassName="number-label"
                  title="Number"
                  name="contactPhone"
                  controlFunc={this.handleFullNumberChange}
                  content={this.state.contactPhone}
                  placeholder="Enter a number"
                />
              </div>
              <div className="title-sub">
                <TextArea
                  title="Message"
                  className="formtextarea"
                  labelClassName="message-label"
                  rows={10}
                  resize={true}
                  content={this.state.body}
                  name="body"
                  controlFunc={this.handleFullMessageChange}
                  placeholder="Enter a message"
                />
              </div>
              <div className="char-align">
                {this.state.messageLength}
                /160
              </div>
              <div className="btn-container">
                <div className="btn-position">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="mdc-button--raised"
                    value="Submit"
                  >
                    Submit
                  </Button>
                </div>
                <div className="btn-position">
                  <Button
                    variant="contained"
                    color="primary"
                    className="mdc-button--raised "
                    onClick={this.handleClearForm}
                  >
                    Clear
                  </Button>
                </div>
                <div className="btn-position">
                  <Button
                    variant="contained"
                    color="secondary"
                    className="mdc-button--raised "
                    onClick={() => {
                      this.props.goBack();
                    }}
                  >
                    Cancel
                  </Button>
                  
                </div>
              </div>
              
              <div className="btn-container">
                  <div className="btn-position">
                  <Button
                    variant="contained"
                    color="secondary"
                    className="mdc-button--raised "
                    onClick={this.handleSetMessage}
                  >
                    Prefill Form
                  </Button>
                  </div>
              </div>


            </form>
            <NotificationContainer />
          </Typography>
        </Card>
      </div>
    );
  }
}

export default FormContainer;
