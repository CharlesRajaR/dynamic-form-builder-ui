## Steps to run the website in local system:
### For Frontend:
## 📦 Method-1:
## Prerequisites:
Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm (comes with Node.js) or yarn (optional)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/CharlesRajaR/dynamic-form-builder-ui
cd dynamic-form-builder-ui
npm install
npm run dev 
```
- then open the browser and go to http://localhost:3000
- You can start editing the page by modifying `app/page.tsx`, `app/api.js` The page auto-updates as you edit the file.

## 📦 Method-2:
- simply go to the deployed frontend website by clicking the link below
[Deployed Website] (https://schema-form-builder.netlify.app/)

### For Backend:
## Running the Backend Locally

## Prerequisites:
Make sure you have the following installed:

- Java 

---

### Method 1: Clone and Build from Source
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
- spring Boot backend server is not deployed in the internet.

--- 

- After running both the frontend and backend the website is fully functional and description of functionality is given below.

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
        "type": "string"
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
- Note : for validation part no third party libraries like Yup etc., is used, instead i use javascript to validate the form.

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

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
