import { Button } from "@chakra-ui/react";
import * as React from "react";
interface downloadFileProps {
  data: string;
  fileName: string;
  fileType: string;
}
export default function ExportProjectButton() {
  const downloadFile = ({ data, fileName, fileType } : downloadFileProps) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  const exportToJson = (e : React.MouseEvent) => {
    console.log(localStorage);
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(localStorage),
      fileName: 'project.json',
      fileType: 'text/json',
    })
  }
  return (
    <>
      <Button
        onClick={exportToJson}
        size={'sm'}
        variant='outline'
      >
        Export project in JSON
      </Button>
    </>
  );
}
