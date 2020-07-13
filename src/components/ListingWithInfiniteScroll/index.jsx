import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import { Spin } from "antd";

export default function ListingWithInfiniteScroll(props) {
  const { className, loadMore, hasMore, isLoading, settings } = props;
  return (
    <InfiniteScroll
      pageStart={0}
      className={className}
      loadMore={loadMore}
      hasMore={hasMore}
      initialLoad={false}
      {...settings}
    >
      {props.children}
      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      )}
    </InfiniteScroll>
  );
}

ListingWithInfiniteScroll.propTypes = {
  className: PropTypes.string,
  loadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  children: PropTypes.array,
  settings: PropTypes.object
};

ListingWithInfiniteScroll.defaultProps = {
  initialLoad: false,
  settings: {}
};
