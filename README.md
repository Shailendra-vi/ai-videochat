# AI Video Chat

AI-powered video chat application built with Next.js, Clerk authentication, and Ollama DeepSeek R1 for user matching using cosine similarity on generated embeddings.

## Features  
- User authentication via Clerk  
- Profile creation with name and interests  
- Embedding generation using Ollama DeepSeek R1  
- Matching users based on cosine similarity  
- Video call integration for matched users  
- "Next" button to skip and find another match  

## Installation  

### 1. Clone the Repository  
```sh  
git clone https://github.com/Shailendra-vi/quick-commerce
cd ai-videochat  
```  

### 2. Install Dependencies  
```sh  
npm install  
```  

### 3. Configure Environment Variables  
Create a `.env.local` file and add the following:  

```env  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<CLERK_PUBLISHABLE_KEY>  
CLERK_SECRET_KEY=<CLERK_SECRET>  

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in  
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up  

MONGODB_URI=<MONGODB_URI>  
```  

### 4. Run the Application  
```sh  
npm run dev  
```  

The app will be available at `http://localhost:3000`