import * as React from 'react';

export function Post() {
    const [post, setPost] = React.useState('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setPost(e.target.value);
    const onSubmit = () => console.log(post, 'POST')

    return (
        <div>
            <h3>Post here</h3>
            <input value={post} onChange={onChange}/>
            <button onClick={onSubmit}>Post</button>
        </div>
    )
}