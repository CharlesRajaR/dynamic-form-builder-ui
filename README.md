## Deployed Full Stack Application:
[Deployed Website Link: ] (https://schema-form-builder.netlify.app/)

- Spring Boot backend server is deployed in internet which is accessed by the frontend internally.

## 🧱 Tech Stack Used:
### 🖥️ Frontend: Next.js
- Why Next.js?

- Server-side rendering (SSR) and static site generation (SSG) provide faster load times and better SEO — useful even in internal tools.
- Built-in API routes were helpful during early development before integrating with the backend.
- Seamlessly integrates with React, allowing dynamic rendering of form fields based on the input JSON Schema.
- Its file-based routing and modular structure made organizing UI components intuitive and efficient.

- How it helped solve the problem:

Dynamic form rendering was handled with ease by React components, and Next.js provided a structured way to manage routes, handle client-server interaction, and support live form validation in real-time.

### 🧠 Backend: Java (Spring Boot)
- Why Java and Spring Boot?

- Spring Boot offers robust data validation, dependency injection, and easy integration with databases, making it ideal for scalable API development.
- Mature ecosystem and strong community support helped quickly implement JSON Schema validation on the server-side.
- Secure and production-ready out of the box — essential for handling and validating form submissions safely.

- How it helped solve the problem:

- Server-side validation reused the same JSON Schema as the frontend, ensuring consistency.
- Spring Boot simplified the creation of RESTful APIs for schema storage, data submission, export, and retrieval.

## 🗃️ Database: MongoDB
- Why MongoDB?

- Schema-less design was ideal for storing dynamic form data that may vary in structure depending on the schema.
- Great support for nested and complex JSON-like documents (BSON), aligning naturally with JSON Schema-based data.
- Scalability and flexibility were a plus for future extensions (e.g., storing user submissions per schema, querying exports, etc.).

### How it helped solve the problem:
## Easily associated multiple submitted form datasets with a specific schema.


## Steps to run the website in local system:
### For Frontend:

## Prerequisites:
Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm (comes with Node.js) 

---

### Steps:
## 📥 Clone the Repository

```bash
git clone https://github.com/CharlesRajaR/dynamic-form-builder-ui
cd dynamic-form-builder-ui
npm install
npm run dev 
```
- then open the browser and go to http://localhost:3000
- You can start editing the page by modifying `app/page.tsx`, `app/api.js` The page auto-updates as you edit the file.


### For Backend:
## Running the Backend Locally

## Prerequisites:
Make sure you have the following installed:

- Java 17 or later
- Download: https://jdk.java.net/17

---

### Method 1: Clone and Build from Github Repository:
1. Clone the repository: `git clone https://github.com/CharlesRajaR/dynamic-form-builder.git`
2. Navigate to the project directory: `cd dynamic-form-builder`
3. Build and run the application: `mvn spring-boot:run`
4. Access the application at `http://localhost:8080`

### Method 2: Run Using Pre-built Executable JAR
1. Clone the repository containing the pre-built executable JAR: `git clone https://github.com/CharlesRajaR/Executable-file-for-form-builder.git`
2. Navigate to the JAR directory: `cd Executable-file-for-form-builder`
3. Run the application using the JAR file: `java -jar form-builder-0.0.1-SNAPSHOT.jar`
4. Access the application at `http://localhost:8080`

### Note:
- while running the backend make sure you turn on the internet because the backend is connecting to the remote mongodb database deployment.


--- 

- After running both the frontend and backend in the local system the request from the frontend(http://localhost:3000) is automatically handled by the backend running in the port (http://localhost:8000) and the respective response is sent to the frontend http://localhost:3000.
- Now the website is fully functional and description of functionality is given below.

### Demo  Vedio:
[Demo vedio for using the website](https://drive.google.com/file/d/1_57vEg1vxyu90PWpkeGIoklso7T9SZEz/view?usp=sharing)


### Functionalites:

## 1.Import .json schema file
### Description:
- import the .json schema file by clicking the (choose file no file choosen) tab in the top of the website, the name field in the schema is unique for each schema. because based on this name if the schema is already imported previously at any time , that is stored in the database is taken and the current schema is not stored in the database again, this will maintain no duplication in schema.
- For each properties, currently the supported contraints are : type - which denote the type of the field, min - denote minimum length of the field, max - maximum length of the field.
- Note: if the imported schema is not valid, then the alert message is shown.

### Format:
```bash
{
    
    "name": "Registration form",//the name of each schema must be unique
    "properties": {
      "name": {
        "type": "string",
      },
      "email": {
         "type": "email"
      },
      "age": {
        "type": "number"
      },
      "state": {
        "type": "string"
      }
    },
    "required": ["name", "email"]
 }
 ```

## 2.Create Dynamic Form
### Description:
- Click the create form button to create the dynamic form
- Note : For validation part third party libraries like Yup etc., is not used, Instead i use javascript to validate the form.

## 3.Submit Form
### Description:
- Submit the form by clicking the submit button, which will submit data if all the data are valid, otherwise it will give an alert message
- After Submitting the backend spring-boot will store the form data with association with the particular schema after validating the form data based on that schema.
- Data are stored in the mongodb database.

## 4.Previous data
### Description:
- Click the show previous data button, which will get all the previously submitted form for the current schema from the backend and then render in the website.
- Click the hide previous data button to hide the previous data.

## 5.Export Schema:
### Description:
- Click the export button to export the current schema which will be used for re import.

---

