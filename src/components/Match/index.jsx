import React from "react";
import { Card, message } from "antd";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
// import Moment from "moment";
import { connect } from "react-redux";

import {
  deleteMatch,
  sendInvite,
  updateMatchStatus,
  leaveMatch
} from "redux/modules/matchDetails";
import { MATCH_STATUS, SOCKET_EVENTS } from "../../../constants";
import { checkLogin } from "redux/modules/userDetails";
// import { isResultPosted } from "client-utils";
import MatchActions from "components/MatchActions";
import routePaths from "Routes/routePaths";
import "./Match.scss";
import CopyData from "../CopyData";

function Match({
  content,
  user,
  deleteMatch,
  sendInvite,
  socket,
  leaveMatch,
  updateMatchStatus,
  checkLogin
}) {
  const history = useHistory();

  const playRequest = () => {
    if (!user.matchInProgress) {
      if (user.chips < content.amount) {
        alert("You don't have enough chips!. Please Buy chips");
        return history.push(routePaths.BUY);
      }
      sendInvite(
        content,
        () => {
          socket.emit(SOCKET_EVENTS.clientPlayRequested, {
            matchId: content._id
          });
        },
        err => {
          const { data } = err.response;
          message.error(data.error);
        }
      );
    } else {
      alert("First Post result for pending Match!");
    }
  };

  const cancelRequest = () => {
    leaveMatch(
      content,
      () => checkLogin(),
      err => {
        const { data } = err.response;
        message.error(data.error);
      }
    );
  };

  // const renderActionBtn = () => {
  //   if (content.status === MATCH_STATUS.created) {
  //     if (content.createdBy._id !== user._id) {
  //       return (
  //         <Button type="primary" onClick={playRequest}>
  //           Play
  //         </Button>
  //       );
  //     } else {
  //       return (
  //         <Button
  //           type="primary"
  //           className="danger__btn"
  //           onClick={() => deleteMatch(content)}
  //         >
  //           Delete
  //         </Button>
  //       );
  //     }
  //   }
  //   if (content.status === MATCH_STATUS.playRequested) {
  //     if (content.createdBy._id === user._id) {
  //       return (
  //         <>
  //           <Button
  //             type="primary"
  //             className="Load_btn"
  //             onClick={() => history.push(`/match/${content._id}`)}
  //           >
  //             Accept
  //           </Button>
  //           <Button>Cancel</Button>
  //         </>
  //       );
  //     }
  //     if (content.joinee._id === user._id) {
  //       return (
  //         <>
  //           <Button type="ghost" disabled>
  //             Requested
  //           </Button>
  //           <Button onClick={cancelRequest}>Cancel</Button>
  //         </>
  //       );
  //     }
  //     return (
  //       <Button type="ghost" disabled>
  //         Can&apos;t join
  //       </Button>
  //     );
  //   }

  //   if (content.status === MATCH_STATUS.playAccepted) {
  //     return (
  //       <Button
  //         type="primary"
  //         className="Load_btn"
  //         onClick={() => history.push(`/match/${content._id}`)}
  //       >
  //         View
  //       </Button>
  //     );
  //   }
  //   if (content.status === MATCH_STATUS.onHold) {
  //     // checking if result posted by user or not
  //     if (!isResultPosted(content.resultsPosted, user._id)) {
  //       return (
  //         <Button
  //           type="primary"
  //           className="Load_btn"
  //           onClick={() => history.push(`/match/${content._id}`)}
  //         >
  //           View
  //         </Button>
  //       );
  //     } else {
  //       return (
  //         <Button type="ghost" disabled>
  //           Processing
  //         </Button>
  //       );
  //     }
  //   }
  //   return null;
  // };

  return (
    <div className="Match">
      <Card className="Match__card">
        {/* <div className="Match__createdDate">
          Created: {Moment(content.createdAt).fromNow()}
        </div> */}
        <div className="Match__info">
          <p>
            {content.createdBy.username} {content.status !== MATCH_STATUS.created ? `vs ${content.joinee && content.joinee.username}` : `have set a challenge`} for{" "}
            <strong>&#8377;{content.amount}</strong>
          </p>
          {/* <p>Match Amount: Rs.{content.amount}</p> */}

          {/* {content.status !== MATCH_STATUS.inProgress && renderActionBtn()} */}
          {content.status !== MATCH_STATUS.inProgress && (
            <MatchActions
              playRequest={playRequest}
              cancelRequest={cancelRequest}
              deleteMatch={match => {
                socket.emit(SOCKET_EVENTS.clientMatchDeleted, {
                  matchId: match._id
                });
                deleteMatch(match);
              }}
              content={content}
              user={user}
            />
          )}
        </div>
        <CopyData data={content._id} title="Copy Match Id" />
      </Card>
    </div>
  );
}

export default connect(null, {
  deleteMatch,
  sendInvite,
  updateMatchStatus,
  checkLogin,
  leaveMatch
})(Match);

Match.propTypes = {
  content: PropTypes.object,
  user: PropTypes.object,
  deleteMatch: PropTypes.func,
  sendInvite: PropTypes.func,
  socket: PropTypes.object,
  updateMatchStatus: PropTypes.func,
  checkLogin: PropTypes.func,
  leaveMatch: PropTypes.func
};
