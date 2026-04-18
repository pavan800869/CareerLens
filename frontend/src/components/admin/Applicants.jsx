import React, { useEffect } from 'react'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                // store the job object with populated applications
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div className='max-w-6xl mx-auto my-10 px-4 fade-in'>
            <h1 className='font-semibold text-xl text-foreground mb-6'>Applicants</h1>
            <div className='glass-card p-4'>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants