"use client"
import Image from "next/image";
import { getFormDataOfSchema, getSchemaByName, storeFormData, storeSchema } from './api';
import React, { useState } from "react";



export default function Home() {
const [currentSchema, setCurrentSchema] = useState(null);
const [errorData, setErrorData] = useState({});
const [formData, setFormData] = useState({});
const [previousData, setPreviousData] = useState([]);
const [formCreated, setFormCreated] = useState(false); 


const createForm = () => {
    if(currentSchema == null){
      alert("import the schema file and then create form");
      console.log("no schema found: ", currentSchema);
    }
    else{
    const schema = currentSchema;
    console.log("schema: ", schema);
    setFormData({});
    setErrorData({});
    setFormCreated(true);
    const formContainer = document.getElementById('form');
    formContainer.innerHTML = ""; // Clear previous form

    const form = document.createElement("form");
    form.id = "createdForm"
 
    for (const key in schema.properties) {
      const field = schema.properties[key];
      const label = document.createElement("label");
      label.textContent = key;
      label.setAttribute("for", key);

      const input = document.createElement("input");

      input.name = key;
      input.value = "";
      input.id = key;
      console.log("field-type : ", field.type)
      if(field.type === "date"){

        input.placeholder = "DD-MM-YYYY"
      }

      setFormData(prev => ({
        ...prev, [key]:""
      }));
      setErrorData(prev => ({
        ...prev, [key]:"no error"
      }));

      input.addEventListener("change", handleChange);
      input.type = "text";
   
      const ptag = document.createElement("p");
      ptag.id = `${key}errortag`;


      form.appendChild(label);
      form.appendChild(input);
      form.appendChild(ptag);
      form.appendChild(document.createElement("br"));
    }
    console.log("initial form", formData);
    console.log("initial error", errorData);
    formContainer.appendChild(form);
  }
}

const removeSchema = () => {
  if(currentSchema == null){
    alert("already there is no schema...")
  }
  else{
  setCurrentSchema(null);
  document.getElementById("schemaFile").value = "";
  const formContainer = document.getElementById("form");
  const form = document.getElementById("createdForm");
  if(form){
      formContainer.removeChild(form);
  }
  setFormCreated(false);
  setPreviousData([]);
  setFormData({});
  setErrorData({});
  }
}
  
const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData(prev => ({
      ...prev, [name]:value
    }));

    console.log(name);
    console.log(value);

    const errortag = document.getElementById(`${name}errortag`);

    const field = currentSchema.properties[name];

    if("type" in field){
      typeValidator(field.type, errortag, value, name);
    }
}

const hasValidLength = () => {
  const properties = currentSchema?.properties;
  let validFlag = true; 

  for(const key in properties){
    const constraints = properties[key];
    console.log("constraints", constraints);
    const errortag = document.getElementById(`${key}errortag`);
    const type = constraints["type"];

    if(type === "integer" || type === "number"){
    if("min" in constraints && "max" in constraints){
      const min = Number(constraints["min"]);
      const max = Number(constraints["max"]);

      const value = formData[key];

      console.log("in has valid length")
      console.log("errortag", errortag);
      console.log("minimum length: ",min);
      
      if(Number(value) < min || Number(value) > max){
        errortag.innerHTML = `<div><p>number is in the range </p><p> of ${min} to ${max} [both inclusive]</p></div>`
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if("min" in constraints){
      const min = Number(constraints["min"]);

      const value = formData[key];
      const errortag = document.getElementById(`${key}errortag`);
      console.log("minimum number is : ",min);
      
      if(Number(value) < min){
        errortag.innerHTML = `<div><p>minimum number must be ${min}</p></div>`
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if("max" in constraints){
      const max = Number(constraints["max"]);

      const value = formData[key];
      const errortag = document.getElementById(`${key}errortag`);
      console.log("maximum number is: ",max);
      
      if(Number(value) > max){
        errortag.innerHTML = `<div><p>number must be less than or equal to ${max}</p></div>`;
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    }

    else if(type === "date"){
      if("min" in constraints && "max" in constraints){

        const [year, month, day] = constraints["min"].split("-").map(Number);
        const minDate = new Date(year, month-1, day);

        const [year1, month1, day1] = constraints["max"].split("-").map(Number);
        const maxDate = new Date(year1, month1-1, day1);

        const value = formData[key];
        const [day2, month2, year2] = value.split("-").map(Number);
        const date = new Date(year2, month2-1, day2);

        const errortag = document.getElementById(`${key}errortag`);
        console.log("in has valid length")
        console.log("errortag", errortag);
      
      if(date < minDate || date > maxDate){
        errortag.innerHTML = `<div><p>date is in the range of </p><p>  ${constraints["min"]} to ${constraints["max"]}</p><p>[both inclusive]</p></div>`
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if("min" in constraints){
      
        const [year, month, day] = constraints["min"].split("-").map(Number);
        const minDate = new Date(year, month-1, day);

        const value = formData[key];
        const [day2, month2, year2] = value.split("-").map(Number);
        const date = new Date(year2, month2-1, day2);


      const errortag = document.getElementById(`${key}errortag`);
      console.log("minimum number is : ",min);
      
      if(date < minDate){
        errortag.innerHTML = `<div><p>date must be ${constraints["min"]} or above</p></div>`
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if("max" in constraints){
      const [year, month, day] = constraints["max"].split("-").map(Number);
        const maxDate = new Date(year, month-1, day);

        const value = formData[key];
        const [day2, month2, year2] = value.split("-").map(Number);
        const date = new Date(year2, month2-1, day2);

      const errortag = document.getElementById(`${key}errortag`);
      console.log("maximum number is: ",max);
      
      if(date > maxDate){
        errortag.innerHTML = `<div><p>date must be ${constraints["max"]} or below</p></div>`;
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    }

    else{

    if("minLength" in constraints && "maxLength" in constraints){
      const minLength = Number(constraints["minLength"]);
      const maxLength = Number(constraints["maxLength"]);

      const value = formData[key];
      const errortag = document.getElementById(`${key}errortag`);
      console.log("in has valid length")
      console.log("errortag", errortag);
      console.log("minimum length: ",minLength);
      
      if(value.length < minLength || value.length > maxLength){
        errortag.innerHTML = `<div><p>minimum length required is ${minLength}</p><p>max length required is ${maxLength}</p></div>`
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if("minLength" in constraints){
      const minLength = Number(constraints["minLength"]);

      const value = formData[key];
      const errortag = document.getElementById(`${key}errortag`);
      console.log("minimum length: ",minLength);
      
      if(value.length < minLength){
        errortag.innerHTML = `<div><p>minimum length required is ${minLength}</p></div>`
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    else if("maxLength" in constraints){
      const maxLength = Number(constraints["maxLength"]);

      const value = formData[key];
      const errortag = document.getElementById(`${key}errortag`);
      console.log("minimum length: ",minLength);
      
      if(value.length > maxLength){
        errortag.innerHTML = `<div><p>max length required is ${maxLength}</p></div>`;
        validFlag = false;
      }
      else{
        errortag.innerHTML = ""
      }
    }
    }
  }

  return validFlag;
}
const typeValidator = (type, errortag, value, name) => {
    console.log(`type validator: name: ${name}, value: ${value} , type: ${type}, errortag: ${errortag}`);
    if (type === "string"){
      errortag.innerHTML = ""
    }
    else if (type === "integer" || type === "number"){
      if(!Number.isInteger(Number(value))){
        errortag.innerHTML="required value is number \n";
        setErrorData(prev => ({
          ...prev, [name]:`required value is number `
        }));
      }
      else{
        errortag.innerHTML = ""
        setErrorData(prev => ({
          ...prev, [name]:"no error"
        }));
      }
    }
    else if (type === "email"){
      if(!isValidEmail(value)){
        errortag.innerHTML="email is invalid \n"
        setErrorData(prev => ({
          ...prev, [name]:"email is invalid"
        }));
      }
      else{
        errortag.innerHTML = ""
        setErrorData(prev => ({
          ...prev, [name]:"no error"
        }));
      }
    }
    else if (type === "password"){
      passwordValidator(value, name, errortag)
     }
     else if(type === "date"){
      dateValidator(value, name, errortag)
     }
}

const dateValidator = (value, name, errortag) => {
   const regex = /^\d{2}-\d{2}-\d{4}$/; 

   if(value != null && !regex.test(value)){
     errortag.innerHTML = "<p>Enter the date like: 22-01-2020</p>"

     setErrorData(prev => ({
           ...prev, [name]:"invalid date"
          }));
   }
   else{
    const [ day, month, year ] = value.split("-").map(Number);
    const date = new Date(year, month-1, day);
    if(date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day){
       errortag.innerHTML = "<p>date is invalid</p>";
       setErrorData(prev => ({
               ...prev, [name]:"invalid date"
               }));
    }
    else{
      errortag.innerHTML = ""
      setErrorData(prev => ({
            ...prev, [name]:"no error"
           }));
    }
   }
   
}
const passwordValidator = (value, name, errortag) => {
    if(!isValidPassword(value)){
      console.log("password is in-valid...");

      setErrorData(prev => ({
        ...prev, [name]:"password is invalid"
      }));

      errortag.innerHTML = "<div><p>at least one small letter is required</p><p>at least one capital letter is required</p><p>at least one digit letter is required</p><p>at least one symbol letter is required</p></div>"

      }

      else{
        console.log("else statement")
        setErrorData(prev => ({
          ...prev, [name]:"no error"
        }));
        
        errortag.innerHTML = ""
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
    console.log("submit formss : ",formData);
    console.log("error details : ", errorData);
    if(currentSchema === null){
       alert("kindly import the valid schema and \n create form and enter valid data then \n click submit button")
    }
    else if(!hasRequiredFiels()){
       console.log("some fiels are required")
    }
    else if(hasErrorData()){
       alert("some field value are wrong")
       console.log("errorData : ",errorData);
    }
    else if(!hasValidLength()){
       console.log("some field value length are invalid");
    }
    else{
    const schemaName = currentSchema.name;
    console.log(schemaName)

    storeFormData(formData, schemaName).then(savedForm => {
      console.log("saved form: ", savedForm);
      if(savedForm !== null){
        alert("form saved successfully...")
        createForm(currentSchema);
      }
      else if(savedForm === null){
        alert("form data is invalid - by backend validator");
      }
    })
    .catch(error => {
      console.log("submitting data is not successful"+error);
    });
  }
}

const hasRequiredFiels = () => {
  let flag = true;
  const required = currentSchema?.required;
  console.log("required", required);
  for(let i = 0; i < required.length; i++){
    const key = required[i];
    console.log("required key ", key, "formdata[key] ", formData[key]);
    if(formData[key] === ""){
      flag = false;
      const errortag = document.getElementById(`${key}errortag`);
      errortag.innerHTML = "this field is required"
    }
  }
  return flag;
}

const hasErrorData = () => {
  console.log("hasError", errorData);
  for(const key in errorData){
    console.log("key ", key)
    console.log("errorData[key] ", errorData[key])
    if(errorData[key] !== "no error"){
      return true;
    }
  }
  return false;
}

const showHistory = () => {
    if(currentSchema === null){
      alert("import respective schema! \n then click the button to see previous submitted form data...")
    }
    else{
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
}
const hideHistory = () => {
    if(previousData.length == 0){
       alert("already the previous data was hidden");
    }
    else{
      setPreviousData([]);
    }
}
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

const exportSchemaWithRestoredData = () => {
    if(currentSchema === null){
      alert("import schema of the form you want to export");
    }
    else{
    const restoredData = [];

     getFormDataOfSchema(currentSchema.name).then(history => {
      if(history !== null){
        console.log(history);
        setPreviousData(history);
        history.map((item, i) =>{
           let name = `Form-${i+1}`
           restoredData.push({[name]:item.fieldWithValues});
        });

    const data = {
      schema:currentSchema,
      formData:restoredData
     }

     const jsonData = JSON.stringify(data, null, 2);
     const blob = new Blob([jsonData], { type :"application/json"});
     const link = document.createElement("a");

     link.href = URL.createObjectURL(blob);
     link.download = "SchemaWithRestoredData.json";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     
      }
    })
    .catch(error => {
      console.log("error occurs while fetching previous data", error);
    });
    }
}

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

const downloadSampleJson = () => {
     const sampleSchema = {
      name: "unique name for each schema",
      properties: {
        name: {
          type: "string"
        },
        email: {
          type: "email"
        },
        age: {
          type: "number or integer",
          min:"only for number type! specify minimum number",
          max:"only for number type! specify maximum number"
        },
        password: {
          type: "password",
          minLength: "replace with minimum length of the text",
          maxLength: "replace with maximum length of the text"
        },
        dateOfBirth:{
           type:"date",
           min:"2020-01-01 // start date the input will accept",
           max:"2040-12-31 // end date the input will accept"
        },
        state: {
          type: "string"
        }
       },

      required: ["name", "email", "password"]
     }

     const jsonData = JSON.stringify(sampleSchema, null, 2);
     const blob = new Blob([jsonData], { type :"application/json"});
     const link = document.createElement("a");

     link.href = URL.createObjectURL(blob);
     link.download = "sampleSchema.json";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
}

return (
  <div className="">
<div className="prev w-full">
     <div className="w-full flex flex-col gap-5">
      <div className="w-full  flex flex-col gap-5" id="bg-grad">
       <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col gap-1">
        <p className="text-yellow-700 text-xs md:font-semibold md:text-lg">
        Want a sample schema format? 
        <button onClick={downloadSampleJson} className="border-b-[1px] md:border-b-2 border-blue-700 cursor-pointer 
        active:text-yellow-700
        transition duration-1000">click here...</button></p>
        <h1 className="text-sm md:text-3xl font-semibold text-slate-700">
        {currentSchema == null ? "Import Json Schema": "Schema is Imported"}</h1>
        </div>
          
        <div className="text-xs md:text-3xl">
        <input onChange={processFile}
        className="border-[1px] md:border-2 border-gray-500 text-xl md:text-3xl font-lg text-slate-700 cursor-pointer
         rounded-md" type='file' id='schemaFile' accept='.json'/>
        </div>
          
       </div>
       <div className="flex justify-center items-center" >
         <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-red-500 cursor-pointer 
            hover:bg-slate-700' onClick={() => removeSchema()} >
             Remove Imported schema
         </button>
       </div>

       <div className="h-[1px] w-full bg-black"></div>

       <div className="flex flex-col gap-3 justify-center items-center">
          <div>
          { currentSchema !== null &&
            <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' disabled={currentSchema == null ? true : false}
            onClick={() => createForm()}>
              Create Form
            </button>
          }
          </div>
          <div id='form' className="">
             {/* The form is created here */}
           </div>
          <div>{
           formCreated && <button className='border-[1px] border-slate-700 rounded-md
            px-3 py-1 text-sm md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700'
            onClick={()=>submitForm()}>
              Submit
            </button>
          }</div>
       </div>

       {currentSchema !== null && <div className="h-[1px] w-full bg-black"></div>}

       <div className="flex flex-col gap-3 justify-center items-center">
         <div className="flex flex-col justify-center items-center">
         <p className="text-slate-700 text-xs md:text-2xl font-bold">Export current Form schema by clicking the button below</p>
         <button className='border-[1px] border-slate-700 rounded-md
            p-1 md:px-3 md:py-1 text-xs md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' onClick={()=>exportCurrentSchema()}>Export</button>
         </div>

         <div className="h-[1px] w-full bg-black"></div>

         <div className='flex flex-col gap-3 max-w-full pb-5 justify-center items-center'>
         <p className="text-slate-700 text-xs break-words md:text-2xl font-bold">
          Want to export schema with its restored data? click the button below</p>
         <button className='border-[1px] border-slate-700 rounded-md
            p-1 md:px-3 md:py-1 text-xs md:text-2xl font-semibold text-white bg-slate-500 cursor-pointer 
            hover:bg-slate-700' onClick={()=>exportSchemaWithRestoredData()}>
              Export</button>
         </div>
       </div>
      </div>
  
      <div className="flex flex-col gap-3">
        <div className="flex justify-center items-center">
         <div className="flex flex-col justify-center items-center">
          <p className="text-xs md:text-xl break-words font-bold text-blue-700">Show previously Submitted Data By clicking the button below</p>
          <button className='border-[1px] border-slate-700 rounded-md
            p-1 md:px-3 md:py-1 text-xs md:text-2xl font-semibold text-white bg-blue-500 cursor-pointer 
            hover:bg-blue-700' onClick={()=>showHistory()}>button</button>
            <button className='border-[1px] border-slate-700 rounded-md
            p-1 md:px-3 md:py-1 text-xs md:text-2xl font-semibold text-white bg-blue-500 cursor-pointer 
            hover:bg-blue-700 mt-1 md:mt-3' onClick={hideHistory}>Hide Previous Data</button>
         </div>
         
       </div>

       <div id='history' className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5 max-w-full overflow-x-hidden">
          {
            previousData.map((item, i) => {
              return(
               <div key={i} className="p-3 bg-gray-200 rounded-md flex border-[1px] 
               border-slate-300 rounded-md  flex-col gap-1 break-words max-w-full">
                <p className="text-center">Form {": "}{i+1}</p>
                {
                  
                  Object.entries(item?.fieldWithValues).map(([key, value], index) => {
                    return(
                    <div key={index} className="flex gap-1 text-xs md:text-xl font-bold text-black">
                      
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


      </div>
    </div>

  </div>
  </div>
  );
}
