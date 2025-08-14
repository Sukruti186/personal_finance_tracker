import React, { useEffect, useState } from 'react';
import {useUserAuth} from "../../hooks/useUserAuth";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../Utils/apiPaths';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';

const Expense = () => {
  useUserAuth();

  const [expenseData,setExpenseData]=useState([]);
    const [loading,setLoading]=useState(false);
    const [openDeleteAlert,setOpenDeleteAlert]=useState({
      show:false,
      data:null,
  });
  
  const[openAddExpenseModel, setOpenAddExpenseModel]=useState(false);

  //Get All Expense details
  const fetchExpenseDetails=async()=>{
    if(loading) return;

    setLoading(true);

    try{
      const response=await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if(response.data){
        setExpenseData(response.data);
      }
    }catch(error){
      console.log("Something went wrong. please try again",error)
    }finally{
      setLoading(false);
    }
  };

  //handle Add Expense details
  const handleAddExpense=async(expense)=>{
    const{category,amount,date,icon}=expense;
    //Validation checks
    if(!category.trim()){
      toast.error("category is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount)<=0){
      toast.error("Amount should be a valid number greter than 0");
      return;
    }

    if(!date){
      toast.error("Date is required");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    }catch(error){
      console.error("Error adding expense:",
        error.response?.date?.message || error.message
      );
    }
  };

  useEffect(()=>{
    fetchExpenseDetails();

    return()=>{};
  },[]);


  
  return (
     <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-6 gap-6">
          <div className="">
            <ExpenseOverview 
            transactions={expenseData}
            onExpenseIncome={()=> setOpenAddExpenseModel(true)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Expense
