"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLoginMfa } from "../../lib/auth";
import {
  setLibraryToken,
  setUserData
} from "../../lib/cookies";


export default function MfaPage(){

const router = useRouter();

const [code,setCode]=useState("");
const [error,setError]=useState("");
const [loading,setLoading]=useState(false);


async function handleSubmit(
 e:React.FormEvent
){

 e.preventDefault();

 setError("");

 if(code.length !== 6){
   setError(
    "Enter 6 digit verification code"
   );
   return;
 }


 try{

 setLoading(true);


 const email =
 localStorage.getItem(
  "mfaEmail"
 );


 if(!email){
   throw new Error(
    "MFA session expired"
   );
 }


 const response =
 await verifyLoginMfa(
   email,
   code
 );


 const token =
 response.data.token;


 const user =
 response.data.user;


 await setLibraryToken(token);
 await setUserData(user);


 localStorage.removeItem(
  "mfaEmail"
 );


 if(user.role==="Admin"){
   router.push(
    "/admin/dashboard"
   );
 }
 else{
   router.push(
    "/dashboard"
   );
 }


 }
 catch(err:any){

 setError(
  err.message ||
  "Invalid MFA code"
 );

 }
 finally{

 setLoading(false);

 }

}



return (

<div className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
">


<div className="
bg-white
rounded-3xl
shadow-xl
p-10
w-full
max-w-md
">


<h1 className="
text-3xl
font-bold
text-center
text-gray-900
">

MFA Verification

</h1>


<p className="
text-center
text-gray-500
mt-3
">

Enter the code from your
Authenticator app

</p>



<form
onSubmit={handleSubmit}
className="
mt-8
space-y-5
">


<input

type="text"

maxLength={6}

value={code}

onChange={(e)=>
setCode(
 e.target.value.replace(/\D/g,"")
)
}

placeholder="000000"

className="
w-full
border
rounded-xl
p-4
text-center
tracking-[0.5em]
text-xl
outline-none
focus:ring-2
focus:ring-blue-500
"

/>



{
error &&
<p className="
text-red-600
text-sm
text-center
">
{error}
</p>
}



<button

disabled={loading}

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-semibold
hover:bg-blue-700
disabled:opacity-50
"

>

{
loading
?
"Checking..."
:
"Verify"
}

</button>


</form>


</div>

</div>

)

}