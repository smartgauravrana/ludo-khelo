import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { Button } from "antd";
import PropTypes from "prop-types";

import { getAllMatches, postMatch } from "redux/modules/matchDetails";
import TextInput from "components/TextInput";
import Matches from "components/Matches";
import "./Home.scss";

class Home extends Component {
  componentDidMount() {
    this.props.getAllMatches();
  }

  onChallengeSet = values => {
    this.props.postMatch(values);
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
                  props.resetForm();
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

export default connect(null, { getAllMatches, postMatch })(Home);

Home.propTypes = {
  getAllMatches: PropTypes.func,
  postMatch: PropTypes.func
};
