import { useRef, useState } from "react";

interface Props {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function FileDropzone({ files, setFiles }: Props) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    setFiles([...files, ...fileArray]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-3">

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >

        <p className="text-gray-600">
          Kéo thả file vào đây hoặc click để chọn file
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

      </div>

      {/* Danh sách file đã chọn */}
      {files.length > 0 && (
        <div className="space-y-1 text-sm text-gray-700">
          {files.map((file, index) => (
            <div key={index}>
              {file.name}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}