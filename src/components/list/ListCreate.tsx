"use client"
import { CloseCircleOutlined, CloudUploadOutlined, FileAddOutlined, ToTopOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Input from "../inputs/Input";
import { useAuth } from "../auth/Auth";

export const ListTeamCreate = ({
  users,
  selectedContent,
  onTeamChange,
}: {
  users: IUsers[];
  selectedContent: IMyUserContent | null;
  onTeamChange: (team: ITeamPost[]) => void;
}) => {
  
  const [userRows, setUserRows] = useState<ITeamRow[]>([]);
  const [selectedItens, setSelectedItens] = useState<ISelectedItem[]>([]); // State for selected users

  useEffect(() => {
    if (selectedContent?.equipe) {
      const rows = selectedContent.equipe.map((member, x) => ({
        rowIndex: x + 1,
        id: x + 1,
        userName: member.nome,
        email: member.email,
      }));
      setUserRows(rows);
      setSelectedItens(
        selectedContent.equipe.map((row, x) => ({
          rowIndex: row.id, 
          id: row.id,
          value: row.nome + (row.email ? ` - ${row.email}` : ''
        )})));
    } else {
      setUserRows([]);
      setSelectedItens([]);
    }
  }, [selectedContent]);

  // Notify parent of team changes
  useEffect(() => {
      const team = userRows.map((row, index) => ({
        rowIndex: row.id,
        id: row.id,  // Unique id for each team member (could be replaced with a better unique identifier if available)
        nome: row.userName,
        area: "",  // You need to populate this field, perhaps from another source or input
        email: row.email,
      }));
    
      onTeamChange(team); // Notify parent component with the full team
    }, [userRows, onTeamChange]);  // This is your dependency array
    
  const handleAddRow = () => {
    setUserRows([...userRows, { rowIndex: Date.now(), id: Date.now(), userName: '', email: '' }]);
  };
  
  const handleDeleteRow = (id: number) => {
    const values = userRows.filter((row) => row.rowIndex !== id);
    setUserRows(userRows.filter((row) => row.rowIndex !== id));
    setSelectedItens(values.map(v => ({rowIndex: v.rowIndex, id: v.id, value: v.userName + (v.email ? " - " + v.email : "")})))
  };

  const handleUserChange = (rowIndex: number, id: number, value: string) => {
    const trimmedValue = value.trim();
    const [userName, email] = trimmedValue.split(" - ").map((str) => str.trim());
    const newValue = userName + (email ? " - " + email : "");

    
    // Update the userRows state
    setUserRows(
      userRows.map((row) =>
          row.id === id
              ? { 
                  ...row,
                  id: users.find(v => v.email === email)?.id ?? 0,  // Fallback to 0 if undefined
                  userName: userName || "", 
                  email: email || "" 
                }
              : row
      )
    );

    // Update selected items, ensuring no duplicates
    setSelectedItens((prev) => {
      const updated = prev.filter((item) => item.rowIndex !== rowIndex); // Remove old value if it exists
    
      if (newValue) {
        // Add new value as an ISelectedItem object
        const newItem: ISelectedItem = {
          rowIndex: users.find(v => v.email === email)?.id ?? 0,  // Assuming `rowIndex` is available
          id: users.find(v => v.email === email)?.id ?? 0,        // Assuming `rowIndex` can be used as the ID or adjust as needed
          value: newValue,     // The value is the string we want to store
        };
        return [...updated, newItem];  // Add the new item if valid
      }
    
      return updated; // Return the updated list without adding anything if newValue is empty
    });
  };

  return (
    <div className="cmp-list-user-create">
      <table>
        <thead className="cmp-list-user-create-header">
          <tr>
            <td>
              <div className="cmp-list-user-create-add" onClick={handleAddRow}>
                <UserAddOutlined className="cmp-list-user-create-add-icon" />
                <p>ADICIONE À EQUIPE</p>
              </div>
            </td>
          </tr>
          </thead>
          <tbody>
          {userRows.map((row) => (
            <tr key={row.rowIndex}>
              <td>
                <div className="cmp-list-user-create-item">
                  <div className="cmp-list-user-create-item-info">
                    <Input
                      type="users"
                      value={`${row.userName.toUpperCase()}${row.email ? ` - ${row.email}` : ''}`}
                      onChange={(e) => handleUserChange(row.rowIndex, row.id, e.target.value)}
                      selectedItens={selectedItens}
                    />
                  </div>
                  <div className="cmp-list-user-create-item-close">
                    <CloseCircleOutlined
                      className="cmp-close-list-user"
                      onClick={() => handleDeleteRow(row.rowIndex)}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ListFileCreate = ({ 
  tipo, 
  onFilesChange }: { 
    tipo: string; 
    onFilesChange: (files: IFile[]) => void 
  }) => {

  const { userEmail } = useAuth();
  const [fileRows, setFileRows] = useState<FileRow[]>([]);

  const handleAddRow = () => {
    setFileRows((prevRows) => {
      const updatedRows = [
        ...prevRows,
        { id: Date.now(), fileName: "", isUrl: false, url: '' }
      ];
      return updatedRows;
    });
  };
  
  const handleDeleteRow = (id: number) => {
    setFileRows((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.id !== id);
      // Atualizar o formValues.files
      onFilesChange(
        updatedRows.map((row) =>
          row.isUrl
            ? { url: row.url, file: new File([], "") } // Caso de URL
            : { url: `/files/${row.fileName}`, file: row.file! } // Caso de arquivo
        )
      );

      return updatedRows;
    });
  };
  
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
  
      // Hash the file content
      const hash = await generateFileHash(file);
  
      const newFileName = `${hash}_${file.name}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
  
      // Update the fileRows with the new file object
      const newFileRows = fileRows.map((row) =>
        row.id === id
          ? { ...row, fileName: `${file.name}`, isUrl: false, file: renamedFile } // Store the file object
          : row
      );
  
      setFileRows(newFileRows);
  
      // Map to IFile[] structure and ensure TypeScript knows row has 'file'
      onFilesChange(newFileRows.map((row) => {
        if (isFileWithFile(row)) {
          return { url: `/files/${row.fileName}`, file: row.file }; // Use the file object
        } else {
          return { url: row.url, file: new File([], '') }; // Handle URL case with empty file
        }
      }));
    }
  };
  
  // Function to generate a SHA-256 hash from the file content
  const generateFileHash = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = new Uint8Array(hashBuffer);
          const hashHex = Array.from(hashArray)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
          resolve(hashHex);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
  
  // Type guard to check if 'row' has the 'file' property
  function isFileWithFile(row: { id: number; fileName: string; isUrl: boolean; url: string; file?: File }): row is { id: number; fileName: string; isUrl: boolean; url: string; file: File } {
    return (row as { file: File }).file !== undefined; // Check if the 'file' property exists
  } 
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const url = e.target.value;
    const newFileRows = fileRows.map((row) =>
      row.id === id ? { ...row, url, isUrl: true, fileName: '' } : row // Update only the URL part
    );
    setFileRows(newFileRows);
    
    // Map to IFile[] structure
    onFilesChange(newFileRows.map((row) => ({
      url: row.url,  // Use the URL entered by the user
      file: new File([], '')  // Empty file object for URL-based entry
    })));
  };

  useEffect(() => {
    if ((tipo === "Filme" || tipo === "Roteiro") && fileRows.length === 0) {
      setFileRows([{ id: Date.now(), fileName: "", isUrl: false, url: "" }]);
    }
  }, [tipo, fileRows]);  

  return (
    <div className="cmp-list-file-create">
      <table>
        <thead className="cmp-list-file-create-header">
          {(tipo === 'Trilha' || tipo === 'Foto') && (
            <tr>
              <td>
                <div className="cmp-list-file-create-add" onClick={handleAddRow}>
                  <FileAddOutlined className="cmp-list-file-create-add-icon" />
                  <p>ADICIONE CONTEÚDOS</p>
                </div>
              </td>
            </tr>
          )}
        </thead>
        <tbody>
          {fileRows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="cmp-list-file-create-item">
                  <div className="cmp-list-file-create-item-info">
                    {row.isUrl ? (
                      <input
                        type="url"
                        value={row.url}
                        onChange={(e) => handleUrlChange(e, row.id)}
                        placeholder="Enter file URL"
                      />
                    ) : (
                      <>
                        <label htmlFor={`file-${row.id}`}>
                          <div className="cmp-list-file-create-item-info-button">
                            <CloudUploadOutlined className="cmp-upload-file" />
                          </div>
                          <div className="cmp-list-file-create-item-info-file-name">
                            <span>{row.fileName || "No file selected"}</span>
                          </div>
                        </label>
                        <input
                          type="file"
                          id={`file-${row.id}`}
                          name="filename"
                          className="cmp-input-file"
                          onChange={(e) => handleFileChange(e, row.id)}
                          style={{ display: "none" }}
                        />
                      </>
                    )}
                  </div>
                  {fileRows.length > 1 && (
                    <div className="cmp-list-file-create-item-close">
                      <CloseCircleOutlined
                        className="cmp-close-list-file"
                        onClick={() => handleDeleteRow(row.id)}
                      />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};