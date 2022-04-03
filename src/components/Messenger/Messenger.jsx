import React, { useEffect, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { createMessage, fetchUser } from '../../API';
import { useDispatch, useSelector } from 'react-redux';
import { addMessages } from '../../features/messageSlice';
import SingleChat from '../SingleChat/SingleChat';
import Input from '../Input/Input';
import { dp } from '../../assets';
import './messenger.css';

const Messenger = () => {
	const {
		user: { token },
		message: { messages, conversationID, to },
		socket: { socket },
		users: { usersOnline },
	} = useSelector(state => state);

	const customFetch = useFetch();
	const dispatch = useDispatch();
	const scroll = useRef();
	const [receiver, setReceiver] = useState({});

	useEffect(() => {
		if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
	}, [messages]);

	useEffect(() => {
		(async () => {
			if (conversationID) {
				let data = await customFetch(fetchUser, to, token);
				if (data) setReceiver(data.user);
			}
		})();
	}, [conversationID, customFetch, token, to]);

	const submitHandler = async message => {
		socket.emit('send message', message, to);
		dispatch(addMessages({ text: message, send: true }));
		await customFetch(createMessage, conversationID, message, token);
	};

	return (
		<section className='chat__page__messenger'>
			{conversationID ? (
				<>
					<header>
						<img src={receiver.profileImage || dp} alt='chatIcon' />
						<div>
							<h3>{receiver.name}</h3>
							{usersOnline.some(u => u.id === receiver._id) && <p>Online</p>}
						</div>
					</header>
					<main ref={scroll}>
						<div className='messenger'>
							{messages.map((message, i, messages) => {
								return (
									<SingleChat
										key={i}
										message={message}
										index={i}
										messages={messages}
									/>
								);
							})}
						</div>
					</main>
					<footer>
						<Input placeholder='Type a message...' handler={submitHandler} />
					</footer>
				</>
			) : (
				<h4>Select a conversation</h4>
			)}
		</section>
	);
};

export default Messenger;
