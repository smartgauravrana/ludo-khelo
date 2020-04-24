import React, { useState } from "react";
import { Layout } from "antd";
import PropTypes from "prop-types";
import HeaderContent from "components/HeaderContent";

const { Header, Content, Footer } = Layout;

export default function AppLayout(props) {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(!visible);

  return (
    <Layout>
      <Header>
        <HeaderContent onMenuClick={showDrawer} drawerVisible={visible} />
      </Header>
      <Content>{props.children}</Content>
      <Footer>CopyRights RANA Team ;) 2020</Footer>
    </Layout>
  );
}

AppLayout.propTypes = {
  children: PropTypes.object
};
