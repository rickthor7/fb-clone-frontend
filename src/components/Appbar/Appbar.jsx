import React from "react";
import "./appbar.css";
import dp from "../../assets/dp.jpg";
import logout from "../../assets/logout.png";
import search from "../../assets/search.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as Logout } from "../../features/userSlice";

const Appbar = () => {
   const dispatch = useDispatch();
   const { id } = useSelector((state) => state.user);
   const { profileImage } = useSelector((state) => state.user);

   const logoutHandler = () => {
      dispatch(Logout());
   };
   return (
      <div className="appbar">
         <form>
            <button type="submit">
               <img src={search} alt="" />
            </button>
            <input type="text" placeholder="Tap to search..." />
         </form>
         <nav className="appbar__profile">
            <Link to={`/user/${id}`}>
               <img
                  src={profileImage || dp}
                  alt=""
                  className="appbar__profile__dp"
                  title="profile"
               />
            </Link>
            <button onClick={logoutHandler}>
               <img
                  src={logout}
                  alt=""
                  className="appbar__profile__logout"
                  title="logout"
               />
            </button>
         </nav>
      </div>
   );
};

export default Appbar;