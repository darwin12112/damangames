import React from 'react';
import { NavLink } from 'react-router-dom';
import {   NavLink as BSNavLink,Navbar, Nav, NavItem } from 'reactstrap';
import {
  FaHome,
  FaCoins,
 FaTrophy,
 FaUser
} from 'react-icons/fa';
import {MdContactMail} from 'react-icons/md';
import bn from 'utils/bemnames';
const bem = bn.create('footer');

const Footer = () => {
  var navItems;
  if(localStorage.getItem('auth')){
    navItems = [
   
      { to: '/', name: 'WinGo', exact: true, Icon: FaTrophy },
            // { to: '/toss', name: 'Toss', exact: true, Icon: FaCoins },

      // { to: '/admin', name: 'Admin', exact: false, Icon: FaUserEdit },
      { to: '/my', name: 'My', exact: false, Icon: FaUser },
      // { to: '/about', name: 'About', exact: false, Icon: MdContactMail }
    
    ];
  }else{
    navItems = [
   
      { to: '/', name: 'Enjoy', exact: true, Icon: FaTrophy },
      // { to: '/admin', name: 'Admin', exact: false, Icon: FaUserEdit },
      { to: '/login', name: 'My', exact: false, Icon: FaUser },
      // { to: '/about', name: 'About', exact: false, Icon: MdContactMail }
    
    ];
  }
  return (
    <Navbar className="footer">
      <Nav navbar>
        {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
      </Nav>
    </Navbar>
  );
};

export default Footer;
