import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss/tailwind.css';

function WeightTracker() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState('');
    const [bodyFat, setBodyFat] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        console.log({ selectedDate, weight, bodyFat, bmi });
    };

    return (
        <div className="flex justify-center bg-gray-800 min-h-screen">
            <div className="p-4 max-w-sm w-full mt-10 md:mt-20">
                <h1 className="text-xl font-bold mb-6 text-center text-white">Log Weight</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="mb-6 w-full">
                        <label className="block text-sm font-bold mb-2 text-white">
                            Date
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-6 w-full">
                        <label className="block text-sm font-bold mb-2 text-white">
                            Weight (lbs)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter weight in pounds"
                        />
                    </div>

                    <div className="mb-6 w-full">
                        <label className="block text-sm font-bold mb-2 text-white">
                            BMI
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={bmi}
                            onChange={e => setBmi(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter BMI"
                        />
                    </div>

                    <div className="mb-6 w-full">
                        <label className="block text-sm font-bold mb-2 text-white">
                            Body Fat Percentage (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={bodyFat}
                            onChange={e => setBodyFat(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter body fat %"
                        />
                    </div>

                    <div className="mb-10 w-full">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 w-full rounded focus:outline-none focus:shadow-outline">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WeightTracker;
