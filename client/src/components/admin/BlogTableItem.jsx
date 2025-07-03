import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import toast, { Toaster } from 'react-hot-toast';

const BlogTableItem = ({blog, fetchblog, index}) => {

    const {title, createdAt} = blog;
    const blogDate = new Date(createdAt);

    const {axios} = useContext(AppContext);

    const deleteBlog = async () => {
      const confirm = window.confirm("Are you sure you want to delete this blog?");
      if(!confirm){
        return;
      }
      try {
        const {data} = await axios.post("/api/blog/delete", {id: blog._id});
        if(data.success){
          toast.success(data.message);
          await fetchblog();
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    const togglepublish = async () => {
      try {
        const {data} = await axios.post("/api/blog/toggle-publish", {id: blog._id});
        if(data.success){
          toast.success(data.message);
          await fetchblog();
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    useEffect(() => {fetchblog()},[])

  return (
    <tr className="border-y border-gray-300">
        <th className='px-2 py-4 xl:px-6'>{index}</th>
        <td className='px-2 py-4'>{title}</td>
        <td className='px-2 py-4 max-sm:hidden'>{blogDate.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'><p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}>{blog.isPublished ? "Published" : "Unpublished"}</p></td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={togglepublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>{blog.isPublished ? "Unpublish" : "Publish"}</button>
            <img onClick={deleteBlog} src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt="" />
        </td>

    </tr>
  )
}

export default BlogTableItem