import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { Button } from "antd";
import PropTypes from "prop-types";
import socketIOClient from "socket.io-client";

import {
  getAllMatches,
  postMatch,
  addMatch,
  resetMatches
} from "redux/modules/matchDetails";
import TextInput from "components/TextInput";
import Matches from "components/Matches";
import { SOCKET_EVENTS } from "../../../constants/index";
import "./Home.scss";

const ENDPOINT = "http://127.0.0.1:3000";
class Home extends Component {
  componentDidMount() {
    console.log(SOCKET_EVENTS);
    this.props.getAllMatches();
    this.socket = socketIOClient(ENDPOINT);
    this.socket.on(SOCKET_EVENTS.serverMatchUpdates, data => {
      const match = data[0];
      match.createdBy !== this.props.userDetails._id &&
        this.props.addMatch(data[0]);
    });
  }

  componentWillUnmount() {
    // this.props.resetMatches();
  }

  onChallengeSet = values => {
    console.log("values: ", values);
    this.props.postMatch(values, () => {
      this.socket.emit(SOCKET_EVENTS.clientMatchPosted, {
        id: this.props.userDetails._id
      });
    });
  };

  render() {
    return (
      <div className="Home">
        <div className="Home__message">
          If your oppoent says you to play in any other group, inform us we will
          award you win. (Proof required)
        </div>
        <Formik
          initialValues={{
            amount: ""
          }}
          validationSchema={Yup.object({
            amount: Yup.number()
              .required("Required!")
              .min(50, "Amount must be minimum 50")
          })}
          onSubmit={values => this.onChallengeSet(values)}
        >
          {props => (
            <div className="Home__setChallenge">
              <TextInput name="amount" type="text" placeholder="Enter Amount" />
              <Button
                type="primary"
                onClick={() => {
                  props.submitForm();
                  // props.resetForm();
                }}
              >
                Set
              </Button>
            </div>
          )}
        </Formik>
        <Matches />
      </div>
    );
  }
}

export default connect(({ userDetails }) => ({ userDetails }), {
  getAllMatches,
  postMatch,
  addMatch,
  resetMatches
})(Home);

Home.propTypes = {
  getAllMatches: PropTypes.func,
  postMatch: PropTypes.func,
  userDetails: PropTypes.object,
  addMatch: PropTypes.func,
  resetMatches: PropTypes.func
};
