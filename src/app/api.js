const BASE_URL = "http://localhost:8080"

export async function storeSchema(schema){
    try{
        const response = await fetch(`${BASE_URL}/store/schema`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(schema)
        });

        if(!response.ok){
            const error = response.text();
            throw new Error(`failed to store schema: ${schema}`);
        }

        const savedSchema = await response.json();
        console.log("saved schema"+savedSchema);

        return savedSchema;
    }
    catch(error){
        console.log("error storig schema");
        return null;
    }
}

export async function getSchemaByName(name){
    try{
        const response = await fetch(`${BASE_URL}/get-schema/${encodeURIComponent(name)}`, {
            method:"GET"
        }
        );
        if(!response.ok){
            const error = await response.text();
            throw new Error(`Error fetching schema ${error}`);
        }

        const schema = await response.json();
        console.log("schema: ", schema)
        return schema;
    }
    catch(error){
       console.log("failes to fetch schema : ", name);
       return null;
    }
}

export async function getAllSchema() {
    try{
    const response = await fetch(`${BASE_URL}/get-all-schema`,{
      method:"GET"
    });

    if(!response.ok){
        const error = await response.text();
        throw new Error("could not get all schema");
    }

    const schemas = await response.json();
     console.log("schemas : ", schemas);
    return schemas;
}
catch(error){
    console.log("could not fetch schema");
    return null;
}
}

export async function storeFormData(formData, schemaName) {
    try{
    const response = await fetch(`${BASE_URL}/store-form-data/${encodeURIComponent(schemaName)}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    });

    if(!response.ok){
        const error = response.text();
        throw new Error(`failed to store formdata: ${formData}`);
    }

    const savedFormData = await response.json();
    console.log("saved Form Data: "+savedFormData);

    return savedFormData;
}
catch(error){
    console.log("error storing form data");
    return null;
}
}

export async function getFormDataOfSchema(schemaName){
    try{
        const response = await fetch(`${BASE_URL}/get-form-data/${schemaName}`,{
            method:"GET"
        });

        if(!response.ok){
            throw new Error("could not get form data");
        };
        const formDatas = await response.json();
        console.log(formDatas);
        return formDatas;
    }
    catch(error){
        console.log("error: ",error)
        return null;
    }
}