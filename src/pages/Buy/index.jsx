import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, message } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import CustomTitle from "components/CustomTitle";
import TextInput from "components/TextInput";
import { buyChips } from "redux/modules/userDetails";
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

function Buy({ userDetails, buyChips }) {
  function copy() {
    var copyText = document.querySelector("#paymentNumber");
    copyText.select();
    document.execCommand("copy");
  }
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
        Please pay at this number only{" "}
        <span>
          <b style={{ fontSize: "120%", color: "red" }}>9729343885</b>
        </span>
        , and enter wallet Transcation Id.
        <br />
        <a href="/help/loadbalance">Help</a>
      </p>
    </>
  );

  const onBuyChips = values => {
    buyChips(
      values,
      () => message.success("Chips Added!"),
      err => {
        const { data } = err.response;
        message.error(data.msg);
      }
    );
  };

  return (
    <div className="Buy">
      <div className="Buy__Header">{noticeInfo}</div>
      <div className="Buy__paymentNumber">
        <input
          id="paymentNumber"
          type="number"
          name="paymentNumber"
          placeholder="Recipient Paytm Number..."
          readOnly
          value="9729343885"
        />
        <div className="input-group-append">
          <button id="copyButton" onClick={copy}>
            Copy
          </button>
        </div>
      </div>
      <div className="Buy__form">
        <Formik
          initialValues={{
            transactionId: "",
            amount: ""
          }}
          validationSchema={Yup.object({
            transactionId: Yup.string().required("Required!"),
            amount: Yup.number().required("Required!")
          })}
          onSubmit={onBuyChips}
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
      <div className="Buy__QA">
        <h3 style={{ textAlign: "center" }}>For Any Query</h3>
        <p style={{ textAlign: "center" }}>
          Please contact support at whatsapp (+919729343885)
          <br />
          Your query will be solved in <b>within 12 hours</b>.
        </p>
        <a
          href={`https://wa.me/919729343885?text=Please+Load+Chips+In+My+Account,+My+account+number+is+${userDetails.phone}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here to contact Admin
        </a>
      </div>
    </div>
  );
}

export default connect(
  ({ userDetails }) => ({
    userDetails
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
  resetForm: PropTypes.func
};
