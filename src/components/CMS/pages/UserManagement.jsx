import { Table, Tag } from "antd";
import { Base_URL } from "../../../api/config";
import axios from "axios";
import UseCookie from "../../../hooks/useCookie";
import { useEffect, useState } from "react";

/* eslint-disable no-unused-vars */
const UserManagement = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [userList, setUserList] = useState([]);

  // http://localhost:8080/users
  const GetListUser = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(`${Base_URL}/users`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("UserList Response", response.data.users);
      setUserList(response.data.users);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const data = [
    {
      id: 1,
      userName: null,
      email: "nam@gmail.com",
      password: "$2a$10$N6GkJoW2TfhsSRAW4Z4csOtYLFfGdQcJI0kETDFgrIdP.PEgBjMf.",
      role: "USER",
      birthDate: "2023-10-23",
      userBio: null,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Flogo.png?alt=media&token=bf46ca20-ec6b-42b6-a330-a77663b450de",
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    {
      id: 2,
      userName: null,
      email: "test3@gmail.com",
      password: "$2a$10$GGZ1GbbSI5a.Ns0OHR.BM.L/U9UHl7BhxhUmRPvOPMU3ZOjiyDAJm",
      role: "USER",
      birthDate: "2000-08-01",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    {
      id: 504,
      userName: "Nguyen Hoang Nhan",
      email: "nguyen.hngnhan21@gmail.com",
      password: "$2a$10$JUp.tzHb6H816tt1IyICe.hNisd/93uJQPI0LN1PXeorOv/njV.ay",
      role: "ARTIST",
      birthDate: "2002-07-21",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    {
      id: 505,
      userName: "Nguyen Hoang Nhan",
      email: "test@gmail.com",
      password: "$2a$10$biLULL30K.AT7PFGM3in3OBAfP0HiYClyYOwtxNuNWAwvhv06S10.",
      role: "ADMIN",
      birthDate: "2002-07-21",
      userBio: "asds",
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
  ];
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        return (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bio",
      dataIndex: "userBio",
      key: "userBio",
    },
    {
      title: "Birthday",
      dataIndex: "birthDate",
      key: "birthDate",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (role) => {
        let color = role.length > 5 ? "geekblue" : "green";
        if (role.toLowerCase() === "user") {
          color = "green";
        }
        if (role.toLowerCase() === "artist") {
          color = "purple";
        }
        if (role.toLowerCase() === "admin") {
          color = "blue"; // Correct the color value
        }
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
  ];
  useEffect(() => {
    GetListUser();
  }, []);
  return (
    <div>
      <div className="text-2xl font-bold">User Management</div>
      <Table columns={columns} dataSource={userList} />
    </div>
  );
};

export default UserManagement;
