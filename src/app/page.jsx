"use client"
import Image from "next/image";
import { getFormDataOfSchema, getSchemaByName, storeFormData, storeSchema } from './api';
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
  const [previousData, setPreviousData] = useState([]);
  



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
    setFormData(prev => ({
      ...prev, [name]:value
    }));
    console.log(name)
    console.log(value)
    const errortag = document.getElementById(name);
    // errortag.innerHTML = "hi hello welcome"
    const field = currentSchema.properties[name];
    if("type" in field){
      typeValidator(field.type, errortag, value);
    }
    if("min" in field){
      const minLength = field.min;
      if(value.length < minLength){
        errortag.innerHTML = `minimum length required is ${minLength} \n`
      }
      else{
        errortag.innerHTML = ""
      }
    }
    if("max" in field){
      const maxLength = field.min;
      if(value.length > maxLength){
        errortag.innerHTML = `maximum length required is ${maxLength} \n`
      }
      else{
        errortag.innerHTML = ""
      }
    }
    
    }

  const typeValidator = (type, errortag, value) => {
    if (type === "string"){
      errortag.innerHTML = ""
    }
    else if (type === "integer" || type === "number"){
      if(!Number.isInteger(Number(value))){
        errortag.innerHTML="required value is number \n"
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if (type === "email"){
      if(!isValidEmail(value)){
        errortag.innerHTML="email is invalid \n"
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if (type === "password"){
      errortag.innerHTML = "";
      if(!isValidPassword(password)){
      const p1 = document.createElement("p");
      p1.innerHTML = "at least one small letter is required"
      const p2 = document.createElement("p");
      p2.innerHTML = "at least one capital letter is required"
      const p3 = document.createElement("p");
      p3.innerHTML = "at least one digit letter is required"
      const p4 = document.createElement("p");
      p4.innerHTML = "at least one symbol letter is required"
    
        errortag.appendChild(p1);
        errortag.appendChild(p2);
        errortag.appendChild(p3);
        errortag.appendChild(p4);
      }
     }
  }

  const isValidEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email);
  }

  const isValidPassword = (password) => {
    return /[a-z]/.test(password) && /[@$!%*?&]/.test(password) && /\d/.test(password) && /[A-Z]/.test(password)
  }

  const submitForm = () => {
    console.log("submit form : ",formData);
    const schemaName = currentSchema.name;
    console.log(schemaName)

    storeFormData(formData, schemaName).then(savedForm => {
      console.log("saved form: ", savedForm);
      if(savedForm !== null){
        alert("form saved successfully...")
        createForm(currentSchema);
      }
    })
    .catch(error => {
      alert("submitting data is not successful"+error);
    });

  }

  const showHistory = () => {
    getFormDataOfSchema(currentSchema?.name).then(history => {
      if(history !== null){
        console.log(history);
        setPreviousData(history);
      }

      if(history.length === 0){
        alert("no previous data was found...");
      }
      
      // if(history.length > 0){
      //   renderHistory(history);
      // }
      
    })
    .catch(error => {
      console.log("error occurs while fetching previous data", error);
    });

  }

  // const renderHistory = (history) => {
  //   console.log()
  // }

  const exportCurrentSchema = () => {
    if(currentSchema === null){
      alert("no schema found, first import the schema")
    }
    else{
     console.log(currentSchema);
     const jsonData = JSON.stringify(currentSchema, null, 2);
     const blob = new Blob([jsonData], { type :"application/json"});
     const link = document.createElement("a");

     link.href = URL.createObjectURL(blob);
     link.download = "schema.json";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
    }
  }

  // const exportSchemaWithRestoredData = () => {
  //    const allFormData = getFormDataOfSchema(currentSchema?.name);
  //    console.log(allFormData);
  // }
  const processFile = (event) => {
    const file = event.target.files?.[0];

    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const schema = JSON.parse(e.target?.result);

          // Basic schema check
        if (typeof schema !== "object" || typeof schema.properties !== "object" || typeof schema.required !== "object") {
            alert("Invalid schema: Must be object' and 'properties must be objects'");
            return;
        }
        
        setCurrentSchema(schema);
        console.log("current schema : ",schema)

        getSchemaByName(schema?.name).then(schema1 => {
          console.log("get schema by name", schema1)
          
          if(schema1 === null){
            return storeSchema(schema).then(stored => {
              console.log("new schema created: ", stored);
              setCurrentSchema(stored);
            });
          }
          else{
            setCurrentSchema(schema1);
            alert("already the schema with same name is found");
          }
        })
        .catch(error => {
          console.log("get schema by name catch error");
        });

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
        <h1 className="text-sm md:text-3xl font-semibold text-slate-700">{currentSchema == null ? "Import Json Schema": "Schema is Imported"}</h1>
        </div>
          
        <div className="">
        <input onChange={processFile}
        className="border-gray-500 text-xl md:text-3xl font-lg text-slate-700 cursor-pointer
         rounded-md" type='file' id='schemaFile' accept='.json'/>
        </div>
          
       </div>
       <div className="h-[1px] w-full bg-black"></div>

       <div className="flex flex-col gap-3 justify-center items-center">
          <div>
            <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' disabled={currentSchema == null ? true : false}
            onClick={()=> createForm(currentSchema)}>
              Create Form</button>
          </div>
          <div id='form' className="">
             {/* The form is created here */}
          </div>
          <div>
           <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
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
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-blue-500 cursor-pointer 
            hover:bg-blue-700' onClick={()=>showHistory()}>button</button>
            <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-blue-500 cursor-pointer 
            hover:bg-blue-700 mt-1 md:mt-3' onClick={() => setPreviousData([])}>Hide Previous Data</button>
         </div>
         
       </div>
      <div id='history' className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {
            previousData.map((item, i) => {
              return(
               <div key={i} className="p-3 bg-gray-200 rounded-md flex flex-col gap-1">
                <p className="text-center">Form {": "}{i+1}</p>
                {
                  
                  Object.entries(item?.fieldWithValues).map(([key, value], index) => {
                    return(
                    <div key={index} className="flex gap-1 text-xl font-bold text-black">
                      
                      <p>{console.log("key"+ key+" value "+ value)}</p>
                      <p>{key} : {" "}</p>
                      <p>{value}</p>
                    </div>
                  )}
                )
                }
               </div>
            )})
          }
      </div>
       <div className="h-[1px] w-full bg-black"></div>


       <div className="flex flex-col gap-3 justify-center items-center">
         <div className="flex flex-col justify-center items-center">
         <p className="text-slate-700 font-bold">Export current schema by clicking the button below</p>
         <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' onClick={()=>exportCurrentSchema()}>Export</button>
         </div>

         {/* <div className='flex flex-col gap-3 justify-center items-center'>
         <p className="text-slate-700 font-bold">Export current schema with data by clicking the button below</p>
         <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' onClick={()=>exportSchemaWithRestoredData()}>Export with data</button>
         </div> */}
       </div>
      </div>
    </div>
  </div>
  );
}
