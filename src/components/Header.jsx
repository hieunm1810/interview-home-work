import React from "react";
import logo from "../assets/imgs/logo.webp";
import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <div>
      <nav className="navbar p-0 navbar-expand-lg bg-dark mb-5">
        <div className="container position-relative">
          <NavLink className="navbar-brand">
            <img src={logo} alt="" height={50} />
          </NavLink>
          <NavLink className={"text-muted"}>
            <h1
              className="m-0 position-absolute start-50 top-50 translate-middle"
            >
              Blogs
            </h1>
          </NavLink>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink
                  className="nav-link p-0 d-flex align-items-center gap-2"
                  href="#"
                >
                  <img src="https://i.pravatar.cc/50?img=2" alt="" />
                  <p className="m-0 text-white fw-semibold">Hieu Nguyen</p>
                </NavLink>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
