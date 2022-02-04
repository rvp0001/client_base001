
import {useState,useEffect} from 'react'
import { execGql, execGql_xx } from '../gqlclientconfig';
import constant,{initDocumentstatus,newDocument} from '../common/constant';

function useTableAction(fetchGraphQuery:any, doctype:String,deleteGraphQuery:any) {
    const [tableData, setTableData] = useState([])
    const [loaderDisplay, setloaderDisplay] = useState(false) 
    const [docno, setDocno] = useState('NO-ID')
    const [redirect, setRedirect] = useState(false)
    const [documentstatus, setDocumentstatus] = useState(initDocumentstatus)
    const values = {...constant}
   useEffect(() => {
    setloaderDisplay(!loaderDisplay) 
    getTableData().then((data:any)=>{
      
           setTableData(data)
           setloaderDisplay(loaderDisplay)         
       });
     return () => {
       
     }
   }, [])

   const getTableData = () => {
        var result: any = '';
        return new Promise(async(reolve,reject)=>{
          try {       
            result = await execGql('query', fetchGraphQuery, values)
            if (!result) {
              console.log({ "errors": [], "errorMessage": 'No errors and results from GQL' })
              alert("No data to display")
              reject("No data to display")
              // return callback({"errors":[],"errorMessage":'No errors and results from GQL'} ,'');
            }
            else {
              console.log(result.data[doctype+"s"])
              reolve(result.data[doctype+"s"])
            }
          }
          catch (err:any) {
            let errors = err.errorsGql;
            let errorMessage = err.errorMessageGql;
            console.log({ "errors": errors, "errorMessage": errorMessage })
            reject({ "errors": errors, "errorMessage": errorMessage })
            
          }
        })
      }

     const deleteDocument = (id:String) =>{
      const docstatus = {...documentstatus}
      docstatus.action= true;
      docstatus.dailogtitle= doctype + ' Deletion';
      docstatus.dailogtext= 'Delete ' + doctype + '?'
      docstatus.yesaction= async () => {
        await handleDelete(id)
        setloaderDisplay(!loaderDisplay) 
        getTableData().then((data:any)=>{
          
               setTableData(data)
               setloaderDisplay(loaderDisplay)         
           });
          docstatus.action= false;
          docstatus.snackbaropen=true;
          docstatus.snackbarseverity='success';
          docstatus.snackbartext= doctype + ' Deleted'
          setDocumentstatus({...docstatus})
      }
      docstatus.noaction= () => {
        docstatus.action = false;
        setDocumentstatus({...docstatus})
      }
      setDocumentstatus({...docstatus});
    }

     const handleDelete = async (z_id: String) => {
       return new Promise(async (resolve, reject) => {
        var result: any = '', errorMessage = '', errors = new Array();
        try {
          result = await execGql('mutation', deleteGraphQuery, { z_id })
          if (!result) {
          console.log({ "errors": [], "errorMessage": 'No errors and results from GQL' })
          reject({ "errors": [], "errorMessage": 'No errors and results from GQL' })
          // return callback({"errors":[],"errorMessage":'No errors and results from GQL'} ,'');
        } else {
          resolve(result.data)
          return result.data;
        }
        }catch (err:any) {
          errors = err.errorsGql;
          errorMessage = err.errorMessageGql;
          console.log({ "errors": errors, "errorMessage": errorMessage })
          reject({ "errors": errors, "errorMessage": errorMessage })
          // return callback({"errors":errors,"errorMessage":errorMessage},'' );
        }
       })
      
    }
    const closeSnackBar=()=>{
      let docstatus={...documentstatus}
        docstatus.snackbaropen=false;
      setDocumentstatus(docstatus)
    }
      return [tableData,loaderDisplay,docno, setDocno,redirect, setRedirect,documentstatus,deleteDocument,closeSnackBar]
}

export default useTableAction
