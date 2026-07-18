"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface Reservation {
  _id: string;

  user: {
    fullName: string;
    email: string;
    studentId: string;
    department: string;
  };

  book: {
    title: string;
    author: string;
    isbn: string;
  };

  status: "Pending" | "Approved" | "Cancelled";

  createdAt: string;
}

export default function AdminReservationsPage() {

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReservations = async () => {

    try {

      setLoading(true);


      const response =
        await axios.get(
          "/admin/reservations",
          {
            withCredentials:true
          }
        );


      setReservations(
        response.data.data
      );


    } catch(error:any){

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch reservations"
      );

    } finally {

      setLoading(false);

    }

  };





  useEffect(()=>{

    fetchReservations();

  },[]);





  // Approve reservation

  const approveReservation = async(
    reservationId:string
  )=>{


    try{

      setActionLoading(
        reservationId
      );


      await axios.put(
        `/admin/reservations/approve/${reservationId}`,
        {},
        {
          withCredentials:true
        }
      );


      toast.success(
        "Reservation approved"
      );


      fetchReservations();


    }catch(error:any){

      toast.error(
        error.response?.data?.message ||
        "Approval failed"
      );


    }finally{

      setActionLoading(null);

    }

  };






  // Cancel reservation

  const cancelReservation = async(
    reservationId:string
  )=>{


    try{

      setActionLoading(
        reservationId
      );


      await axios.put(
        `/admin/reservations/cancel/${reservationId}`,
        {},
        {
          withCredentials:true
        }
      );


      toast.success(
        "Reservation cancelled"
      );


      fetchReservations();


    }catch(error:any){

      toast.error(
        error.response?.data?.message ||
        "Cancellation failed"
      );


    }finally{

      setActionLoading(null);

    }

  };







  if(loading){

    return (
      <div>
        Loading reservations...
      </div>
    );

  }





  return (

    <div>

      <ToastContainer/>


      <h1>
        Admin Reservations
      </h1>



      {
        reservations.length === 0 ? (

          <p>
            No reservations found
          </p>

        ) : (


          reservations.map(
            (reservation)=>(


              <div
                key={reservation._id}
              >

                <h3>
                  {reservation.book.title}
                </h3>


                <p>
                  Student:
                  {" "}
                  {reservation.user.fullName}
                </p>


                <p>
                  Email:
                  {" "}
                  {reservation.user.email}
                </p>


                <p>
                  Department:
                  {" "}
                  {reservation.user.department}
                </p>


                <p>
                  Author:
                  {" "}
                  {reservation.book.author}
                </p>


                <p>
                  Status:
                  {" "}
                  {reservation.status}
                </p>




                {
                  reservation.status === "Pending" && (

                    <>

                    <button
                      disabled={
                        actionLoading === reservation._id
                      }
                      onClick={()=>
                        approveReservation(
                          reservation._id
                        )
                      }
                    >

                      {
                        actionLoading === reservation._id
                        ?
                        "Processing..."
                        :
                        "Approve"
                      }

                    </button>




                    <button
                      disabled={
                        actionLoading === reservation._id
                      }
                      onClick={()=>
                        cancelReservation(
                          reservation._id
                        )
                      }
                    >

                      Cancel

                    </button>


                    </>

                  )
                }



                <hr/>

              </div>


            )

          )


        )

      }


    </div>

  );

}