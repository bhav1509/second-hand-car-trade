import React from "react";
import { Menu, Input } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">BUY SELL Administration</a>
      </Link>
      {/* <Menu.Item>
        <div class="ui search">
          <div class="ui icon input" style={{ width: "100%" }}>
            <input class="prompt" type="text" placeholder="Search Car" />
            <i class="search icon"></i>
          </div>
          <div class="results"></div>
        </div>
      </Menu.Item> */}
      <Menu.Menu position="right">
        {/* <Link route="/">
          <a className="item">All Transations</a>
        </Link> */}

        <Link route="/newrole">
          <a className="item">+ New Role</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
