import React,{useState} from 'react';
import axios from 'axios';

import newPostStyle from './newPostStyle';

import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import List from '@material-ui/icons/List';
import Title from '@material-ui/icons/Title';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import VerticalAlignTop from '@material-ui/icons/VerticalAlignTop';
import Notes from '@material-ui/icons/Notes';

const style = (theme) => newPostStyle;

function NewPost(props){

    const [id, setId] = useState(0);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [isToolBarOpen, setIsToolBarOpen] = useState(false);

    const [post, setPost] = useState([]);

    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const publishPost = () => {
        axios.post('/api/publish',{title, description, post}).then(results => {
            setSnackbarMessage(results.data.message);
            setIsSnackbarOpen(true);
            setTitle('');
            setDescription('');
            post=[];
            setPost([...post]);
        });
    }

    const saveAsDraft = () => {
        axios.post('/api/savedraft', {title, description, post, id}).then(results => {
            setSnackbarMessage(results.data.message);
            setIsSnackbarOpen(true);
            setId(results.data.id);
        })
    }

    const changeTitle = (e) => {
        setTitle(e.target.value)
    }

    const changeDescription = (e) => {
        setDescription(e.target.value);
    }

    const toggleToolBar = () => {
        if(isToolBarOpen) setIsToolBarOpen(false);
        else              setIsToolBarOpen(true);
    }
    
    //All the methods relating to post go here

    const addParagraph = () => {
        const updatedPost =[...post, {type:'paragraph', content:''}]
        setPost(updatedPost)
        toggleToolBar();
    }

    const changeParagraph = (index, change) => {
        let placeholder = post;
        placeholder[index].content = change;
        setPost([...placeholder]);
    }

    const addHeader = () => {
        post.push({type:'header', content:''})
        setPost([...post])
        toggleToolBar();
    }

    const addListUL = () => {
        const updatedPost = [...post, {type:'list-ul', content:['']}]
        setPost(updatedPost)
        toggleToolBar();
    }

    const addListUL_item = (index) => {
        let placeholder = post;
        placeholder[index].content.push('');
        setPost([...placeholder]);
    }

    const editListUL_item = (postIndex, listIndex, change) => {
        post[postIndex].content[listIndex] = change;
        setPost([...post]);
    }

    const handleListUL_drop = (event, postIndex, listIndex) => {
        event.preventDefault();

        const dropIndex = listIndex;
        const draggedIndex = +event.dataTransfer.mozSourceNode.id;

        const placeholder = post[postIndex].content[listIndex];

        post[postIndex].content[listIndex]=post[postIndex].content[draggedIndex];
        post[postIndex].content[draggedIndex]=placeholder;

        setPost([...post]);
        
        console.log(dropIndex, draggedIndex)
    }

    const addImage = () => {
        
    }

    const addDivider = () => {
        post.push({type:'divider', content:''});
        setPost([...post]);
        toggleToolBar();
    }

    const handleListKeyPress = (index, event, listIndex) => {
        if(event.keyCode === 13){
            addListUL_item(index)
        }
        else if(event.keyCode === 8 && post[index].content.length === 1 && post[index].content[0] === ''){
            event.preventDefault()
            deleteComponent(index)
        }
        else if(event.keyCode === 8 && post[index].content[listIndex] === ''){
            event.preventDefault();
            deleteListItem(index, listIndex);
        }
    }

    const handleTextKeyPress = (index, event) => {
        if(event.keyCode === 8 && post[index].content === ''){
            event.preventDefault()
            deleteComponent(index)
        }
    }

    const deleteComponent = (index) => {
        post.splice(index, 1);
        setPost([...post]);
    }

    const deleteListItem = (postIndex, listIndex) => {
        post[postIndex].content.splice(listIndex,1);
        document.getElementById(`${postIndex}${listIndex-1}`).focus();
        setPost([...post]);
    }

    const handleDragStart = (event, type, id) => {
        event.dataTransfer.setData(type, event.target.id);
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDrop = (event, i) => {
        event.preventDefault();
        const dropIndex = i;
        const draggedIndex = +event.dataTransfer.mozSourceNode.id;
        
        const placeholder = post[dropIndex];

        post[dropIndex] = post[draggedIndex];

        post[draggedIndex]=placeholder;

        setPost([...post]);
    }

    return(
        <div>
            <div className={props.classes.postContent}>
            <Input disableUnderline fullWidth value={title} placeholder='Title goes here...' onChange={(e)=>changeTitle(e)} className={props.classes.title}/>
            <Input disableUnderline fullWidth multiline value={description} placeholder='1-2 sentence description' onChange={(e)=>changeDescription(e)} className={props.classes.description} />
            
            <Divider></Divider>

            {
                post.map((val, i) => {

                    if(val.type === 'paragraph'){
                        return(
                            <div 
                                className={props.classes.paragraphDiv}
                                draggable 
                                onDragStart={(e)=>handleDragStart(e, "text", i)} 
                                onDragOver={(e)=>handleDragOver(e)} 
                                onDrop={(e)=>handleDrop(e, i)}
                                id={i}
                            >
                                <Input disableUnderline autoFocus fullWidth multiline value={val.content} placeholder='Paragraph' onChange={(e)=>changeParagraph(i, e.target.value)} onKeyDown={(e)=>handleTextKeyPress(i, e)}/> 
                            </div>
                        )
                    }

                    else if(val.type === 'header'){
                        return(
                            <div className={props.classes.headerDiv}
                                draggable 
                                onDragStart={(e)=>handleDragStart(e, "text", i)} 
                                onDragOver={(e)=>handleDragOver(e)} 
                                onDrop={(e)=>handleDrop(e, i)}
                                id={i}>
                                <Input disableUnderline autoFocus fullWidth value={val.content} placeholder='Header' onChange={(e)=>changeParagraph(i, e.target.value)} className={props.classes.header}/>
                            </div>
                        )
                    }

                    else if(val.type === 'list-ul'){
                        return(
                            <div className={props.classes.listDiv}
                                draggable
                                onDragStart={(e)=>handleDragStart(e, "array", i)} 
                                onDragOver={(e)=>handleDragOver(e)} 
                                onDrop={(e)=>handleDrop(e, i)}
                                id={i}>

                                <IconButton onClick={()=>addListUL_item(i)}>+</IconButton>
                                <ul style={{width:'100%'}}>
                                    {
                                        val.content.map((listitem, listIndex) => {
                                        return (<li 
                                                    draggable
                                                    onDragStart={(e)=>handleDragStart(e, "text", i)}
                                                    onDragOver={(e)=>handleDragOver(e)}
                                                    onDrop={(e)=>handleListUL_drop(e, i, listIndex)}
                                                    id={listIndex}
                                                >
                                                    <Input 
                                                        disableUnderline 
                                                        fullWidth
                                                        autoFocus 
                                                        value={listitem} 
                                                        placeholder='List Item' 
                                                        id={`${i}${listIndex}`}
                                                        onChange={(e)=>editListUL_item(i, listIndex, e.target.value)}
                                                        onKeyDown={(e)=>handleListKeyPress(i, e, listIndex)}
                                                    />
                                                </li>)
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    }
                    
                    else if(val.type === 'image'){
                        return(
                            <div className={props.classes.imageDiv}
                                draggable
                                onDragStart={(e)=>handleDragStart(e, "array", i)} 
                                onDragOver={(e)=>handleDragOver(e)} 
                                onDrop={(e)=>handleDrop(e, i)}
                                id={i}>

                                <img src={val.content} />
                            </div>
                        )
                    }

                    else if(val.type === 'divider'){
                        return(
                            <div className={props.classes.dividerDiv}
                                draggable
                                onDragStart={(e)=>handleDragStart(e, "array", i)} 
                                onDragOver={(e)=>handleDragOver(e)} 
                                onDrop={(e)=>handleDrop(e, i)}
                                id={i}>
                                <div className={props.classes.divider}></div>
                            </div>
                        )
                    }
                    
                })
            }
            </div>

            <div className={props.classes.toolbar}>
                <IconButton onClick={()=>toggleToolBar()}>+</IconButton>
                {
                    isToolBarOpen ? 
                    (
                    <div>
                        <Tooltip title='Header'><IconButton onClick={()=>addHeader()}><Title /></IconButton></Tooltip>
                        <Tooltip title='Paragraph'><IconButton onClick={()=>addParagraph()}><Notes /></IconButton></Tooltip>
                        <Tooltip title='List'><IconButton onClick={()=>addListUL()}><List /></IconButton></Tooltip>
                        <Tooltip title='Image'><IconButton onClick={()=>addImage()}><AddAPhoto /></IconButton></Tooltip>
                        <Tooltip title='Divider'><IconButton onClick={()=>addDivider()}><VerticalAlignTop /></IconButton></Tooltip>
                    </div>
                    ) 
                    : 
                    <div></div>
                }
            </div>

            <Snackbar 
             open={isSnackbarOpen}
             message={<h3>{snackbarMessage}</h3>}
             autoHideDuration={2000}
             onClose={()=>setIsSnackbarOpen(false)} />
            
            <Button onClick={()=>saveAsDraft()}>Save as Draft</Button>
            <Button onClick={()=>publishPost()}>Publish</Button>
            
        </div>
    )
}

export default withStyles(style)(NewPost);