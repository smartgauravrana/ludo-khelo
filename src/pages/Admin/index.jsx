import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Modal, message } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import TextInput from "@/components/TextInput";
import { postMatch } from "@/redux/modules/matchDetails";
import Matches from "@/components/Matches";
import "./Admin.scss";

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }

  createMatchHandler = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false, confirmLoading: false });
  };

  okHandler = (values) => {
    this.setState({ confirmLoading: true });
    this.props.postMatch(values, () => {
      this.handleCancel();
      message.success("Match Created!");
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div className="AdminPage">
        <h1>Admin Page</h1>
        <div className="AdminPage__actions">
          <Button type="primary" onClick={this.createMatchHandler}>
            Create Match
          </Button>
          <Formik
            initialValues={{
              amount: "",
            }}
            validationSchema={Yup.object({
              amount: Yup.number().required("Required!"),
            })}
            onSubmit={(values) => this.okHandler(values)}
          >
            {(props) => (
              <Modal
                title="Match Joining Fee"
                visible={visible}
                onOk={props.submitForm}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                afterClose={props.resetForm}
              >
                <TextInput
                  name="amount"
                  type="text"
                  placeholder="Enter Amount"
                  label="Joining Fee"
                />
              </Modal>
            )}
          </Formik>
        </div>
        <Matches />
      </div>
    );
  }
}

export default connect(null, { postMatch })(Admin);

Admin.propTypes = {
  postMatch: PropTypes.func,
};
