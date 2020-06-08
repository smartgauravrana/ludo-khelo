import React, { useState } from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import { Button, message } from "antd";
import * as Yup from "yup";
import PropTypes from "prop-types";

import TextInput from "components/TextInput";
import Loader from "components/Loader";
import { updateSettings } from "redux/modules/settings";
import "./Settings.scss";

const fields = [
  {
    name: "paytmNumber",
    type: "text",
    label: "Paytm Number"
  },
  {
    name: "paytmMail",
    type: "text",
    label: "Paytm Mail"
  },
  {
    name: "supportNumber",
    type: "text",
    label: "Support Number"
  }
];
function Settings({ settings, updateSettings }) {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="Settings">
      <h1>Settings</h1>
      <Formik
        enableReinitialize={true}
        initialValues={{
          paytmNumber: settings.paytmNumber,
          paytmMail: settings.paytmMail,
          supportNumber: settings.supportNumber
        }}
        validationSchema={Yup.object({
          paytmNumber: Yup.string()
            .required("Required!")
            .length(10, "Phone No should be of 10 digits"),
          supportNumber: Yup.string()
            .required("Required!")
            .length(10, "Phone No should be of 10 digits")
        })}
        onSubmit={values => {
          setIsLoading(true);
          setEditMode(false);
          updateSettings(
            values,
            () => {
              setIsLoading(false);
              message.success("Updated !");
            },
            () => {
              setIsLoading(false);
              message.error("Try Again!");
            }
          );
        }}
      >
        {props => {
          const initialStr = Object.values(props.initialValues).join("");
          const currentStr = Object.values(props.values).join("");
          return (
            <Form>
              {fields.map(field => (
                <TextInput key={field.name} {...field} disabled={!editMode} />
              ))}
              <div className="Settings__Actions">
                <Button
                  className="white-btn"
                  onClick={() => {
                    if (!editMode) {
                      setEditMode(true);
                    } else {
                      props.resetForm();
                      setEditMode(false);
                    }
                  }}
                >
                  {!editMode ? "Edit" : "Cancel"}
                </Button>
                <Button
                  type="primary"
                  disabled={
                    !editMode || !props.isValid || initialStr === currentStr
                  }
                  onClick={() => props.submitForm()}
                >
                  Update
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      {isLoading && <Loader />}
    </div>
  );
}

export default connect(({ settings: { settings } }) => ({ settings }), {
  updateSettings
})(Settings);

Settings.propTypes = {
  settings: PropTypes.object,
  resetForm: PropTypes.func,
  isValid: PropTypes.bool,
  submitForm: PropTypes.func,
  initialValues: PropTypes.object,
  values: PropTypes.object,
  updateSettings: PropTypes.func
};
