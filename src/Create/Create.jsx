import './style.scss';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../use-auth';

function Create() {
  const auth = useAuth();

  const history = useHistory();

  useEffect(() => {
    if (!auth.user) {
      history.push('/login');
    }
  }, [auth.user, history]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleContent = (e) => {
    e.target.style.height = '5px';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setContent(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('https://top-blog-jr.herokuapp.com/posts',
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
      history.push('/dashboard');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <div className="create-wrap">
      <div className="inner-wrap">
        <header>
          <h1>Create Post</h1>
          <button type="button" onClick={auth.signout}>sign out</button>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <div className="title-area">
              <h2>Post title</h2>
              <input onInput={handleTitle} value={title} type="text" placeholder="Enter post title here" required="required" />
            </div>

            <div className="content-area">
              <h2>Content</h2>
              <textarea onInput={handleContent} value={content} placeholder="content here" required="required" />
            </div>

            <button type="submit">Submit</button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Create;
