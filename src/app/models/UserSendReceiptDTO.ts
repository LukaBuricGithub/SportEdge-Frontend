export interface UserSendReceiptDTO 
{
    firstName:string;
    lastName:string;
    email:string;
    subject:string;
    content:string;
    pdfBase64?:string | null;
}