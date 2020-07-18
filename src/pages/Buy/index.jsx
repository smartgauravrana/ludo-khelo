import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, message } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import CustomTitle from "components/CustomTitle";
import TextInput from "components/TextInput";
import { buyChips } from "redux/modules/userDetails";
import QueryNotice from "components/QueryNotice";
import Loader from "components/Loader";
import "./Buy.scss";

const BuyFields = [
  {
    name: "transactionId",
    type: "text",
    placeholder: "Transaction Id"
  },
  {
    name: "amount",
    type: "number",
    placeholder: "Amount"
  }
];

function Buy({ userDetails, buyChips, settings }) {
  const [isBuying, setIsBuying] = useState(false);
  // const { supportNumber } = settings;
  // const { paytmNumber, supportNumber } = settings;

  // function copy() {
  //   var copyText = document.querySelector("#paymentNumber");
  //   copyText.select();
  //   document.execCommand("copy");
  // }
  const noticeInfo = (
    <>
      <CustomTitle title="Buy Chips" />
      <p style={{ color: "indigo", fontSize: "19px" }}>
        Pay via Paytm Wallet Only
      </p>
      <p className="text-danger" style={{ fontSize: "19px" }}>
        Dont pay through Bank (You will lose your money).
      </p>
      <p>
        Please pay at this Link through{" "}
        <span>
          <a href="https://paytm.me/YCm-eWS">PAYTM LINK</a>
        </span>
        , and enter wallet Transcation Id.
        <br />
        <a href="/help/loadbalance">Help</a>
      </p>
    </>
  );

  const onBuyChips = (values, cb) => {
    setIsBuying(true);
    buyChips(
      values,
      () => {
        cb();
        message.success("Chips Added!");
      },
      err => {
        cb();
        const { data } = err.response;
        message.error(data.error);
      }
    );
  };

  return (
    <div className="Buy">
      <div className="Buy__Header">{noticeInfo}</div>
      {/* <div className="Buy__paymentNumber form-group">
        <input
          id="paymentNumber"
          type="number"
          name="paymentNumber"
          placeholder="Payment Link"
          readOnly
          value={paytmNumber}
        />
        <div className="input-group-append">
          <button id="copyButton" onClick={copy}>
            Copy
          </button>
        </div>
      </div> */}
      <div className="Buy__paytmLink">
        <a href="https://paytm.me/YCm-eWS">Click Here to Open Paytm App</a>
      </div>
      <div className="Buy__form">
        <Formik
          initialValues={{
            transactionId: "",
            amount: ""
          }}
          validationSchema={Yup.object({
            transactionId: Yup.string().required("Required!"),
            amount: Yup.number()
              .required("Required!")
              .positive("Amount can't be minus")
              .integer("Amount can't include decimal point.")
          })}
          onSubmit={(values, { resetForm }) =>
            onBuyChips(values, () => {
              resetForm();
              setIsBuying(false);
            })
          }
        >
          {props => (
            <Form>
              {BuyFields.map(field => (
                <TextInput key={field.name} {...field} />
              ))}
              <Button
                className="Load_btn"
                type="success"
                onClick={() => {
                  if (props.isValid) {
                    props.submitForm();
                  }
                }}
              >
                Load
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <QueryNotice />
      {isBuying && <Loader />}
    </div>
  );
}

export default connect(
  ({ userDetails, settings: { settings } }) => ({
    userDetails,
    settings
  }),
  {
    buyChips
  }
)(Buy);

Buy.propTypes = {
  userDetails: PropTypes.object,
  isValid: PropTypes.bool,
  submitForm: PropTypes.func,
  buyChips: PropTypes.func,
  resetForm: PropTypes.func,
  settings: PropTypes.object
};
