import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { Button, message } from "antd";
import PropTypes from "prop-types";

import {
  getAllMatches,
  postMatch,
  addMatch,
  resetMatches,
} from "@/redux/modules/matchDetails";
import { checkLogin } from "@/redux/modules/userDetails";
import TextInput from "@/components/TextInput";
import Matches from "@/components/Matches";
import routePaths from "@/Routes/routePaths";
import { SOCKET_EVENTS } from "@/constants";
import "./Home.scss";
import Onboarding from "@/components/Onboarding";

class Home extends Component {
  componentDidMount() {
    // this.props.getAllMatches();
    const { socket } = this.props;
    socket.on(SOCKET_EVENTS.serverMatchUpdates, (data) => {
      const match = data[0];
      match.createdBy !== this.props.userDetails._id &&
        this.props.addMatch(data[0]);
    });
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeAllListeners(SOCKET_EVENTS.serverMatchUpdates);
  }

  onChallengeSet = (values) => {
    const { socket } = this.props;
    this.props.postMatch(
      values,
      () => {
        this.props.checkLogin();
        socket.emit(SOCKET_EVENTS.clientMatchPosted, {
          id: this.props.userDetails._id,
        });
      },
      (err) => {
        const { data } = err.response;
        message.error(data.error);
      }
    );
  };

  render() {
    const { userDetails, history } = this.props;
    return (
      <div className="Home">
        {userDetails._id ? (
          <>
            <div className="Home__message">
              If your oppoent says you to play in any other group, inform us we
              will award you win. (Proof required)
            </div>
            <Formik
              initialValues={{
                amount: "",
              }}
              validationSchema={Yup.object({
                amount: Yup.number()
                  .required("Required!")
                  .min(50, "Amount must be minimum 50"),
              })}
              onSubmit={(values) => {
                if (userDetails.matchInProgress) {
                  alert("First, Post the result of pending match");
                  history.push(routePaths.HISTORY);
                } else if (userDetails.chips < values.amount) {
                  alert("You don't have enough chips!. Please Buy chips");
                  history.push(routePaths.BUY);
                } else {
                  this.onChallengeSet(values);
                }
              }}
            >
              {(props) => (
                <div className="Home__setChallenge">
                  <TextInput
                    name="amount"
                    type="text"
                    placeholder="Enter Amount"
                  />
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
          </>
        ) : (
          <Onboarding />
        )}
      </div>
    );
  }
}

export default connect(({ userDetails }) => ({ userDetails }), {
  getAllMatches,
  postMatch,
  addMatch,
  resetMatches,
  checkLogin,
})(Home);

Home.propTypes = {
  getAllMatches: PropTypes.func,
  postMatch: PropTypes.func,
  userDetails: PropTypes.object,
  addMatch: PropTypes.func,
  resetMatches: PropTypes.func,
  socket: PropTypes.object,
  checkLogin: PropTypes.func,
  history: PropTypes.object,
};
