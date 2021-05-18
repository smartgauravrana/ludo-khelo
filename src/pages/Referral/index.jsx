import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';

import QueryNotice from "components/QueryNotice";
import MessageShare from "components/MessageShare";

import { getReferrals } from "redux/modules/userDetails";

import './Referral.scss';

function Referral({ settings, userDetails, getReferrals }) {

	useEffect(() => {
		getReferrals();
	}, [])

    const [tooltipVisible, setTooltipVisible] = useState(false);

		const {shareMessage} = settings;
		console.log(settings)

		const message = shareMessage ? shareMessage.replace("REFER_CODE", userDetails.referCode) : ''

    function updateClipboard() {
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 900)
        navigator.clipboard.writeText(userDetails.referCode).then(function() {
            /* clipboard successfully set */
        }, function() {
            /* clipboard write failed */
        });
        }

    return <div className="Referral">
        <h1 className="Referral__Title">Refer and Earn</h1>
             
             <p>Share your refer code with your friends.</p>
             <p>Now sit back and relax.</p>
						 <p>You will earn whenever your friend plays a match</p>
             <h3>Find your refer code below</h3>

             <Tooltip title="Code Copied" placement="bottom" color="green" visible={tooltipVisible}>
             <div className="Referral__Button" onClick={updateClipboard}>
                 <div className="Referral__Code">{userDetails.referCode}</div>
                 <CopyOutlined className="Referral__Copy"/>
             </div>
            </Tooltip>

						<div className="Referral__Share">
							<div className="Referral__ShareTitle" style={{ "borderBottom": "1px solid black"}}>
								SHARE KARO RE BABA ! 
							</div>
							<MessageShare message={message} referCode={userDetails.referCode}/>
						</div>

						<div className="Referral__Invites">
                Invites accepted: <span className="Referral__Count">{userDetails.referralsCount}</span>
            </div>

						<div className="Referral__Support">
							<QueryNotice />
						</div>
						
        
         </div>
}

export default connect(({
    settings,
    userDetails
}) => ({
    settings: settings.settings,
    userDetails
}), {
	getReferrals
})(Referral);
  
Referral.propTypes = {
  settings: PropTypes.object,
	userDetails: PropTypes.object
};