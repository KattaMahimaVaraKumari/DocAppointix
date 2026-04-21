import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios'

const AddDoctor = () => {

    const [docImg,setDocImg]=useState(false);
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [yearsOfExperience,setYearsOfExperience]=useState(1);
    const [experience,setExperience]=useState('1 Year');
    const [fees,setFees]=useState('');
    const [about,setAbout]=useState('');
    const [speciality,setSpeciality]=useState('General physician');
    const [degree,setDegree]=useState('');
    const [address1,setAddress1]=useState('');
    const [address2,setAddress2]=useState('');
    const [city,setCity]=useState('');
    const [state,setState]=useState('');
    const [country,setCountry]=useState('');
    const [pincode,setPincode]=useState('');

    const { backendUrl, aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) {
                return toast.error('Image Not Selected')
            }
            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('yearsOfExperience', Number(yearsOfExperience));
            formData.append('fees', Number(fees));
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('about', about);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2, city, state, country, pincode }));

            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`)
            })

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName('');
                setPassword('');
                setEmail('');
                setAddress1('');
                setAddress2('');
                setCity('');
                setState('');
                setCountry('');
                setPincode('');
                setDegree('');
                setAbout('');
                setFees('');
                setYearsOfExperience(1);
                setExperience('1 Year');
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-semibold text-gray-800'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border border-blue-100 shadow-xl rounded-2xl w-full max-w-5xl max-h-[80vh] overflow-y-scroll'>

                {/* Profile Picture Section */}
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-18 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    {/* --- LEFT COLUMN --- */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-200 rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-200 rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Years of Experience</p>
                            <input
                                onChange={(e) => {
                                    const years = Number(e.target.value) || 1;
                                    setYearsOfExperience(years);
                                    setExperience(`${years} ${years > 1 ? 'Years' : 'Year'}`);
                                }}
                                value={yearsOfExperience}
                                min={1}
                                className='border border-gray-200 rounded px-3 py-2'
                                type="number"
                                placeholder='Years'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border border-gray-200 rounded px-3 py-2' type="number" placeholder='Fees' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border border-gray-200 rounded px-3 py-2'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='Education' required />
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <p className='font-medium text-gray-800'>Address Details</p>

                        <div className='flex flex-col gap-2'>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='Address line 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='Address line 2' required />
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                            <div className='flex flex-col gap-1'>
                                <p>City</p>
                                <input onChange={(e) => setCity(e.target.value)} value={city} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='City' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p>State</p>
                                <input onChange={(e) => setState(e.target.value)} value={state} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='State' required />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                            <div className='flex flex-col gap-1'>
                                <p>Country</p>
                                <input onChange={(e) => setCountry(e.target.value)} value={country} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='Country' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p>Pincode</p>
                                <input onChange={(e) => setPincode(e.target.value)} value={pincode} className='border border-gray-200 rounded px-3 py-2' type="text" placeholder='Pincode' required />
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 mt-2'>
                            <p>About Doctor</p>
                            <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 py-2 rounded border border-gray-200' placeholder='Write about doctor' rows={4} required></textarea>
                        </div>

                        <button type='submit' className='bg-[#3B82F6] w-full py-3 mt-4 text-white rounded-lg cursor-pointer hover:bg-[#2563EB] transition-all duration-300'>Add doctor</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AddDoctor
