import { Link } from 'react-router-dom';
import he from 'he';
import './style.scss'

function PostEdit(props) {

    const convertDate = (date) => {
        const timestamp = Date.parse(date)
        return new Date(timestamp).toLocaleString();
    }

    const handleNav = () => {
        window.open(`https://www.example.com/${props.id}`, '_blank')
    }

    return (
        <div className='post'>
            <div onClick={handleNav} className='post-content'>
                <div className='content-header'>
                <div className='post-title'>
                    {props.title} 
                </div>
                <div className='post-date'>
                    {convertDate(props.timestamp)}
                </div>
                </div>

                <div className='post-content-area'>
                    {he.decode(props.content)}
                </div>
            </div>
            <div className='post-edit'>
                <div className='control'>
                    <Link to={`/edit/${props.id}`}>
                        <button>Edit post</button>
                    </Link>
                    <button onClick={() => { props.togglePublish(props.id, props.title, props.content, props.published) }}>{props.published ? 'Unpublish' : 'Publish'}</button>
                </div>
                <div>
                Last edited: {convertDate(props.lastEdited)}
                </div>
            </div>
        </div>  
    );
}
  
export default PostEdit;