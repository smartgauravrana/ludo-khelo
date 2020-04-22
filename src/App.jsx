import React, { useState } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Layout, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import Login from "pages/Login";
import Register from "pages/Register";
import "./App.scss";

const { Header, Content, Footer } = Layout;
export default function App() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(!visible);

  return (
    <div className="App">
      <Layout>
        <Header>
          <div className="header">
            <div className="header__title">Welcome</div>
            <MenuOutlined className="header__menu--icon" onClick={showDrawer} />
          </div>
          <Drawer
            title="Menu"
            placement="top"
            closable={true}
            onClose={showDrawer}
            visible={visible}
          >
            <div className="drawable-items">
              <Link to="/login" onClick={showDrawer}>
                Login
              </Link>
              <Link to="/register" onClick={showDrawer}>
                Register
              </Link>
            </div>
          </Drawer>
        </Header>
        <Content>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </Content>
        <Footer>CopyRights RANA Team ;) 2020</Footer>
      </Layout>
    </div>
  );
}
