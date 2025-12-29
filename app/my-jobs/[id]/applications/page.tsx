'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';

interface Application {
    _id: string;
    applicant_name: string;
    applicant_email: string;
    match_score: number;
    ai_feedback: string;
    applied_at: string;
}

export default function JobApplications() {
    const { id } = useParams(); 
    const [apps, setApps] = useState<Application[]>([]);
    
    useEffect(() => {
        const fetchApps = async () => {
             const res = await api.get(`/applications/${id}`);
             setApps(res.data);
        };
        if(id) fetchApps();
    }, [id]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-100 text-green-800";
        if (score >= 50) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Applicant Rankings</h1>
            
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Candidate</th>
                            <th className="p-4">AI Score</th>
                            <th className="p-4">AI Feedback</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {apps.map(app => (
                            <tr key={app._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-bold">{app.applicant_name}</div>
                                    <div className="text-sm text-gray-500">{app.applicant_email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full font-bold ${getScoreColor(app.match_score)}`}>
                                        {app.match_score}%
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600 max-w-md">
                                    {app.ai_feedback}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {apps.length === 0 && <div className="p-8 text-center text-gray-500">No applications yet.</div>}
            </div>
        </div>
    );
}