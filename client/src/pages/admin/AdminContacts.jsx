import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminContacts=() =>{
  const url = import.meta.env.VITE_BACKEND_URL;

  const [contacts, setContacts]=useState([]);

  console.log(contacts);


  const fetchContacts = async ()=>{
    try{
      const getUrl = url+"/contact/get";
      const res = await axios.get(getUrl);

      if(res.data.status){
        setContacts(res.data.contacts);
      }
    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchContacts()
  }, []);

  return (
    <div>
        <table className='w-full'>
          <thead className='border bg-purple-300'>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Message</td>
            </tr>
          </thead>
          <tbody>
          {contacts?.length > 0 &&
            contacts.map((ele) => (
              <tr>
                <td>{ele?.name}</td>
                <td>{ele.email}</td>
                <td>{ele.phone}</td>
                <td>{ele.message}</td>
              </tr>
            ))}
        </tbody>
        </table>
    </div>
  )
}

export default AdminContacts