import './style.scss'
import { useAuth } from '../use-auth';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

function Create(props) {

    const auth = useAuth();

    let history = useHistory();

    useEffect(() => {
        if(!auth.user){
          history.push('/login')
        }
    }, [auth.user, history])

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleContent = (e) => {
        e.target.style.height = "5px";
        e.target.style.height = (e.target.scrollHeight)+"px";
        setContent(e.target.value)
    }

    const handleTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        try{

            await axios.post('http://localhost:5000/posts',
            {
              title: title,
              content: content
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`  
              }
            });
            history.push('/dashboard')

        }catch(error){
            return
        }

    }

    return (
        <div className='create-wrap'>
            <div className='inner-wrap'>
                <header>
                    <h1>Create Post</h1>
                    <button onClick={auth.signout}>sign out</button>
                </header>

                <main>
                    <form onSubmit={handleSubmit} >
                        <div className='title-area'>
                            <h2>Post title</h2>
                            <input onInput={handleTitle} value={title} type='text' placeholder='Enter post title here' required='required' />
                        </div>

                        <div className='content-area'>
                            <h2>Content</h2>
                            <textarea onInput={handleContent} value={content} placeholder='content here' required='required'></textarea>
                        </div>

                        <button type='submit'>Submit</button>
                    </form>
                </main>
            </div>
        </div>  
    );
}
  
export default Create;