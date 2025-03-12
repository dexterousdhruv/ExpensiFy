export const formatCurrency = (amt: any) => {
  amt /= 100
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "INR"
  })
}



export function downloadFile(downloadUrl: string) {
  const link = document.createElement('a');
  link.href = downloadUrl;

  link.download = downloadUrl.split("/").slice(-1)[0] || 'downloaded_file';

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    link.dispatchEvent(event);
  } else {
    link.click();
  }
  
  link.remove();
}
