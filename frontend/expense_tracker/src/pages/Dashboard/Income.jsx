import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { IncomOverview } from '../../components/Income/IncomOverview';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import IncomList from '../../components/Income/IncomList';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();

  const [incomeData,setIncomeData]=useState([]);
  const [loading,setLoading]=useState(false);
  const [openDeleteAlert,setOpenDeleteAlert]=useState({
    show:false,
    data:null,
});

  const[openAddIncomeModel, setOpenAddIncomeModel]=useState(false);

  //Get All income details
  const fetchIncomeDetails=async()=>{
    if(loading) return;

    setLoading(true);

    try{
      const response=await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if(response.data){
        setIncomeData(response.data);
      }
    }catch(error){
      console.log("Something went wrong. please try again",error)
    }finally{
      setLoading(false);
    }
  };

  //handle Add income details
  const handleAddIncome=async(income)=>{
    const{source,amount,date,icon}=income;
    //Validation checks
    if(!source.trim()){
      toast.error("Source is required");
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModel(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    }catch(error){
      console.error("Error adding income:",
        error.response?.date?.message || error.message
      );
    }
  };

  //Delete income details
  const deleteIncome=async(id)=>{
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({show:false,data:null});
      toast.success("Income details delete successfully");
      fetchIncomeDetails();
    }catch(error){
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
  };

  //handle download income details
  const handleDownloadIncomeDetails=async()=>{
    try{
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType:"blob",
        }
      );

      //Create a url for the blob
      const url=window.URL.createObjectURL(new Blob ([response.data]));
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download","income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.log("Error downloding income details",error);
      toast.error("failed to download income details. please try again ");
    }
  };

  useEffect(()=>{
    fetchIncomeDetails();

    return()=>{};
  },[]);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className=''>
          <IncomOverview 
          transactions={incomeData}
          onAddIncome={()=> setOpenAddIncomeModel(true)}
          />
        </div>
        

        <IncomList 
        transactions={incomeData}
        onDelete={(id)=>{
          setOpenDeleteAlert({show:true,data:id});
        }}
        onDownload={handleDownloadIncomeDetails}
        />
        </div>

        <Modal 
        isOpen={openAddIncomeModel}
        onClose={()=>setOpenAddIncomeModel(false)}
        title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal 
        isOpen={openDeleteAlert.show}
        onClose={()=>setOpenDeleteAlert({show:false , data:null})}
        title="Delete Income">
          <DeleteAlert
           content="Are you sure to delete this income details "
           onDelete={()=>deleteIncome(openDeleteAlert.data)}
           />
        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Income
