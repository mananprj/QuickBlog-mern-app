import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from "marked"

const AddBlog = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null); 

  const {axios} = useContext(AppContext);

  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [image, setimage] = useState(false);
  const [title, settitle] = useState("");
  const [subTitle, setsubTitle] = useState("");
  const [category, setcategory] = useState("Startup");
  const [isPublished, setisPublished] = useState(false);

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      const blog = {
        title, subTitle, description: quillRef.current.root.innerHTML, category, isPublished
      }
      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const {data} = await axios.post("/api/blog/add", formData);
    
      if(data.success){
        toast.success(data.message);
        setimage(false);
        settitle("");
        quillRef.current.root.innerHTML = "";
        setcategory("Startup");
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setAdding(false);
    }
  }

  const generateContent = async () => {
    if(!title) return toast.error("Please enter a title");

    try {
      setLoading(true);
      const {data} = await axios.post("/api/blog/generate", {prompt: title});
      if(data.success){
        quillRef.current.root.innerHTML = parse(data.content);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if(!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  })

  return (
    <form onSubmit={submithandler} className='flex-1 bg-blue-50/20 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} className='mt-5 h-16 rounded cursor-pointer' alt="" />
          <input onChange={(e) => setimage(e.target.files[0])} type="file" id='image' hidden required />
        </label>

        <p className='mt-8'>Blog Title</p>
        <input type="text" placeholder='Type here' className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' required onChange={(e) => settitle(e.target.value)} value={title}/>

        <p className='mt-4'>Sub Title</p>
        <input type="text" placeholder='Type here' className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' required onChange={(e) => setsubTitle(e.target.value)} value={subTitle}/>

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
            <div ref={editorRef}></div>
            {loading && (
              <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
                  <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
              </div>
            )}
            <button disabled={loading} type='button' onClick={generateContent} className='absolute bottom-1 right-2 text-xs ml-2 text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>Generate with AI</button>
        </div>

        <p className='mt-4'>Blog Category</p>
        <select onChange={(e) => setcategory(e.target.value)} value={category} name="category" className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
          <option value="">Select Category</option>
          {blogCategories.map((category, index) => {  
            return <option key={index} value={category}>{category}</option>
          })}
        </select>

        <div className='flex gap-2 mt-7'>
          <p>Publish Now</p>
          <input type="checkbox" className='scale-125 cursor-pointer' checked={isPublished} onChange={(e)=>setisPublished(e.target.checked)}/>
        </div>

        <button disabled={adding} type='submit' className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm hover:bg-primary/90 hover:scale-105 transition-all'>{adding ? "Adding..." : "Add Blog"}</button>

      </div>
    </form>
  )
}

export default AddBlog