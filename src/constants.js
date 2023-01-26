export const MATCH_STATUS = {
  created: "created",
  playRequested: "playRequested",
  playAccepted: "playAccepted",
  onHold: "onHold",
  cancelled: "cancelled",
  completed: "completed",
};

export const SOCKET_EVENTS = {
  clientMatchPosted: "clientMatchPosted",
  serverMatchUpdates: "serverMatchUpdates",
  clientPlayRequested: "clientPlayRequested",
  serverPlayRequested: "serverPlayRequested",
  clientPlayAccepted: "clientPlayAccepted",
  serverPlayAccepted: "serverPlayAccepted",
  clientMatchDeleted: "clientMatchDeleted",
  serverMatchDeleted: "serverMatchDeleted",
};

export const SELLING_STATUS = {
  active: "active",
  completed: "completed",
};

export const RESULT_OPTIONS = {
  won: "won",
  lost: "lost",
  cancel: "cancel",
};
