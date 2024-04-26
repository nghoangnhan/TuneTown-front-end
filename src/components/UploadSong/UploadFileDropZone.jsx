import { Button } from "antd";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

const UploadFileDropZone = (props) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
        props.setUploadedFile(file);
      };
      reader.readAsArrayBuffer(file);
      props.handleUploadFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    onDrop,
    maxSize: 10485760,
    maxFiles: 1,
    accept:
      props.accept === "image/jpeg, image/png" || props.accept === "image/*"
        ? {
          "image/jpeg": [".jpg", ".jpeg"],
          "image/png": [".png"],
        }
        : props.accept === "audio/mp3" || props.accept === "audio/*"
          ? {
            "audio/mpeg": [".mp3"],
            "audio/wav": [".wav"],
            "audio/webm": [".webm"],
            "audio/flac": [".flac"],
            "audio/x-m4a": [".m4a"],
          }
          : undefined,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        type="button"
        onClick={open}
        variant="contained"
        className="border border-solid border-[#42ae49] bg-white hover:bg-[#42ae49] hover:text-white text-[#42ae49]"
        sx={{ width: "100%", height: 24 }}
      >
        Select file
      </Button>
    </div>
  );
};

UploadFileDropZone.propTypes = {
  uploadedFile: PropTypes.object,
  setUploadedFile: PropTypes.func,
  handleUploadFile: PropTypes.func,
  accept: PropTypes.string,
};

export default UploadFileDropZone;
