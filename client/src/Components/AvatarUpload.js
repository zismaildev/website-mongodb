import { useState } from "react";
import Swal from "sweetalert2";
import ZAppBar from "./Appbar";

function AvatarUpload() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const selectedFile = event.target.files[0];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      Swal.fire({
        icon: "success",
        title: "File uploaded successfully",
      });
    } else {
      setFile(null);
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please select a PNG or JPEG image",
      });
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadAvatar(file)
        .then((message) => {
          if (message === "Avatar updated successfully") {
            setImageUrl(URL.createObjectURL(file));
            Swal.fire({
              icon: "success",
              title: message,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error uploading avatar",
              text: message,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error uploading avatar",
            text: error.message,
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "No file selected",
        text: "Please select an image to upload",
      });
    }
  };

  function uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    return fetch("http://localhost:7777/zismailavatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        return data.message;
      });
  }

  return (
    <div>
      <ZAppBar />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && <img src={imageUrl} alt="avatar" />}
    </div>
  );
}

export default AvatarUpload;
