import { adminApi, DeleteApi, getterFunction, posterFunction, updaterFunction } from '@/Api';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from React Icons
import Swal from 'sweetalert2';

const Sliders = () => {
  const [data, setData] = useState([]);
  const [newSlider, setNewSlider] = useState({
    image: '',
    title: '',
    sliderType: '',
    id: '',
    rank: 0,
  });
  const [editSlide, setEditSlide] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    getSliders();
  }, []);

  

  const getSliders = async () => {
    try {
      const res = await getterFunction(adminApi.sliders);
      setData(res);
    } catch (e) {
      console.error(e);
    }
  };

  const createSlider = async () => {
    try {
      const res = await posterFunction(adminApi.sliders, newSlider);
      if (res) {
        setNewSlider({
          image: '',
          title: '',
          sliderType: '',
          id: '',
          rank: 0,
        });
        setIsModalOpen(false); // Close modal after creation
        getSliders(); // Refresh the list
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlider((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const handleDelete = async(id)=>{
    try{
      const res = await DeleteApi(`${adminApi.sliders}/${id}`);
      Swal.fire({
        title : 'Deleted', 
        icon :'success',
      })
      getSliders();
      
    }catch(e){
      console.error(e);
    }
   }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateSlide = async()=>{
    try{
      const res = await updaterFunction(`${adminApi.sliders}`,  newSlider);
      if(res){
        setEditSlide(null);
        setIsModalOpen(false);
        getSliders();
      }
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sliders Management</h1>

      {/* Button to Open Modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition duration-300"
      >
        <FaPlus className="mr-2" /> Create New Slider
      </button>

      {/* Modal for Creating Slider */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Slider</h2>
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newSlider.image}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newSlider.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              name="sliderType"
              placeholder="Slider Type"
              value={newSlider.sliderType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={newSlider.id}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="number"
              name="rank"
              placeholder="Rank"
              value={newSlider.rank}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={createSlider}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Existing Sliders */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Sliders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((slider) => (
            <div
              key={slider.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={slider.image}
                alt={slider.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{slider.title}</h3>
              <p className="text-gray-600">Type: {slider.sliderType}</p>
              <p className="text-gray-600">Rank: {slider.rank}</p>
              <div className="flex mt-4">
                <button onClick={()=>setEditSlide(slider)} className="text-blue-500 hover:text-blue-700 mr-4">
                  <FaEdit />
                </button>
                <button onClick={()=>handleDelete(slider._id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Slider</h2>
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={editSlide.image}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editSlide.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              name="sliderType"
              placeholder="Slider Type"
              value={editSlide.sliderType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={editSlide.id}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="number"
              name="rank"
              placeholder="Rank"
              value={editSlide.rank}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={updateslider}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Sliders;