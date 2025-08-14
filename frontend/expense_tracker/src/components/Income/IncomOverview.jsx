import React, { useEffect, useState } from 'react';
import {LuPlus} from "react-icons/lu";
import { CustomBarChart } from '../Charts/CustomBarChart';
import { prepareIncomBarChartData } from '../../Utils/helper';

export const IncomOverview = ({transactions,onAddIncome}) => {

    const[chartData,setChartData]=useState([]);
    useEffect(()=>{
        const result=prepareIncomBarChartData(transactions);
        setChartData(result);

        return()=>{};
    },[transactions]);
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <div className="">
            <h5 className="text-lg ">Income Overview</h5>
            <p className="text-xs text-gray-400 mt-0.5">
                Track your earnings over time and anlyze your income trends
            </p>
            </div>
            <button className='add-btn' onClick={onAddIncome}>
            <LuPlus className='text-lg' />
            Add Income
            </button>
        </div>

        <div className="mt-10">
            <CustomBarChart data={chartData}/> 
        </div>
    </div>
  );
};
