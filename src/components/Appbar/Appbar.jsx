import React, { useState } from "react";
import { dp, logoutIcon, closeIcon, searchIcon, hamburger, chatIcon, homeIcon } from "../../assets";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/userSlice";
import { toggleSidebar } from "../../features/modalSlice";
import useFetch from "../../hooks/useFetch";
import SearchResults from "../SearchResults/SearchResults";
import { fetchUsersService } from "../../services/userServices";
import { fetchPostsService } from "../../services/postServices";
import "./appbar.css";

const Appbar = () => {
	//global states
	const {
		user: { id, profileImage },
		modal: { isSidebarVisible },
	} = useSelector(state => state);

	//local states
	const [query, setQuery] = useState("");
	const [searchResult, setSearchResult] = useState({});

	const dispatch = useDispatch();
	const customFetch = useFetch();

	const logoutHandler = () => {
		dispatch(logout());
	};

	const searchHandler = async e => {
		e.preventDefault();
		if (query.length > 0) {
			const { posts } = await customFetch(fetchPostsService, { query });
			const { users } = await customFetch(fetchUsersService, { query });
			setSearchResult({ posts, users });
		}
	};

	const reset = () => {
		setQuery("");
		setSearchResult({});
	};

	return (
		<header className="appbar">
			<div className="hamburger" onClick={() => dispatch(toggleSidebar(!isSidebarVisible))}>
				<img src={isSidebarVisible ? closeIcon : hamburger} alt="hamburger" />
			</div>
			<Link to="/">
				<img src={homeIcon} alt="home" className="home-icon" />
			</Link>
			<form onSubmit={searchHandler} className="searchform">
				<button type="submit" aria-label="search">
					<img src={searchIcon} alt="search" />
				</button>
				<input
					type="text"
					placeholder="Tap to search..."
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
				<button onClick={reset} type="button" aria-label="clear search">
					<img src={closeIcon} alt="close" className="close" />
				</button>
				{(searchResult.posts || searchResult.users) && (
					<SearchResults searchResult={searchResult} reset={reset} />
				)}
			</form>
			<nav className="appbar__profile">
				<Link to={`/user/${id}`}>
					<img src={profileImage || dp} alt="profileImage" className="appbar__profile__dp" title="profile" />
				</Link>
				<Link to="/chat">
					<img src={chatIcon} alt="chat" className="chat" />
				</Link>
				<button onClick={logoutHandler} aria-label="logout">
					<img src={logoutIcon} alt="logoutIcon" className="appbar__profile__logout" title="logout" />
				</button>
			</nav>
		</header>
	);
};

export default Appbar;
