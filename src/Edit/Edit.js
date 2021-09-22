import './style.scss'
import { useAuth } from '../use-auth';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import axios from 'axios';

function Create(props) {

    const auth = useAuth();
    let history = useHistory();
    let { id } = useParams();

    useEffect(() => {
        if(!auth.user){
          history.push('/login')
        }
    }, [auth.user, history])

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        const fetchPost = async () => {
            if(!id) return
    
            try{
    
                let postData = await axios.get(`http://localhost:5000/posts/${id}`)
                setTitle(postData.data.title)
                setContent(postData.data.content)
    
            }catch(error){
                console.log(error)
            }
        }

        fetchPost()
    }, [id])

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

            await axios.put(`http://localhost:5000/posts/${id}`,
            {
              title: title,
              content: content,
              published: false
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
                    <h1>Edit Post</h1>
                    <button onClick={auth.signout}>sign out</button>
                </header>

                <main>
                    <form onSubmit={handleSubmit} >
                        <div className='title-area'>
                            <h2>Edit title</h2>
                            <input onInput={handleTitle} value={title} type='text' placeholder='Enter post title here' required='required' />
                        </div>

                        <div className='content-area'>
                            <h2>Edit Content</h2>
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