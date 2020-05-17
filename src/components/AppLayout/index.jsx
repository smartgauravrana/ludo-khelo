import React, { useState } from "react";
import { Layout } from "antd";
import PropTypes from "prop-types";
import HeaderContent from "components/HeaderContent";
import "./AppLayout.scss";

const { Header, Content } = Layout;

export default function AppLayout(props) {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(!visible);

  return (
    <Layout>
      <Header>
        <HeaderContent onMenuClick={showDrawer} drawerVisible={visible} />
      </Header>
      <Content>
        <div className="container">{props.children}</div>
      </Content>
      {/* <Footer>CopyRights RANA Team ;) 2020</Footer> */}
    </Layout>
  );
}

AppLayout.propTypes = {
  children: PropTypes.object
};
