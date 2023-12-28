import React, { useState, useEffect } from "react";
import axios from "axios";
import "../FileSearch.css";

const FileSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getAllFiles();
  }, []);

  const getAllFiles = () => {
    axios
      .get("http://localhost:8080/api/files/all")
      .then((response) => {
        setFiles(response.data);
        setSearchResults(response.data); // Initially, set search results to all files
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  };

  const handleSearch = () => {
    const filteredFiles = files.filter((file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredFiles);
  };

  const handleDownload = (fileId, fileName) => {
    axios
      .get(`http://localhost:8080/api/files/download/${fileId}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return (
    <div>
      <h2>File Search</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={getAllFiles}>Reset</button>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((file) => (
            <tr key={file.id}>
              <td>{file.fileName}</td>
              <td>
                <button onClick={() => handleDownload(file.id, file.fileName)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileSearch;
