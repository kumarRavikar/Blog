import { useRef, useState,useEffect, useReducer } from "react";
import { db } from "./fireBaseInit";
import { collection,doc,setDoc, onSnapshot,deleteDoc } from "firebase/firestore"; 


function blogsReducer(state,action){
  switch(action.type){//action.type is comes from the dispatch
     case "ADD":
        return [action.blog,...state] //action.blog also come from the dispatchand and state have all the blogs
     case "REMOVE":
        return state.filter((blog,id)=>id !== action.id); //action.index is come from dispatch in remove function
     case "SET":
        return action.blogs   //this SET created for the seting a blogd which we retrive fron data base 
     default:
        return []
  }
}
//Blogging App using Hooks
export default function Blog(){
    // const [title,setTitle] =useState("");
    // const [content, setContent] = useState("");
    const[formData, setFormData]=useState({title:"",content:""})
    //const [blogs, setBlogs] = useState([])
    const [blogs, dispatch] = useReducer(blogsReducer, [])
    const titleRef = useRef(null);
    useEffect(()=>{
        titleRef.current.focus(); //Adding focus on title when the page renders for the first time
    },[])
    useEffect(()=>{
              onSnapshot(collection(db, "blogs"),(snapshot)=>{
              const blogsData =  snapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          return{
            id : doc.id,
            ...doc.data() //holds all the data inside the database
          }
            });
            dispatch({type:"SET", blogs:blogsData})//this will set the retrive data from the data base 
            });
    },[])
    useEffect(()=>{
        if(blogs.length && blogs[0].title){ //seting blog title to the page title and if blog has not title then it will set to "No Blogs"
            document.title = blogs[0].title
        }else{
            document.title = "No Blogs"
        }
    },[blogs])
    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();
      //  setBlogs([{title:formData.title,content:formData.content},...blogs]) //setting a blog when add button is clicked
      dispatch({type:"ADD",blog:{title:formData.title,content:formData.content}}) //setting a blog when add button is clicked using useReducer()
       setFormData({title:"",content:""})
       titleRef.current.focus();
       // Add a new document with a generated id.
       const docRef = doc(collection(db, "blogs"))
             await setDoc(docRef, {
             title: formData.title,
            content: formData.content,
            createdOn:new Date()
           });
          //console.log("Document written with ID: ", docRef.id);
    }
   async function removeBlog(id){
       // setBlogs(blogs.filter((blog,index)=>i !==index)) //setting a blog when delet button is clicked 
       const docRef = doc(db,"blogs",id)
       await deleteDoc(docRef);
       dispatch({type:"REMOVE",id:id}) //setting a blog when delet button is clicked using useReducer()
    }

    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input"
                                placeholder="Enter the Title of the Blog here.."
                                value={formData.title}
                                ref={titleRef}
                                onChange={(e)=>setFormData({title:e.target.value, content:formData.content})}/>
                                
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content"
                                placeholder="Content of the Blog goes here.."
                                value={formData.content}
                                required
                                onChange={(e)=>setFormData({title:formData.title,content:e.target.value})}/>
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
        {blogs.map((blog,i)=>(
            <div className="blog" key={blog.id || i}>
             <h1>{blog.title}</h1>
             <p>{blog.content}</p>
             <div className="blog-btn">
                <button className=" btn remove" onClick={()=>removeBlog(blog.id)}>Delete</button>
             </div>
             
             </div>
        ))}
        </>
        )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}
