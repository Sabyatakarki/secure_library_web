"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MfaPage() {

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);


  const generateMfa = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5050/api/mfa/generate",
        {},
        {
          withCredentials: true,
        }
      );


      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);


      toast.success(
        "Scan QR code using Google Authenticator"
      );


    } catch(error:any){

      toast.error(
        error.response?.data?.message ||
        "Failed to generate MFA"
      );

    } finally {
      setLoading(false);
    }

  };



  const verifyMfa = async () => {

    try {

      setLoading(true);


      const response = await axios.post(
        "http://localhost:5050/api/mfa/verify",
        {
          token,
        },
        {
          withCredentials:true,
        }
      );


      toast.success(
        response.data.message
      );


      setMfaEnabled(true);


    } catch(error:any){

      toast.error(
        error.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="w-full space-y-4">


      {/* Header */}

      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">

        <ShieldCheck className="text-green-600"/>

        <h2 className="text-lg font-bold text-gray-800 tracking-wide">
          Multi Factor Authentication
        </h2>

      </div>



      <div className="
        w-full 
        rounded-3xl 
        border 
        border-gray-100 
        bg-white 
        p-6 
        shadow-sm
      ">


        <div className="
          flex 
          flex-col 
          gap-6
        ">



          {/* Status */}

          <div className="flex justify-between items-center">


            <div>

              <h3 className="
                text-base 
                font-bold 
                text-gray-800
              ">
                Authenticator App Verification
              </h3>


              <p className="
                text-sm 
                text-gray-500
              ">
                Protect your account using two-step verification.
              </p>

            </div>



            <span
              className={`
                rounded-full 
                px-3.5 
                py-1 
                text-xs 
                font-bold
                ${
                  mfaEnabled
                  ?
                  "bg-green-50 text-green-700"
                  :
                  "bg-red-50 text-red-700"
                }
              `}
            >

              {
                mfaEnabled
                ?
                "Active"
                :
                "Inactive"
              }

            </span>


          </div>




          {/* Generate QR */}

          {!qrCode && (

            <button

              onClick={generateMfa}

              disabled={loading}

              className="
                w-full
                rounded-xl
                bg-green-600
                py-3
                text-white
                font-semibold
                hover:bg-green-700
              "

            >

              {
                loading
                ?
                "Generating..."
                :
                "Generate QR Code"
              }


            </button>

          )}




          {/* QR Code */}

          {
            qrCode && (

              <div className="
                flex
                flex-col
                items-center
                gap-4
              ">


                <p className="
                  text-sm
                  text-gray-600
                ">
                  Scan this QR code with Google Authenticator
                </p>



                <img
                  src={qrCode}
                  alt="MFA QR Code"
                  className="
                    w-56
                    h-56
                    rounded-xl
                    border
                    p-2
                  "
                />


                <p className="
                  text-xs
                  text-gray-400
                  break-all
                ">
                  Secret: {secret}
                </p>



              </div>

            )
          }





          {/* OTP Verification */}

          {
            qrCode && !mfaEnabled && (

              <div className="space-y-3">


                <input

                  type="text"

                  placeholder="Enter 6 digit OTP"

                  value={token}

                  onChange={(e)=>setToken(e.target.value)}

                  className="
                    w-full
                    rounded-xl
                    border
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "

                />



                <button

                  onClick={verifyMfa}

                  disabled={loading}

                  className="
                    w-full
                    rounded-xl
                    bg-blue-600
                    py-3
                    text-white
                    font-semibold
                    hover:bg-blue-700
                  "

                >

                  Verify & Enable MFA

                </button>


              </div>

            )

          }



        </div>


      </div>


    </div>

  );
}