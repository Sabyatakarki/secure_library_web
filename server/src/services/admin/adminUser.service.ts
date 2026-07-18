import bcrypt from "bcrypt";
import userRepository from "../../repositories/user.repository";
import {
  RegisterUserDto,
  UpdateUserDto
} from "../../dtos/user.dtos";
import { HttpError } from "../../error/http-error";


export class AdminUserService {


  // Create User
  async createUser(data: RegisterUserDto) {

    const existingEmail =
      await userRepository.findByEmail(data.email);


    if (existingEmail) {
      throw new HttpError(
        400,
        "Email already exists"
      );
    }


    const existingStudent =
      await userRepository.findByStudentId(
        data.studentId
      );


    if (existingStudent) {
      throw new HttpError(
        400,
        "Student ID already exists"
      );
    }


    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10
      );


    const user =
      await userRepository.createUser({

        ...data,

        password: hashedPassword,

        role: data.role || "Student"

      });



    const userData =
      user.toObject();


    delete (userData as any).password;


    return userData;

  }




  // Get All Users
  async getAllUsers(
    page?: string,
    size?: string,
    search?: string
  ) {


    let users =
      await userRepository.getAllUsers();



    if(search){

      users =
        users.filter((user:any)=>

          user.fullName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

          ||

          user.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        );

    }



    const currentPage =
      Number(page) || 1;


    const pageSize =
      Number(size) || 10;


    const start =
      (currentPage - 1)
      * pageSize;



    const paginatedUsers =
      users.slice(
        start,
        start + pageSize
      );



    return {

      users: paginatedUsers,

      pagination: {

        page: currentPage,

        size: pageSize,

        total: users.length,

        totalPages:
          Math.ceil(
            users.length / pageSize
          )

      }

    };

  }





  // Get User By ID
  async getUserById(id:string){

    const user =
      await userRepository.findById(id);



    if(!user){

      throw new HttpError(
        404,
        "User not found"
      );

    }



    const userData =
      user.toObject();


    delete (userData as any).password;


    return userData;

  }





  // Update User
  async updateUser(
    id:string,
    data:UpdateUserDto
  ){

    const user =
      await userRepository.updateUser(
        id,
        data
      );



    if(!user){

      throw new HttpError(
        404,
        "User not found"
      );

    }


    return user;

  }





  // Delete User
  async deleteUser(id:string){

    const user =
      await userRepository.deleteUser(id);



    if(!user){

      throw new HttpError(
        404,
        "User not found"
      );

    }


    return user;

  }


}