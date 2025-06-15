"use client"
import Image from "next/image";
import React, { useState } from "react";

// interface Schema{
//   type:string;
//   properties:{
//     [key:string]:{
//       type:"string"|"number"|"integer"|"boolean";
//     }
//   }
// }

export default function Home() {
  const [currentSchema, setCurrentSchema] = useState(null);
  const [formDataValid, setFormDataValid] = useState(false);
  const [formData, setFormData] = useState({});



  const createForm = (schema) => {
    const formContainer = document.getElementById('form');
    formContainer.innerHTML = ""; // Clear previous form

    const form = document.createElement("form");
 
    for (const key in schema.properties) {
      const field = schema.properties[key];
      const label = document.createElement("label");
      label.textContent = key;
      label.setAttribute("for", key);

      const input = document.createElement("input");

      input.name = key;
      input.value = "";
      setFormData({...formData, [key]:""})
      input.addEventListener("change", handleChange);
      input.type = "text";
   
      const ptag = document.createElement("p");
      ptag.id = key;


      form.appendChild(label);
      form.appendChild(input);
      form.appendChild(ptag);
      form.appendChild(document.createElement("br"));
    }
    formContainer.appendChild(form);
  }
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    console.log(name)
    console.log(value)
    const errortag = document.getElementById(name);
    // errortag.innerHTML = "hi hello welcome"
    const field = currentSchema.properties[name];
    if (field.type === "string"){

    }
    else if (field.type === "integer" || field.type === "number"){
      if(!Number.isInteger(Number(value))){
        errortag.innerHTML="required value is number"
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if (field.type === "email"){
      if(!isValidEmail(value)){
        errortag.innerHTML="email is invalid"
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if (field.type === "password"){
      if(!isValidPassword(password)){
        errortag.innerHTML="password is invalid"
      }
      else{
        errortag.innerHTML = ""
      }
     }
    }


  const isValidEmail = (email) =>{
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$%!*?]{8, 50}$/.test(password);
  }

  const submitForm = () => {

  }
  const showHistory = () => {

  }
  const exportCurrentSchema = () => {

  }
  const exportSchemaWithRestoredData = () => {

  }
  const processFile = (event) => {
    const file = event.target.files?.[0];

    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const schema = JSON.parse(e.target?.result);

          // Basic schema check
        if (schema.type !== "object" || typeof schema.properties !== "object") {
            alert("Invalid schema: Must have 'type: object' and 'properties'");
            return;
        }

        setCurrentSchema(schema);
       }
       catch (err) {
        alert("Invalid JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }



  return (
  <div className="min-h-screen mt-5 w-full">
    <div className="w-full flex flex-col">
      <div className="w-full  flex flex-col gap-5">
       <div className="flex flex-col justify-center items-center">
        <div className="">
        <h1 className="text-3xl font-semibold text-slate-700">{currentSchema == null ? "Import Json Schema": "Schema is Imported"}</h1>
        </div>
          
        <div className="">
        <input onChange={processFile}
        className="border-gray-500  text-3xl font-lg text-slate-700 cursor-pointer
         rounded-md" type='file' id='schemaFile' accept='.json'/>
        </div>
          
       </div>
       <div className="h-[1px] w-full bg-black"></div>

       <div className="flex flex-col gap-3 justify-center items-center">
          <div>
            <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' disabled={currentSchema == null ? true : false}
            onClick={()=> createForm(currentSchema)}>
              Create Form</button>
          </div>
          <div id='form' className="">
             {/* The form is created here */}
          </div>
          <div>
           <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' disabled={formDataValid}
            onClick={()=>submitForm()}>
              Submit
            </button>
          </div>
       </div>

       <div className="h-[1px] w-full bg-black"></div>

       <div className="flex justify-center items-center">
         <div className="flex flex-col justify-center items-center">
          <p className="text-xl font-bold text-blue-700">Show previously Submitted Data By clicking the button below</p>
          <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-2xl font-semibold text-white bg-blue-500 cursor-pointer 
            hover:bg-blue-700' onClick={()=>showHistory()}>button</button>
         </div>
         <div id='history'>
          
         </div>
       </div>
        
       <div className="h-[1px] w-full bg-black"></div>

       <div className="flex flex-col gap-3 justify-center items-center">
         <div className="flex flex-col justify-center items-center">
         <p className="text-slate-700 font-bold">Export current schema by clicking the button below</p>
         <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' onClick={()=>exportCurrentSchema()}>Export</button>
         </div>

         <div className='flex flex-col gap-3 justify-center items-center'>
         <p className="text-slate-700 font-bold">Export current schema with data by clicking the button below</p>
         <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' onClick={()=>exportSchemaWithRestoredData()}>Export with data</button>
         </div>
       </div>
      </div>
    </div>
  </div>
  );
}
