"use client";

import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-900">
          Account Settings
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your account security and authentication settings.
        </p>


        <div className="grid md:grid-cols-2 gap-6 mt-10">


          {/* Change Password */}
          <div
            onClick={() =>
              router.push("/settings/change-password")
            }
            className="
              cursor-pointer
              bg-white
              rounded-2xl
              shadow-sm
              border
              border-slate-200
              p-6
              hover:shadow-lg
              transition
            "
          >

            <div className="flex items-center gap-4">

              <div className="
                w-12
                h-12
                rounded-xl
                bg-blue-100
                flex
                items-center
                justify-center
              ">
                <Lock className="text-blue-600" />
              </div>


              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Change Password
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update your account password securely.
                </p>
              </div>

            </div>


            <button
              className="
                mt-6
                w-full
                bg-blue-600
                text-white
                py-3
                rounded-xl
                font-semibold
                hover:bg-blue-700
              "
            >
              Manage Password
            </button>

          </div>



          {/* MFA */}
          <div
            onClick={() =>
              router.push("/settings/mfa")
            }
            className="
              cursor-pointer
              bg-white
              rounded-2xl
              shadow-sm
              border
              border-slate-200
              p-6
              hover:shadow-lg
              transition
            "
          >

            <div className="flex items-center gap-4">


              <div className="
                w-12
                h-12
                rounded-xl
                bg-green-100
                flex
                items-center
                justify-center
              ">
                <ShieldCheck className="text-green-600" />
              </div>


              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Multi-Factor Authentication
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add extra security using authenticator app.
                </p>

              </div>


            </div>


            <button
              className="
                mt-6
                w-full
                bg-green-600
                text-white
                py-3
                rounded-xl
                font-semibold
                hover:bg-green-700
              "
            >
              Setup MFA
            </button>


          </div>


        </div>

      </div>

    </div>
  );
}