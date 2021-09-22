/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
import './style.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostEdit from './Post/Post';
import { useAuth } from '../use-auth';

function Dash() {
  const auth = useAuth();

  // eslint-disable-next-line no-unused-vars
  const [postInfo, setPageInfo] = useState({
    all: 0, published: 0, unpublished: 0, pages: 0,
  });
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async (pageRequest) => {
    try {
      const postReturn = await axios.get(`http://localhost:5000/posts?page=${pageRequest}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
      setPosts(postReturn.data);
    } catch (error) {
      return error.response.data;
    }
    return true;
  };

  const fetchInfo = async () => {
    try {
      const infoReturn = await axios.get('http://localhost:5000/posts/info');

      infoReturn.data.unpublished = infoReturn.data.all - infoReturn.data.published;
      infoReturn.data.pages = Math.ceil(infoReturn.data.all / 10);

      const pageArray = [];
      for (let i = 1; i < infoReturn.data.pages + 1; i++) {
        pageArray.push(i);
      }

      setPages(pageArray);
      setPageInfo(infoReturn.data);
    } catch (error) {
      return error.response.data;
    }
    return true;
  };

  const togglePublish = async (id, title, content, published) => {
    const publish = !published;

    try {
      await axios.put(`http://localhost:5000/posts/${id}`,
        {
          title,
          content,
          published: publish,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });

      setPage(1);
      fetchPosts();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.user) {
      fetchPosts(page);
    }
  }, [page, auth.user]);

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="dash-wrap">
      <div className="inner-wrap">

        <header>
          <h1>Dashboard</h1>
          <button type="button" onClick={auth.signout}>sign out</button>
        </header>

        <main>

          <Link to="/create">
            <button type="button">
              create post
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-plus" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FF416C" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="12" y1="9" x2="12" y2="15" />
              </svg>
            </button>
          </Link>

          <div className="post-area">
            <div className="post-section">

              {posts.map((post) => (
                <PostEdit
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  content={post.content}
                  published={post.published}
                  timestamp={post.timestamp}
                  lastEdited={post.last_edited}
                  togglePublish={togglePublish}
                />
              ))}

            </div>

            <div className="post-nav">

              {pages.map((pageNum, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={index}
                  role="button"
                  className="nav-li"
                  onClick={() => setPage(pageNum)}
                  style={{
                    background: pageNum === page ? 'white' : 'none',
                    color: pageNum === page ? '#FF416C' : 'white',
                  }}
                >
                  {pageNum}
                </div>
              ))}

            </div>
          </div>

        </main>

      </div>
    </div>
  );
}

export default Dash;
