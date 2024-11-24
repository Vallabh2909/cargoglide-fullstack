'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, File, Upload, X, Check } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios'

// Function to upload the file using axios
const uploadFileWithAxios = (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('doc', file)

  return axios.post(`${process.env.SERVER  || "http://localhost:8000"}/api/v1/customers/upload-doc`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })
    .then(response => response.data) // Assuming the API response contains the uploaded file URL
    .catch(error => {
      throw new Error('An error occurred while uploading the file. Please try again.')
    })
}

// Mock function to simulate fetching existing documents
const FetchExistingDocuments = (): Promise<{ name: string, file: string }[]> => {
  return axios.get(`${process.env.SERVER || "http://localhost:8000"}/api/v1/customers/get-docs`,{withCredentials: true})
    .then(response => response.data.documents)
    .catch(error => {
      throw new Error('An error occurred while fetching existing documents. Please try again.')
    })
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, file: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [existingDocuments, setExistingDocuments] = useState<{ name: string, file: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchExistingDocs = async () => {
      try {
        const docs = await FetchExistingDocuments();
        setExistingDocuments(docs); // Set the documents array
        setUploadedFiles(docs); // Initialize uploaded files
      } catch (error) {
        setError('Failed to fetch existing documents.');
      }
    };
    fetchExistingDocs()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const invalidFiles = newFiles.filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        return !validTypes.includes(file.type) || file.size > 5 * 1024 * 1024 // 5MB limit
      })

      const duplicateFiles = newFiles.filter(file => 
        existingDocuments.some(doc => doc.name.toLowerCase() === file.name.toLowerCase())
      )

      if (invalidFiles.length > 0 || duplicateFiles.length > 0) {
        setError('Some files were not added. Please ensure all files are PDF, JPEG, PNG, or DOC/DOCX, under 5MB, and not already uploaded.')
        const validFiles = newFiles.filter(file => !invalidFiles.includes(file) && !duplicateFiles.includes(file))
        setFiles(prevFiles => [...prevFiles, ...validFiles])
      } else {
        setFiles(prevFiles => [...prevFiles, ...newFiles])
        setError(null)
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    setUploading(true)
    setError(null)

    try {
      const uploadedUrls = await Promise.all(files.map(file => uploadFileWithAxios(file)))
    //   const newUploadedFiles = files.map((file, index) => ({
    //     name: file.name,
    //     url: uploadedUrls[index]
    //   }))

    //   setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles])
    //   setExistingDocuments(prevDocs => [...prevDocs, ...newUploadedFiles])
      setFiles([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError('An error occurred while uploading files. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>Upload your documents here. Accepted file types: PDF, JPEG, PNG, DOC, DOCX. Maximum file size: 5MB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="mt-1"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {files.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="flex items-center">
                        <File className="mr-2 h-4 w-4" />
                        {file.name}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? 'Uploading...' : 'Upload Files'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      <a href={file.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {file.file}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center text-green-600">
                        <Check className="mr-2 h-4 w-4" />
                        Uploaded
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
