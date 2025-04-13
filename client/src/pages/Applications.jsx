import React, { useContext, useEffect, useState } from 'react';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Navbar from '../components/Navbar';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Applications = () => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isEdit, setIsEdit] = useState(false);
    const [resume, setResume] = useState(null);

    const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext);

    const STATUS = {
        PENDING: 'Pending',
        REJECTED: 'Rejected',
        ACCEPTED: 'Accepted',
    };

    const updateResume = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.post(
                backendUrl + '/api/users/update-resume',
                { resume },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (data.success) {
                toast.success(data.message);
                await fetchUserData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }

        setIsEdit(false);
        setResume(null);
    };

    useEffect(() => {
        if (user) {
            fetchUserApplications();
        }
    }, [user]);

    return (
        <>
            <Navbar />
            <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
                <h2 className="text-xl font-semibold">Your Resume</h2>
                <div className="flex gap-2 mb-6 mt-3">
                    {isEdit || (userData && userData.resume === '') ? (
                        <>
                            <label className="flex items-center" htmlFor="resumeUpload">
                                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 cursor-pointer">
                                    {resume ? resume.name : 'Select Resume'}
                                </p>
                                <input
                                    id="resumeUpload"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    accept="application/pdf"
                                    type="file"
                                    hidden
                                />
                                <img className="cursor-pointer" src={assets.profile_upload_icon} />
                            </label>
                            <button
                                onClick={updateResume}
                                className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 cursor-pointer"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <a
                                target="_blank"
                                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg cursor-pointer"
                                href={userData.resume}
                            >
                                Resume
                            </a>
                            <button
                                onClick={() => setIsEdit(true)}
                                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-semibold mb-4">Job Applied</h2>
                <table className="min-w-full bg-white border border-gray-400 border-b-0 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-400 text-left">Company</th>
                            <th className="py-3 px-4 border-b border-gray-400 text-left">Job Title</th>
                            <th className="py-3 px-4 border-b border-gray-400 text-left max-sm:hidden">Location</th>
                            <th className="py-3 px-4 border-b border-gray-400 text-left max-sm:hidden">Date</th>
                            <th className="py-3 px-4 border-b border-gray-400 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userApplications.map((job, index) =>
                            true ? (
                                <tr key={index}>
                                    <td className="py-3 px-4 flex items-center gap-2 border-b border-gray-400">
                                        <img className="w-8 h-8" src={job.companyId.image} />
                                        {job.companyId.name}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-400">{job.jobId.title}</td>
                                    <td className="py-2 px-4 border-b border-gray-400 max-sm:hidden">
                                        {job.jobId.location}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-400 max-sm:hidden">
                                        {moment(job.date).format('ll')}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-400">
                                        <span
                                            className={`${
                                                job.status === STATUS.ACCEPTED
                                                    ? 'bg-green-100'
                                                    : job.status === STATUS.REJECTED
                                                    ? 'bg-red-100'
                                                    : 'bg-blue-100'
                                            } px-4 py-1.5 rounded`}
                                        >
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ) : null,
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Applications;
